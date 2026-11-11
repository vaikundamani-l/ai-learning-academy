import type {ReasoningChallengeData} from './pythonReasoningChallenges';

export const socketClient = String.raw`import json
import math
import re
import socket
import time

MAX_HEAD = 4096
MAX_BODY = 4096
PATHS = {"/data", "/missing", "/broken", "/slow", "/invalid-json", "/wrong-type"}

class ProtocolError(ValueError):
    pass

class HttpStatusError(RuntimeError):
    pass

def remaining(deadline):
    seconds = deadline - time.monotonic()
    if seconds <= 0:
        raise TimeoutError("network deadline exceeded")
    return seconds

def parse_head(head):
    lines = head.split(b"\r\n")
    match = re.fullmatch(rb"HTTP/1\.1 ([0-9]{3}) [\x20-\x7e]*", lines[0])
    if match is None:
        raise ProtocolError("invalid status line")
    status = int(match.group(1))
    if status not in (200, 404, 500):
        raise ProtocolError("status outside this teaching subset")
    headers = {}
    for line in lines[1:]:
        name, separator, value = line.partition(b":")
        if not separator or re.fullmatch(rb"[A-Za-z][A-Za-z-]*", name) is None:
            raise ProtocolError("unsupported header name or line")
        if any(byte < 32 or byte > 126 for byte in value):
            raise ProtocolError("unsupported header value")
        name = name.lower()
        if name in headers:
            raise ProtocolError("duplicate header")
        headers[name] = value.strip(b" ")
    if b"transfer-encoding" in headers or b"content-encoding" in headers:
        raise ProtocolError("transfer/content coding unsupported")
    length = headers.get(b"content-length", b"")
    if re.fullmatch(rb"[0-9]{1,4}", length) is None:
        raise ProtocolError("one bounded Content-Length required")
    size = int(length)
    if size > MAX_BODY:
        raise ProtocolError("body too large")
    if headers.get(b"content-type") != b"application/json":
        raise ProtocolError("application/json required")
    return status, size

def read_response(connection, deadline):
    buffer = bytearray()
    while b"\r\n\r\n" not in buffer:
        connection.settimeout(remaining(deadline))
        chunk = connection.recv(512)
        if not chunk:
            raise ProtocolError("EOF before complete headers")
        buffer.extend(chunk)
        boundary = buffer.find(b"\r\n\r\n")
        if (boundary < 0 and len(buffer) > MAX_HEAD) or boundary + 4 > MAX_HEAD:
            raise ProtocolError("headers too large")
    head, body = bytes(buffer).split(b"\r\n\r\n", 1)
    status, expected = parse_head(head)
    if len(body) > expected:
        raise ProtocolError("unexpected bytes after declared body")
    while len(body) < expected:
        connection.settimeout(remaining(deadline))
        chunk = connection.recv(min(512, expected - len(body)))
        if not chunk:
            raise ProtocolError("EOF before complete body")
        body += chunk
    return status, body

def fetch_bytes(port, path="/data", timeout=2):
    if type(port) is not int or not 1 <= port <= 65535:
        raise ValueError("port must be an integer from 1 to 65535")
    if path not in PATHS:
        raise ValueError("choose a declared local fixture path")
    if type(timeout) not in (int, float) or not math.isfinite(timeout) or not 0 < timeout <= 5:
        raise ValueError("timeout must be finite, positive and at most 5 seconds")
    deadline = time.monotonic() + timeout
    request = (f"GET {path} HTTP/1.1\r\n"
               f"Host: 127.0.0.1:{port}\r\n"
               "Accept: application/json\r\n"
               "Connection: close\r\n\r\n").encode("ascii")
    with socket.create_connection(("127.0.0.1", port), timeout=remaining(deadline)) as connection:
        connection.settimeout(remaining(deadline))
        connection.sendall(request)
        status, body = read_response(connection, deadline)
    if status != 200:
        raise HttpStatusError(f"HTTP {status}")
    return body

def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key")
        result[key] = value
    return result

def reject_constant(value):
    raise ValueError("nonstandard JSON constant")

def decode_report(body):
    data = json.loads(body.decode("utf-8"), object_pairs_hook=unique_object,
                      parse_constant=reject_constant)
    if type(data) is not dict or set(data) != {"topic", "minutes"}:
        raise ValueError("expected topic and minutes fields")
    if type(data["topic"]) is not str or re.fullmatch(r"[a-z]{1,12}", data["topic"]) is None:
        raise ValueError("invalid topic")
    if type(data["minutes"]) is not int or not 0 <= data["minutes"] <= 60:
        raise ValueError("minutes must be an exact integer from 0 to 60")
    return data`;

