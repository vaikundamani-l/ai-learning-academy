/**
 * Developer Tooling, Shell & Git Internals Pure Utilities
 * Pure deterministic functions for Git SHA-1 hashing, PATH resolution, and Shell pipeline modeling.
 */

/**
 * Pure JavaScript implementation of SHA-1 for Git content-addressable object hashing.
 * Deterministic and zero-dependency across both browser and Node environments.
 */
export function sha1(message: string): string {
  function rotateLeft(n: number, s: number): number {
    return (n << s) | (n >>> (32 - s));
  }

  // Pre-processing (Padding)
  const utf8 = unescape(encodeURIComponent(message));
  const msgLen = utf8.length;
  const words: number[] = [];

  for (let i = 0; i < msgLen; i++) {
    words[i >> 2] |= (utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }

  words[msgLen >> 2] |= 0x80 << (24 - (msgLen % 4) * 8);
  words[(((msgLen + 8) >> 6) << 4) + 15] = msgLen * 8;

  let H0 = 0x67452301;
  let H1 = 0xefcdab89;
  let H2 = 0x98badcfe;
  let H3 = 0x10325476;
  let H4 = 0xc3d2e1f0;

  const W: number[] = new Array(80);

  for (let i = 0; i < words.length; i += 16) {
    for (let t = 0; t < 16; t++) {
      W[t] = words[i + t] || 0;
    }
    for (let t = 16; t < 80; t++) {
      W[t] = rotateLeft(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let A = H0;
    let B = H1;
    let C = H2;
    let D = H3;
    let E = H4;

    for (let t = 0; t < 80; t++) {
      let f = 0;
      let k = 0;
      if (t < 20) {
        f = (B & C) | (~B & D);
        k = 0x5a827999;
      } else if (t < 40) {
        f = B ^ C ^ D;
        k = 0x6ed9eba1;
      } else if (t < 60) {
        f = (B & C) | (B & D) | (C & D);
        k = 0x8f1bbcdc;
      } else {
        f = B ^ C ^ D;
        k = 0xca62c1d6;
      }

      const temp = (rotateLeft(A, 5) + f + E + k + (W[t] >>> 0)) >>> 0;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) >>> 0;
    H1 = (H1 + B) >>> 0;
    H2 = (H2 + C) >>> 0;
    H3 = (H3 + D) >>> 0;
    H4 = (H4 + E) >>> 0;
  }

  const toHex = (n: number) => n.toString(16).padStart(8, '0');
  return (toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4)).toLowerCase();
}

/**
 * Computes the exact Git object header and SHA-1 hash for a file's content.
 * Format: "blob <content_byte_length>\0<content>"
 */
export function computeGitBlobHash(content: string): {
  header: string;
  fullPayload: string;
  sha1Hash: string;
  objectPath: string; // e.g., ".git/objects/xx/yyyy..."
} {
  const byteLength = unescape(encodeURIComponent(content)).length;
  const header = `blob ${byteLength}\0`;
  const fullPayload = header + content;
  const sha1Hash = sha1(fullPayload);
  const dir = sha1Hash.slice(0, 2);
  const file = sha1Hash.slice(2);
  const objectPath = `.git/objects/${dir}/${file}`;

  return { header, fullPayload, sha1Hash, objectPath };
}

/**
 * Shell pipeline stage descriptor
 */
export interface PipelineStage {
  command: string;
  args: string[];
  inFd: number; // 0 = stdin or pipe read end
  outFd: number; // 1 = stdout or pipe write end
  errFd: number; // 2 = stderr
  isPipeTarget: boolean;
  isPipeSource: boolean;
}

/**
 * Parses a simple Unix pipeline string into structured stages with file descriptor assignments.
 */
export function parsePipeline(pipelineStr: string): PipelineStage[] {
  const segments = pipelineStr.split('|').map((s) => s.trim()).filter(Boolean);
  if (segments.length === 0) return [];

  return segments.map((seg, idx) => {
    const tokens = seg.split(/\s+/);
    const command = tokens[0];
    const args = tokens.slice(1);
    const isFirst = idx === 0;
    const isLast = idx === segments.length - 1;

    return {
      command,
      args,
      inFd: isFirst ? 0 : 3 + (idx - 1) * 2, // Pipe read descriptor (Pipe N-1)
      outFd: isLast ? 1 : 4 + idx * 2, // Pipe write descriptor (Pipe N)
      errFd: 2,
      isPipeTarget: !isFirst,
      isPipeSource: !isLast,
    };
  });
}

/**
 * PATH lookup resolver
 */
export interface PathResolutionStep {
  directory: string;
  checkedFile: string;
  found: boolean;
}

export function resolveCommandPath(
  command: string,
  pathList: string[],
  mockFilesystem: Record<string, string[]>
): {
  resolvedPath: string | null;
  steps: PathResolutionStep[];
} {
  const steps: PathResolutionStep[] = [];

  for (const dir of pathList) {
    const files = mockFilesystem[dir] || [];
    const found = files.includes(command);
    steps.push({
      directory: dir,
      checkedFile: `${dir}/${command}`,
      found,
    });

    if (found) {
      return {
        resolvedPath: `${dir}/${command}`,
        steps,
      };
    }
  }

  return {
    resolvedPath: null,
    steps,
  };
}

/**
 * CIDR Subnet Calculation Details
 */
export interface CidrSubnetInfo {
  ip: string;
  prefixLength: number;
  netmask: string;
  networkAddress: string;
  broadcastAddress: string | null; // No directed broadcast for /31 or /32.
  firstUsableIp: string;
  lastUsableIp: string;
  totalAddresses: number;
  usableHosts: number;
}

/**
 * Pure CIDR Subnet Calculator
 * Decomposes an IPv4 address with prefix length into its network boundary, netmask, and usable host range.
 */
export function calculateCidrSubnet(cidrStr: string): CidrSubnetInfo {
  const [ipPart, prefixPart] = cidrStr.trim().split('/');
  if (!ipPart || prefixPart === undefined) {
    throw new Error('Invalid CIDR format. Expected IP/prefix (e.g. 192.168.1.100/24)');
  }

  if (!/^[0-9]{1,2}$/.test(prefixPart) || cidrStr.trim().split('/').length !== 2) throw new RangeError('Invalid CIDR prefix');
  const prefix = Number(prefixPart);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new RangeError('CIDR prefix length must be between 0 and 32');
  }

  if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ipPart)) throw new RangeError('Invalid IPv4 decimal octets');
  const octets = ipPart.split('.').map(Number);
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new RangeError('Invalid IPv4 address format. Must have 4 octets (0-255)');
  }

  // Convert octets to unsigned 32-bit integer
  const ipInt = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const maskInt = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
  const netInt = (ipInt & maskInt) >>> 0;
  const wildInt = (~maskInt) >>> 0;
  const broadInt = (netInt | wildInt) >>> 0;

  const intToIp = (val: number) => [
    (val >>> 24) & 0xff,
    (val >>> 16) & 0xff,
    (val >>> 8) & 0xff,
    val & 0xff,
  ].join('.');

  const totalAddresses = Math.pow(2, 32 - prefix);
  const usableHosts = prefix === 32 ? 1 : prefix === 31 ? 2 : totalAddresses - 2;

  const firstUsableIp = prefix >= 31 ? intToIp(netInt) : intToIp(netInt + 1);
  const lastUsableIp = prefix >= 31 ? intToIp(broadInt) : intToIp(broadInt - 1);

  return {
    ip: ipPart,
    prefixLength: prefix,
    netmask: intToIp(maskInt),
    networkAddress: intToIp(netInt),
    broadcastAddress: prefix >= 31 ? null : intToIp(broadInt),
    firstUsableIp,
    lastUsableIp,
    totalAddresses,
    usableHosts,
  };
}

