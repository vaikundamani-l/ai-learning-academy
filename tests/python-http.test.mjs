import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {socketClient,localServer,clientRunner,libraryClient,byteExample,byteOutput,framingReasoning,httpQuestions} from '../src/data/pythonHttpContent.ts';
import {httpFixture,httpResponseTrace} from '../src/utils/httpResponseTrace.ts';
const run=(code,input,dir)=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:15000,input,cwd:dir}).trim();
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-http-'));try{writeFileSync(join(dir,'socket_client.py'),socketClient);writeFileSync(join(dir,'fixture_server.py'),localServer);writeFileSync(join(dir,'fetch_report.py'),clientRunner);writeFileSync(join(dir,'library_client.py'),libraryClient);return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const stub=String.raw`
class Stub:
    def __init__(self, pieces):
        self.pieces = list(pieces)
        self.timeouts = []
        self.sizes = []
    def settimeout(self, value):
        self.timeouts.append(value)
    def recv(self, size):
        self.sizes.append(size)
        if not self.pieces:
            return b""
        data = self.pieces.pop(0)
        if len(data) > size:
            self.pieces.insert(0, data[size:])
            data = data[:size]
        return data
`;
const liveSetup=String.raw`
import threading
import socketserver
from fixture_server import Handler
server = socketserver.TCPServer(("127.0.0.1", 0), Handler)
thread = threading.Thread(target=server.serve_forever, kwargs={"poll_interval": 0.01}, daemon=True)
thread.start()
port = server.server_address[1]
`;
const liveCleanup='\nfinally:\n    server.shutdown()\n    server.server_close()\n    thread.join(timeout=2)';

test('byte and receive-partition reasoning programs execute with documented output',()=>{
 assert.equal(run(byteExample),byteOutput);for(const variant of framingReasoning.variants)assert.equal(run(variant.code),variant.output);
});
test('socket reader handles every single split and selected one-byte/coalesced partitions identically',()=>workspace(dir=>{
 const wire=httpFixture('valid').wire;
 assert.equal(run('from socket_client import *\n'+stub+String.raw`
import json, sys
wire = json.load(sys.stdin).encode("ascii")
for split in range(len(wire) + 1):
    pieces = [piece for piece in (wire[:split], wire[split:]) if piece]
    source = Stub(pieces)
    status, body = read_response(source, time.monotonic() + 2)
    assert status == 200
    assert decode_report(body) == {"topic": "cpu", "minutes": 20}
    assert all(0 < size <= 512 for size in source.sizes)
for size in [1, 2, 7, 23, 512]:
    status, body = read_response(Stub([wire[i:i+size] for i in range(0, len(wire), size)]), time.monotonic() + 2)
    assert body == b'{"topic":"cpu","minutes":20}'
print("verified")`,JSON.stringify(wire),dir),'verified');
}));
test('browser fixtures agree with real Python framing/status outcomes for multiple receive sizes',()=>workspace(dir=>{
 const rows=[];for(const kind of ['valid','truncated','missing','badLength'])for(const size of [1,7,23,256]){
  const model=httpResponseTrace(kind,size);const fixture=httpFixture(kind);rows.push({kind,size,wire:fixture.wire});
  assert.ok(model.frames.every(f=>f.received<=fixture.wire.length));for(let i=1;i<model.frames.length;i++)assert.ok(model.frames[i].received>=model.frames[i-1].received);
  assert.equal(model.result,kind==='valid'?fixture.body:kind==='missing'?'HTTP 404':kind==='truncated'?'Protocol error: EOF before complete body':'Protocol error: one bounded Content-Length required');
 }
 const results=JSON.parse(run('from socket_client import *\n'+stub+String.raw`
import json, sys
out = []
for row in json.load(sys.stdin):
    wire = row["wire"].encode("ascii")
    size = row["size"]
    try:
        status, body = read_response(Stub([wire[i:i+size] for i in range(0, len(wire), size)]), time.monotonic() + 2)
        if status != 200:
            out.append(f"HTTP {status}")
        else:
            decode_report(body)
            out.append(body.decode("ascii"))
    except ProtocolError as error:
        out.append(f"Protocol error: {error}")
print(json.dumps(out))`,JSON.stringify(rows),dir));
 assert.deepEqual(results,rows.map(row=>httpResponseTrace(row.kind,row.size).result));
 for(const size of [1,23,256])assert.equal(httpResponseTrace('timeout',size).frames.at(-1).phase,'Timeout');
 assert.throws(()=>httpResponseTrace('valid',0),RangeError);assert.throws(()=>httpResponseTrace('unknown',23),RangeError);
}));
test('HTTP subset rejects ambiguous/unsupported headers, versions, sizes and premature closure',()=>workspace(dir=>{
 assert.equal(run('from socket_client import *\n'+stub+String.raw`
