/**
 * Bitwise and Two's Complement Integer Utilities
 * Pure functions for arithmetic, logical bit shifts, and representation conversions.
 */

export interface TwosComplementResult {
  originalDecimal: number;
  originalBinary: string;
  invertedBinary: string;
  twosComplementBinary: string;
  negatedDecimal: number;
  hex: string;
}

/**
 * Calculates step-by-step two's complement negation for an 8-bit or 16-bit integer.
 */
export function computeTwosComplement(value: number, bits: 8 | 16 = 8): TwosComplementResult {
  const mask = (1 << bits) - 1;
  const clamped = value & mask;
  const originalBinary = clamped.toString(2).padStart(bits, '0');

  // Step 1: Invert all bits (One's complement)
  const invertedNum = (~clamped) & mask;
  const invertedBinary = invertedNum.toString(2).padStart(bits, '0');

  // Step 2: Add 1 (Two's complement)
  const twosCompNum = (invertedNum + 1) & mask;
  const twosComplementBinary = twosCompNum.toString(2).padStart(bits, '0');

  // Interpret as signed integer
  const signBit = 1 << (bits - 1);
  const negatedDecimal = (twosCompNum & signBit) !== 0 ? twosCompNum - (1 << bits) : twosCompNum;
  const hex = '0x' + twosCompNum.toString(16).toUpperCase().padStart(bits / 4, '0');

  return {
    originalDecimal: value,
    originalBinary,
    invertedBinary,
    twosComplementBinary,
    negatedDecimal,
    hex,
  };
}

/**
 * Performs a bitwise operation between two numbers clamped to 8 or 16 bits.
 */
export function performBitwiseOp(
  a: number,
  b: number,
  op: 'AND' | 'OR' | 'XOR' | 'SHL' | 'SHR' | 'NOT',
  bitWidth: 8 | 16 = 8
): { result: number; binary: string; hex: string } {
  const mask = (1 << bitWidth) - 1;
  const aNorm = a & mask;
  const bNorm = b & mask;

  let raw = 0;
  switch (op) {
    case 'AND': raw = aNorm & bNorm; break;
    case 'OR':  raw = aNorm | bNorm; break;
    case 'XOR': raw = aNorm ^ bNorm; break;
    case 'NOT': raw = (~aNorm) & mask; break;
    case 'SHL': raw = (aNorm << (bNorm % bitWidth)) & mask; break;
    case 'SHR': raw = (aNorm >>> (bNorm % bitWidth)) & mask; break;
  }

  const result = raw & mask;
  const binary = result.toString(2).padStart(bitWidth, '0');
  const hex = '0x' + result.toString(16).toUpperCase().padStart(bitWidth / 4, '0');

  return { result, binary, hex };
}
