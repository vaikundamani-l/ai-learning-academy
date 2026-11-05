/**
 * IEEE-754 Single (32-bit) and Double (64-bit) Precision Utilities
 * Pure functions for deterministic decoding, encoding, and bit toggling.
 */

export interface DecodedIeee754 {
  sign: number; // 0 or 1
  exponentBits: string;
  mantissaBits: string;
  exponentRaw: number;
  exponentActual: number;
  mantissaValue: number;
  calculatedValue: number;
  isDenormal: boolean;
  isInfinity: boolean;
  isNaN: boolean;
  isZero: boolean;
  formulaString: string;
}

/**
 * Encodes a JavaScript number into IEEE-754 32-bit binary representation.
 */
export function floatToBits32(value: number): string {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, false); // Big-endian
  const uint = view.getUint32(0, false);
  return uint.toString(2).padStart(32, '0');
}

/**
 * Reconstructs a JavaScript number from a 32-bit binary string.
 */
export function bits32ToFloat(bits: string): number {
  if (bits.length !== 32) return NaN;
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  const uint = parseInt(bits, 2);
  view.setUint32(0, uint, false);
  return view.getFloat32(0, false);
}

/**
 * Decodes a 32-bit binary string into its IEEE-754 semantic components.
 */
export function decodeIeee754_32(bits: string): DecodedIeee754 {
  const padded = bits.padStart(32, '0').slice(0, 32);
  const sign = parseInt(padded[0], 2);
  const exponentBits = padded.slice(1, 9);
  const mantissaBits = padded.slice(9, 32);

  const exponentRaw = parseInt(exponentBits, 2);
  const bias = 127;
  const isZero = exponentRaw === 0 && parseInt(mantissaBits, 2) === 0;
  const isDenormal = exponentRaw === 0 && !isZero;
  const isInfinityOrNan = exponentRaw === 255;
  const isNaN = isInfinityOrNan && parseInt(mantissaBits, 2) !== 0;
  const isInfinity = isInfinityOrNan && parseInt(mantissaBits, 2) === 0;

  let exponentActual = exponentRaw - bias;
  let mantissaValue = 0;

  for (let i = 0; i < mantissaBits.length; i++) {
    if (mantissaBits[i] === '1') {
      mantissaValue += Math.pow(2, -(i + 1));
    }
  }

  let calculatedValue: number;
  let formulaString: string;

  if (isNaN) {
    calculatedValue = NaN;
    formulaString = 'NaN (Not a Number)';
  } else if (isInfinity) {
    calculatedValue = sign === 1 ? -Infinity : Infinity;
    formulaString = sign === 1 ? '-Infinity' : '+Infinity';
  } else if (isZero) {
    calculatedValue = sign === 1 ? -0 : 0;
    formulaString = sign === 1 ? '-0.0' : '+0.0';
  } else if (isDenormal) {
    exponentActual = 1 - bias; // -126
    calculatedValue = Math.pow(-1, sign) * Math.pow(2, exponentActual) * mantissaValue;
    formulaString = `(-1)^${sign} × 2^(-126) × 0.${mantissaBits.slice(0, 6)}...`;
  } else {
    calculatedValue = Math.pow(-1, sign) * Math.pow(2, exponentActual) * (1 + mantissaValue);
    formulaString = `(-1)^${sign} × 2^(${exponentRaw} - 127) × (1 + ${mantissaValue.toFixed(6)})`;
  }

  return {
    sign,
    exponentBits,
    mantissaBits,
    exponentRaw,
    exponentActual,
    mantissaValue,
    calculatedValue,
    isDenormal,
    isInfinity,
    isNaN,
    isZero,
    formulaString,
  };
}