valid = b"HTTP/1.1 200 OK\r\nContent-Length: 0\r\nContent-Type: application/json"
assert parse_head(valid) == (200, 0)
assert parse_head(valid.replace(b"Content-Length", b"content-length")) == (200, 0)
bad = [valid.replace(b"HTTP/1.1", b"HTTP/1.0"), valid.replace(b"200 OK", b"204 No Content"),
       valid.replace(b"200 OK", b"200"), valid.replace(b"Content-Length: 0", b"Content-Length: x"),
       valid.replace(b"Content-Length: 0", b"Content-Length: 4097"), valid.replace(b"Content-Length: 0", b"Content-Length: 10000"),
       valid + b"\r\nContent-Length: 0", valid + b"\r\nTransfer-Encoding: chunked",
       valid + b"\r\nContent-Encoding: gzip", valid.replace(b"application/json", b"text/plain"),
       valid.replace(b"Content-Length: 0\r\n", b""), valid + b"\r\n folded", valid + b"\r\nX: bad\x00"]
for head in bad:
    try:
        parse_head(head)
    except ProtocolError:
        continue
    raise AssertionError("unsupported header accepted")
body = b" " * 4096
large = valid.replace(b"Content-Length: 0", b"Content-Length: 4096") + b"\r\n\r\n" + body
assert len(read_response(Stub([large]), time.monotonic()+2)[1]) == 4096
padding = 4096 - (len(valid) + len(b"\r\nX: ") + 4)
exact_head = valid + b"\r\nX: " + b"a" * padding + b"\r\n\r\n"
assert len(exact_head) == 4096
assert read_response(Stub([exact_head]), time.monotonic()+2) == (200,b"")
for wire in [b"", b"HTTP/1.1", b"x" * 4097, b"HTTP/1.1 200 OK\r\nX: " + b"x"*4096 + b"\r\n\r\n", valid + b"\r\n\r\nx"]:
    try:
        read_response(Stub([wire]), time.monotonic()+2)
    except ProtocolError:
        continue
    raise AssertionError("bad framing accepted")
print("verified")`,undefined,dir),'verified');
}));
test('decode_report rejects malformed UTF8/JSON, duplicate keys, constants and wrong schema/types/ranges',()=>workspace(dir=>{
 assert.equal(run('from socket_client import *\n'+String.raw`
for minutes in [0, 60]:
    assert decode_report(json.dumps({"topic":"cpu","minutes":minutes}).encode()) == {"topic":"cpu","minutes":minutes}
bad = [b"\xff", b"{", b'{"topic":"cpu","minutes":1,"minutes":2}', b'{"topic":"cpu","minutes":NaN}', b'[]',
       b'{"topic":"cpu"}', b'{"topic":"cpu","minutes":20,"extra":1}', b'{"topic":"CPU","minutes":20}',
       b'{"topic":"cpu","minutes":true}', b'{"topic":"cpu","minutes":"20"}', b'{"topic":"cpu","minutes":20.0}',
       b'{"topic":"cpu","minutes":-1}', b'{"topic":"cpu","minutes":61}']
for body in bad:
    try:
        decode_report(body)
    except (ValueError, UnicodeError):
        continue
    raise AssertionError("invalid data accepted")
print("verified")`,undefined,dir),'verified');
}));
test('network boundary validation happens before connection and deadline allowances decrease',()=>workspace(dir=>{
 assert.equal(run('import socket_client as c\n'+stub+String.raw`
from unittest.mock import patch
for args in [(True,), (0,), (65536,), (1,"/data\r\nInjected: x"), (1,"/data",0), (1,"/data",float("nan")), (1,"/data",float("inf")), (1,"/data",True)]:
    with patch.object(c.socket,"create_connection",side_effect=AssertionError("network should not run")):
        try:
            c.fetch_bytes(*args)
        except ValueError:
            continue
        raise AssertionError("invalid request accepted")
with patch.object(c.time,"monotonic",side_effect=[1,2,3]):
    assert [c.remaining(4),c.remaining(4),c.remaining(4)] == [3,2,1]
with patch.object(c.time,"monotonic",return_value=4):
    try:
        c.remaining(4)
    except TimeoutError:
        pass
    else:
        raise AssertionError("deadline ignored")
source = Stub([b"HTTP/1.1 ", b"200 OK\r\nContent-Length: 0\r\nContent-Type: application/json\r\n\r\n"])
with patch.object(c.time,"monotonic",side_effect=[1,2]):
    assert c.read_response(source,4) == (200,b"")