export const localServer = String.raw`import json
import socketserver
import time

class Handler(socketserver.BaseRequestHandler):
    def handle(self):
        self.request.settimeout(1)
        request = bytearray()
        try:
            while b"\r\n\r\n" not in request:
                chunk = self.request.recv(512)
                if not chunk or len(request) + len(chunk) > 4096:
                    return
                request.extend(chunk)
            first_line = bytes(request).split(b"\r\n", 1)[0]
            parts = first_line.split(b" ")
            if len(parts) != 3 or parts[0] != b"GET":
                return
            path = parts[1]
            status, reason = 200, "OK"
            body = json.dumps({"topic": "cpu", "minutes": 20}, separators=(",", ":")).encode("utf-8")
            if path == b"/missing":
                status, reason, body = 404, "Not Found", b'{"error":"missing"}'
            elif path == b"/slow":
                time.sleep(0.4)
            elif path == b"/invalid-json":
                body = b"{"
            elif path == b"/wrong-type":
                body = b'{"topic":"cpu","minutes":"20"}'
            elif path not in (b"/data", b"/broken"):
                return
            length = len(body) + (5 if path == b"/broken" else 0)
            head = (f"HTTP/1.1 {status} {reason}\r\n"
                    f"Content-Length: {length}\r\n"
                    "Content-Type: application/json\r\n"
                    "Connection: close\r\n\r\n").encode("ascii")
            wire = head + body
            for piece in (wire[:17], wire[17:51], wire[51:]):
                self.request.sendall(piece)
        except OSError:
            return

if __name__ == "__main__":
    with socketserver.TCPServer(("127.0.0.1", 0), Handler) as server:
        print(f"Local fixture port: {server.server_address[1]}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass`;

export const clientRunner = String.raw`import argparse
import json
from socket_client import fetch_bytes, decode_report, HttpStatusError

parser = argparse.ArgumentParser(description="Fetch one declared local fixture")
parser.add_argument("port", type=int)
parser.add_argument("--path", default="/data")
args = parser.parse_args()
try:
    report = decode_report(fetch_bytes(args.port, args.path))
except (OSError, ValueError, HttpStatusError) as error:
    parser.exit(2, f"request failed: {error}\n")
print(json.dumps(report, sort_keys=True))`;

export const libraryClient = String.raw`import re
import http.client
from socket_client import decode_report, HttpStatusError

def library_report(port, path="/data"):
    if type(port) is not int or not 1 <= port <= 65535:
        raise ValueError("invalid local port")
    if path not in {"/data", "/missing", "/broken", "/slow", "/invalid-json", "/wrong-type"}:
        raise ValueError("invalid fixture path")
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=2)
    try:
        connection.request("GET", path, headers={"Accept": "application/json"})
        response = connection.getresponse()
        if response.status != 200:
            raise HttpStatusError(f"HTTP {response.status}")
        if response.getheader("Content-Type") != "application/json":
            raise ValueError("application/json required")
        length = response.getheader("Content-Length")
        coding = response.getheader("Transfer-Encoding")
        if coding is not None and length is not None:
            raise ValueError("ambiguous framing headers")
        if response.getheader("Content-Encoding") is not None:
            raise ValueError("content coding unsupported by this application")
        expected = None
        if length is not None:
            if re.fullmatch(r"[0-9]{1,4}", length) is None:
                raise ValueError("invalid declared length")
            expected = int(length)
            if expected > 4096:
                raise ValueError("body too large")
        body = response.read(4097)
        if len(body) > 4096:
            raise ValueError("body too large")
        if expected is not None and len(body) != expected:
            raise ValueError("incomplete declared body")
        return decode_report(body)
    finally:
        connection.close()`;