/**
 * TCP 3-Way Handshake Packet Telemetry
 */
export interface TcpHandshakeStep {
  step: number;
  sender: 'Client' | 'Server';
  flags: { SYN: boolean; ACK: boolean };
  seq: number;
  ack: number;
  clientState: string;
  serverState: string;
  description: string;
}

/**
 * Deterministic TCP 3-Way Handshake Simulation
 */
export function simulateTcpHandshake(clientISN: number = 1000, serverISN: number = 5000): TcpHandshakeStep[] {
  if (![clientISN, serverISN].every(value => Number.isInteger(value) && value >= 0 && value <= 0xffffffff)) {
    throw new RangeError('Initial sequence numbers must be unsigned 32-bit integers');
  }
  const nextClient = (clientISN + 1) >>> 0;
  const nextServer = (serverISN + 1) >>> 0;
  return [
    {
      step: 1,
      sender: 'Client',
      flags: { SYN: true, ACK: false },
      seq: clientISN,
      ack: 0,
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      description: `Client initiates connection by transmitting SYN=1 with initial sequence number ISN_c=${clientISN}.`,
    },
    {
      step: 2,
      sender: 'Server',
      flags: { SYN: true, ACK: true },
      seq: serverISN,
      ack: nextClient,
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      description: `Server acknowledges client's ISN with ACK=${nextClient} and responds with its own SYN=1 and ISN_s=${serverISN}.`,
    },
    {
      step: 3,
      sender: 'Client',
      flags: { SYN: false, ACK: true },
      seq: nextClient,
      ack: nextServer,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      description: `Client acknowledges server's ISN with ACK=${nextServer}. After the server receives this ACK, both endpoints are ESTABLISHED. This trace assumes delivery without loss.`,
    },
  ];
}