assert source.timeouts == [3,2]
print("verified")`,undefined,dir),'verified');
}));
test('real loopback fixture exercises success, status, truncation, decoding, schema and timeout paths',()=>workspace(dir=>{
 assert.equal(run('from socket_client import *\n'+liveSetup+String.raw`
try:
    assert decode_report(fetch_bytes(port)) == {"topic":"cpu","minutes":20}
    for path, error_type in [("/missing",HttpStatusError),("/broken",ProtocolError),("/invalid-json",ValueError),("/wrong-type",ValueError)]:
        try:
            decode_report(fetch_bytes(port,path))
        except error_type:
            continue
        raise AssertionError("fixture failure not preserved")
    try:
        fetch_bytes(port,"/slow",timeout=0.05)
    except TimeoutError:
        pass
    else:
        raise AssertionError("slow fixture did not time out")
    print("verified")`+liveCleanup,undefined,dir),'verified');
}));
test('actual CLI emits success only after validation and has nonzero exit/no stdout on failures',()=>workspace(dir=>{
 assert.equal(run('import subprocess, sys, json\n'+liveSetup+String.raw`
try:
    good = subprocess.run([sys.executable,"fetch_report.py",str(port)],capture_output=True,text=True,timeout=5)
    assert good.returncode == 0, good.stderr
    assert json.loads(good.stdout) == {"minutes":20,"topic":"cpu"}
    for path in ["/missing","/broken","/invalid-json","/wrong-type","/unknown"]:
        result = subprocess.run([sys.executable,"fetch_report.py",str(port),"--path",path],capture_output=True,text=True,timeout=5)
        assert result.returncode == 2
        assert result.stdout == ""
        assert result.stderr.startswith("request failed:")
    print("verified")`+liveCleanup,undefined,dir),'verified');
}));
test('library client works against actual local fixtures and preserves status/framing/domain failures',()=>workspace(dir=>{
 assert.equal(run('from library_client import library_report\nfrom socket_client import HttpStatusError\n'+liveSetup+String.raw`
try:
    assert library_report(port) == {"topic":"cpu","minutes":20}
    for path, error_type in [("/missing",HttpStatusError),("/broken",ValueError),("/invalid-json",ValueError),("/wrong-type",ValueError)]:
        try:
            library_report(port,path)
        except error_type:
            continue
        raise AssertionError("library failure lost")
    print("verified")`+liveCleanup,undefined,dir),'verified');
}));
test('inventory transfer rejects zero/booleans/text and composes only with complete successful bytes',()=>workspace(dir=>{
 assert.equal(run('from socket_client import *\n'+stub+String.raw`
def decode_inventory(body):
    data = json.loads(body.decode("utf-8"),object_pairs_hook=unique_object,parse_constant=reject_constant)
    if type(data) is not dict or set(data) != {"item","qty"}:
        raise ValueError("inventory fields")
    if type(data["item"]) is not str or re.fullmatch(r"[a-z]{1,8}",data["item"]) is None:
        raise ValueError("inventory item")
    if type(data["qty"]) is not int or not 1 <= data["qty"] <= 100:
        raise ValueError("inventory quantity")
    return data
for data in [{"item":"bolt","qty":3},{"item":"nut","qty":100}]:
    assert decode_inventory(json.dumps(data).encode()) == data
for qty in [0,101,True,"3",3.0]:
    try:
        decode_inventory(json.dumps({"item":"bolt","qty":qty}).encode())
    except ValueError:
        continue
    raise AssertionError("invalid inventory accepted")
body = b'{"item":"bolt","qty":3}'
head = b"HTTP/1.1 200 OK\r\nContent-Length: " + str(len(body)).encode() + b"\r\nContent-Type: application/json\r\n\r\n"
status, complete = read_response(Stub([head,body]),time.monotonic()+2)
assert status == 200 and decode_inventory(complete)["qty"] == 3
try:
    read_response(Stub([head,body[:-1]]),time.monotonic()+2)
except ProtocolError:
    print("verified")`,undefined,dir),'verified');
}));
test('standalone fixture server command prints its chosen port, serves and stops cleanly',()=>workspace(dir=>{
 assert.equal(run('import subprocess, sys, signal\nfrom socket_client import fetch_bytes, decode_report\n'+String.raw`
process = subprocess.Popen([sys.executable,"fixture_server.py"],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
try:
    line = process.stdout.readline().strip()
    assert line.startswith("Local fixture port: ")
    port = int(line.rsplit(" ",1)[1])
    assert decode_report(fetch_bytes(port))["minutes"] == 20
finally:
    process.send_signal(signal.SIGINT)
    process.communicate(timeout=5)
assert process.returncode == 0
print("verified")`,undefined,dir),'verified');
}));
test('HTTP quiz has exactly one correct option and balanced answer positions',()=>{
 const counts=[0,0,0];for(const q of httpQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});
