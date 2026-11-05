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