export const byteExample = String.raw`text = "café"
encoded = text.encode("utf-8")
print(len(text), len(encoded))
first, second = encoded[:4], encoded[4:]
try:
    print(first.decode("utf-8"))
except UnicodeDecodeError:
    print("First chunk ends inside a character")
print((first + second).decode("utf-8"))`;
export const byteOutput = '4 5\nFirst chunk ends inside a character\ncafé';
export const framingReasoning:ReasoningChallengeData = {
    id:'http-one-read',title:'Did one receive return the complete body?',
    question:'Predict the text. Content-Length declares five bytes. Explain whether an individual receive result tells you that the complete body arrived.',
    transfer:'Partition the same five bytes as [b"h", b"ello"] and as [b"hello"]. Which result should a correct body reader preserve across both partitions?',
    variants:[
        {title:'Assume the first chunk is complete',code:'chunks = iter([b"he", b"llo"])\nbody = next(chunks)\nprint(body.decode("utf-8"))',output:'he',steps:['The fixture models two possible receive results, not two application messages.','The first receive supplies only two of the five declared bytes.','Decoding happens to succeed because these are ASCII bytes, yet the result is incomplete.']},
        {title:'Accumulate the declared length',code:'chunks = iter([b"he", b"llo"])\nexpected = 5\nbody = bytearray()\nwhile len(body) < expected:\n    body.extend(next(chunks))\nprint(body.decode("utf-8"))',output:'hello',steps:['Each modeled receive appends to the same body buffer.','Two bytes are insufficient; the next three complete the declared five.','The real client also handles premature EOF, byte limits, deadlines and header validation. This short fixture is not a complete socket reader.']},
    ],
};
const checks:[string,string[],number,string][] = [
 ['What does TCP provide to this client?', ['A byte stream','One complete HTTP response per receive','Decoded JSON objects'],0,'Application framing must be reconstructed over the stream.'],
 ['What separates HTTP/1.1 headers from the body here?', ['One space','CRLF CRLF','A JSON brace'],1,'The delimiter may itself be split across receives.'],
 ['What does Content-Length count?', ['Unicode characters','Packets','Body octets (bytes)'],2,'UTF-8 characters can require multiple bytes.'],
 ['When does b"" from recv mean failure for the shown body reader?', ['Always after a valid complete result','If EOF arrives before the declared body is complete','Only after JSON decoding'],1,'An early orderly close leaves an incomplete response.'],
 ['Does a complete HTTP 404 response mean TCP failed?', ['No; HTTP status and transport are separate','Yes, no response arrived','Only if the reason says Not Found'],0,'The server returned an application-level error response.'],
 ['Why decrease the remaining timeout on each receive?', ['To make every receive a new full allowance','To remove all size limits','To preserve a network-phase deadline across repeated reads'],2,'Repeated small reads should not reset the entire network budget.'],
 ['When should UTF-8 decoding occur in this bounded client?', ['Independently on every arbitrary receive','After reassembling the complete body','Before reading headers'],1,'A receive can end in the middle of a multibyte character.'],
 ['Does HTTP 200 guarantee a valid application report?', ['Yes','Only for JSON','No; decoding and schema/range checks remain'],2,'Success status does not establish the data contract.'],
 ['What does the scratch client do with Transfer-Encoding?', ['Reject it as outside its subset','Treat it as Content-Length','Pretend chunk markers are JSON'],0,'It does not implement chunked transfer coding or other codings.'],
 ['Should every failed operation be retried automatically?', ['Yes, with no delay','No; retry policy depends on operation, failure and budget','Only if it used a socket'],1,'A timeout can leave the outcome uncertain; retries can duplicate effects.'],
];
export const httpQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));
