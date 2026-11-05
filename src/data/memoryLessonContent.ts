export interface LexiconTerm {
  term: string;
  alias?: string;
  pronunciation?: string;
  definition: string;
  significance: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ExerciseItem {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  tasks: string[];
  solutionHint: string;
}

export const MEMORY_LESSON_CONTENT = {
  title: 'Memory Hierarchy & Binary Data Representation',
  stageNumber: 0,
  stageTitle: 'Computer and Development Fundamentals',
  estimatedReadTime: '40 mins',

  objectives: [
    'Master number systems: Base 2 (Binary), Base 8 (Octal), Base 10 (Decimal), and Base 16 (Hexadecimal) conversion techniques.',
    'Understand signed integer representation, proving why Two\'s Complement eliminated negative zero and enabled unified adder-subtractor circuits.',
    'Deconstruct IEEE-754 floating-point standards (FP32 and FP64), analyzing sign, biased exponent, normalized mantissa, subnormals, and precision truncation errors.',
    'Examine text and character encodings from ASCII to Unicode and UTF-8 variable-length byte serialization.',
    'Analyze physical memory organization: Little-Endian vs. Big-Endian byte orders, struct memory alignment padding, and the latency pyramid from registers to cloud storage.'
  ],

  prerequisites: [
    'Stage 0 Lesson 1: CPU Architecture, ISA & Instruction Execution (Registers, ALU, Program Counter, Cache L1-L3).',
    'Elementary arithmetic: powers of two ($2^0=1, 2^1=2, 2^2=4, 2^3=8, \dots, 2^{16}=65536$).',
    'Basic programming understanding of variable types (int, float, char, byte).'
  ],

  lexicon: [
    {
      term: "Two's Complement",
      definition: 'The standard binary representation for signed integers in modern computing, where the most significant bit (MSB) has negative weight $-2^{n-1}$.',
      significance: 'Permits hardware addition and subtraction to execute using the exact same adder circuit with zero special cases for zero.'
    },
    {
      term: 'IEEE-754 Standard',
      alias: 'IEC 60559',
      definition: 'The universal technical standard for floating-point computation, establishing formats for 32-bit single precision (FP32) and 64-bit double precision (FP64).',
      significance: 'Guarantees reproducible floating-point arithmetic across diverse CPU and GPU silicon.'
    },
    {
      term: 'Biased Exponent',
      alias: 'Excess-K Exponent',
      definition: 'An exponent representation stored with an added fixed bias ($+127$ for FP32, $+1023$ for FP64) so that exponents are stored as unsigned positive integers.',
      significance: 'Allows floating-point numbers to be compared for magnitude using standard integer comparators.'
    },
    {
      term: 'Subnormal (Denormal) Number',
      definition: 'A floating-point value with an exponent field of all zeroes, allowing representation of non-zero numbers smaller than the normal minimum without leading implicit 1.',
      significance: 'Prevents sudden underflow to zero, providing gradual precision degradation near zero.'
    },
    {
      term: 'Catastrophic Cancellation',
      definition: 'A phenomenon in floating-point arithmetic where subtracting two nearly equal numbers causes extreme loss of significant digits.',
      significance: 'A primary cause of severe numerical instability in scientific simulations and deep learning loss calculations.'
    },
    {
      term: 'Little-Endian',
      definition: 'A byte ordering scheme where the least significant byte (LSB) of a multi-byte word is stored at the lowest physical memory address.',
      significance: 'Standard in x86-64 and ARM processors; makes integer typecasting (e.g. 64-bit int to 32-bit int) zero-cost in memory.'
    },
    {
      term: 'Big-Endian',
      alias: 'Network Byte Order',
      definition: 'A byte ordering scheme where the most significant byte (MSB) is stored at the lowest physical memory address.',
      significance: 'Standard format across internet networking protocols (IP, TCP, UDP header fields).'
    },
    {
      term: 'Struct Alignment & Padding',
      definition: 'The insertion of unused padding bytes between struct members by the compiler to align fields on memory boundaries matching their data size.',
      significance: 'Unaligned memory accesses trigger multiple bus cycles or hardware bus faults on strict architectures.'
    },
    {
      term: 'UTF-8',
      definition: 'A variable-width character encoding capable of encoding all 1,112,064 valid Unicode code points using 1 to 4 one-byte (8-bit) code units.',
      significance: 'Fully backward-compatible with 7-bit ASCII; dominant character encoding across the World Wide Web.'
    },
    {
      term: 'Bitmask',
      definition: 'A binary pattern used in bitwise operations (AND, OR, XOR) to inspect, set, or toggle specific individual bits within a byte or word.',
      significance: 'Essential for compact flags, hardware registers, network packet header parsing, and POSIX permissions.'
    }
  ],

  codeExamples: {
    cMemoryAndEndianness: `// ============================================================================
// Endianness Detection, Pointer Byte Inspection & Struct Padding in C11
// Proving physical memory layout and compiler alignment behavior
// ============================================================================
#include <stdio.h>
#include <stdint.h>
#include <stddef.h>

// 1. Detect System Endianness via Byte Pointer Inspection
void check_endianness() {
    uint32_t value = 0xAABBCCDD;
    uint8_t *byte_ptr = (uint8_t *)&value;

    printf("--- 1. Endianness Inspection ---\\n");
    printf("32-bit Value: 0x%08X\\n", value);
    printf("Memory address [0]: 0x%02X\\n", byte_ptr[0]);
    printf("Memory address [1]: 0x%02X\\n", byte_ptr[1]);
    printf("Memory address [2]: 0x%02X\\n", byte_ptr[2]);
    printf("Memory address [3]: 0x%02X\\n", byte_ptr[3]);

    if (byte_ptr[0] == 0xDD) {
        printf("Verdict: Little-Endian (Least Significant Byte stored first at lowest address)\\n\\n");
    } else if (byte_ptr[0] == 0xAA) {
        printf("Verdict: Big-Endian (Most Significant Byte stored first)\\n\\n");
    }
}

// 2. Struct Memory Alignment & Padding Demonstration
// Due to 64-bit alignment rules:
// - char (1 byte) + 3 bytes padding
// - int (4 bytes)
// - double (8 bytes)
struct UnoptimizedData {
    char   a;      // 1 byte + 3 bytes padding
    int    b;      // 4 bytes
    char   c;      // 1 byte + 7 bytes padding
    double d;      // 8 bytes
}; // Total: 24 bytes!

struct OptimizedData {
    double d;      // 8 bytes (offset 0)
    int    b;      // 4 bytes (offset 8)
    char   a;      // 1 byte  (offset 12)
    char   c;      // 1 byte  (offset 13) + 2 bytes trailing padding
}; // Total: 16 bytes! (33% memory savings)

void check_struct_padding() {
    printf("--- 2. Struct Memory Padding & Alignment ---\\n");
    printf("Unoptimized struct size: %zu bytes\\n", sizeof(struct UnoptimizedData));
    printf("  Offset of a (char):   %zu\\n", offsetof(struct UnoptimizedData, a));
    printf("  Offset of b (int):    %zu\\n", offsetof(struct UnoptimizedData, b));
    printf("  Offset of c (char):   %zu\\n", offsetof(struct UnoptimizedData, c));
    printf("  Offset of d (double): %zu\\n", offsetof(struct UnoptimizedData, d));

    printf("\\nOptimized struct size:   %zu bytes (packed by descending size)\\n", sizeof(struct OptimizedData));
    printf("  Offset of d (double): %zu\\n", offsetof(struct OptimizedData, d));
    printf("  Offset of b (int):    %zu\\n", offsetof(struct OptimizedData, b));
    printf("  Offset of a (char):   %zu\\n", offsetof(struct OptimizedData, a));
    printf("  Offset of c (char):   %zu\\n", offsetof(struct OptimizedData, c));
}

int main() {
    check_endianness();
    check_struct_padding();
    return 0;
}`,

    pythonFloatDecoder: `"""
Pure Python IEEE-754 Single-Precision Float Packer & Unpacker
Decodes Sign, Biased Exponent, and Normalized Mantissa from raw integer bits.
"""

def decode_ieee754_fp32(uint32_bits):
    """Decode a 32-bit unsigned integer into IEEE-754 components."""
    # Extract Bit Fields
    sign_bit = (uint32_bits >> 31) & 0x1
    exponent_raw = (uint32_bits >> 23) & 0xFF
    mantissa_raw = uint32_bits & 0x7FFFFF

    sign = -1.0 if sign_bit else 1.0

    # Special Cases: Zero, Infinity, NaN
    if exponent_raw == 255:
        if mantissa_raw != 0:
            return float('nan'), "NaN"
        return sign * float('inf'), "+Infinity" if sign > 0 else "-Infinity"

    if exponent_raw == 0:
        if mantissa_raw == 0:
            return -0.0 if sign_bit else 0.0, "-0.0" if sign_bit else "+0.0"
        # Subnormal / Denormal
        actual_exp = 1 - 127
        mantissa_fraction = mantissa_raw / (2**23)
        value = sign * (2**actual_exp) * mantissa_fraction
        return value, "Subnormal"

    # Normalized Number
    actual_exp = exponent_raw - 127
    mantissa_fraction = 1.0 + (mantissa_raw / (2**23))
    value = sign * (2**actual_exp) * mantissa_fraction
    return value, "Normalized"

# Verification Example: 12.375
# 12.375 in binary: 1100.011 = 1.100011 * 2^3
# Sign = 0, Exp = 3 + 127 = 130 (0b10000010), Mantissa = 0.100011...
bits_12_375 = 0b01000001010001100000000000000000
val, kind = decode_ieee754_fp32(bits_12_375)
print(f"Bits: 0x{bits_12_375:08X} -> Decoded: {val} ({kind})")
assert abs(val - 12.375) < 1e-6, "Decoding verification failed!"
`
  },

  quizQuestions: [
    {
      id: 1,
      question: "In an 8-bit Two's Complement representation, what is the decimal value of the binary bit pattern 11111111?",
      options: [
        {
          text: "255",
          isCorrect: false,
          explanation: "255 is the unsigned interpretation of 11111111. In two's complement, the MSB has negative weight -128."
        },
        {
          text: "-1",
          isCorrect: true,
          explanation: "Correct! The MSB represents -128, and the lower 7 bits sum to +127: -128 + 127 = -1."
        },
        {
          text: "-127",
          isCorrect: false,
          explanation: "-127 would be 10000001 in two's complement."
        }
      ]
    },
    {
      id: 2,
      question: "Why does floating-point arithmetic produce 0.1 + 0.2 != 0.3 in IEEE-754 single and double precision?",
      options: [
        {
          text: "The ALU lacks floating-point adders and relies on software integer emulation.",
          isCorrect: false,
          explanation: "Modern CPUs have dedicated hardware FPUs and vector units."
        },
        {
          text: "0.1 and 0.2 cannot be represented as finite terminating binary fractions in base 2; they become infinitely repeating binary fractions that are truncated.",
          isCorrect: true,
          explanation: "Correct! Just as 1/3 is 0.3333... in base 10, 0.1 is 0.0001100110011... in base 2, causing rounding errors upon mantissa truncation."
        },
        {
          text: "The sign bit flips randomly due to thermal noise in DRAM capacitors.",
          isCorrect: false,
          explanation: "Thermal noise causing bitflips is a memory fault, not standard floating-point representation."
        }
      ]
    },
    {
      id: 3,
      question: "In IEEE-754 Single Precision (32-bit FP32), how many bits are allocated to the Sign, Exponent, and Mantissa fields respectively?",
      options: [
        {
          text: "Sign: 1 bit, Exponent: 8 bits, Mantissa: 23 bits",
          isCorrect: true,
          explanation: "Correct! 1 + 8 + 23 = 32 bits total. The exponent uses bias 127."
        },
        {
          text: "Sign: 1 bit, Exponent: 11 bits, Mantissa: 52 bits",
          isCorrect: false,
          explanation: "1 + 11 + 52 = 64 bits describes Double Precision (FP64), not Single Precision."
        },
        {
          text: "Sign: 2 bits, Exponent: 14 bits, Mantissa: 16 bits",
          isCorrect: false,
          explanation: "There is only ever 1 sign bit in IEEE-754 formats."
        }
      ]
    },
    {
      id: 4,
      question: "On a Little-Endian computer, how is the 32-bit hexadecimal value 0xAABBCCDD stored in contiguous physical memory starting at address 0x1000?",
      options: [
        {
          text: "[0x1000]=0xDD, [0x1001]=0xCC, [0x1002]=0xBB, [0x1003]=0xAA",
          isCorrect: true,
          explanation: "Correct! Little-Endian places the Least Significant Byte (0xDD) at the lowest memory address."
        },
        {
          text: "[0x1000]=0xAA, [0x1001]=0xBB, [0x1002]=0xCC, [0x1003]=0xDD",
          isCorrect: false,
          explanation: "This is Big-Endian byte ordering, where the Most Significant Byte is stored at the lowest address."
        },
        {
          text: "[0x1000]=0xBB, [0x1001]=0xAA, [0x1002]=0xDD, [0x1003]=0xCC",
          isCorrect: false,
          explanation: "This is PDP-endian (middle-endian), an obsolete format."
        }
      ]
    },
    {
      id: 5,
      question: "Why do C compilers insert padding bytes into structures, such as turning a struct with char (1 byte) and int (4 bytes) into 8 bytes total?",
      options: [
        {
          text: "To encrypt the structure against memory disclosure exploits.",
          isCorrect: false,
          explanation: "Padding is for architectural memory bus alignment, not encryption."
        },
        {
          text: "To ensure each member's memory address is a multiple of its natural alignment boundary, avoiding multi-cycle split memory accesses.",
          isCorrect: true,
          explanation: "Correct! A 4-byte integer must sit on an address divisible by 4. Reading an unaligned integer would require two separate memory bus transactions."
        },
        {
          text: "To reserve space for virtual function pointers.",
          isCorrect: false,
          explanation: "Virtual method tables (vtables) are a C++ object-oriented concept, not standard C struct padding."
        }
      ]
    },
    {
      id: 6,
      question: "Which bitwise operation is used to toggle (invert) specific bits in a register while leaving all other bits unchanged?",
      options: [
        {
          text: "Bitwise XOR (^) with a mask of 1s in the target bit positions.",
          isCorrect: true,
          explanation: "Correct! X ^ 1 = ~X (toggled) and X ^ 0 = X (preserved)."
        },
        {
          text: "Bitwise AND (&) with all 1s.",
          isCorrect: false,
          explanation: "AND with 1 preserves the bit, it does not toggle it."
        },
        {
          text: "Bitwise OR (|) with all 0s.",
          isCorrect: false,
          explanation: "OR with 0 preserves the bit, it does not toggle it."
        }
      ]
    },
    {
      id: 7,
      question: "Why is UTF-8 the dominant text encoding standard across the web rather than fixed-width UTF-32?",
      options: [
        {
          text: "UTF-8 is completely backward-compatible with 7-bit ASCII and avoids wasting 3 bytes of zero padding per ASCII character.",
          isCorrect: true,
          explanation: "Correct! Standard ASCII characters encode in exactly 1 byte in UTF-8, saving enormous bandwidth compared to 4-byte UTF-32."
        },
        {
          text: "UTF-32 cannot represent non-Latin alphabets.",
          isCorrect: false,
          explanation: "UTF-32 can represent all Unicode code points."
        },
        {
          text: "UTF-8 does not require a CPU to decode.",
          isCorrect: false,
          explanation: "All text decoders execute on the CPU."
        }
      ]
    },
    {
      id: 8,
      question: "What is the primary physical difference between L1 Static RAM (SRAM) and Main Memory Dynamic RAM (DRAM)?",
      options: [
        {
          text: "SRAM uses 6 transistors per bit and never requires electrical refreshing, while DRAM uses 1 transistor and 1 tiny capacitor that leaks charge and requires constant refreshing.",
          isCorrect: true,
          explanation: "Correct! 6T SRAM is extremely fast (~1 ns) and large. 1T-1C DRAM is dense and cheap but slower (~70 ns) because capacitors must be recharged every 64 ms."
        },
        {
          text: "SRAM is non-volatile magnetic storage while DRAM is optical.",
          isCorrect: false,
          explanation: "Both SRAM and DRAM are volatile silicon semiconductor memories."
        },
        {
          text: "SRAM operates at 120 Volts while DRAM operates at 5 Volts.",
          isCorrect: false,
          explanation: "Both operate at low voltages (around 1.0V to 1.35V)."
        }
      ]
    },
    {
      id: 9,
      question: "If a CPU instruction execution cycle takes 1 nanosecond (equivalent to 1 second on human scale), approximately how long is an off-chip DRAM access (70 ns) on that same human scale?",
      options: [
        {
          text: "About 1.2 minutes (grabbing a cup of water down the hall).",
          isCorrect: true,
          explanation: "Correct! 70 nanoseconds scaled up by 10^9 is 70 seconds = 1 minute 10 seconds."
        },
        {
          text: "About 10 milliseconds.",
          isCorrect: false,
          explanation: "10 milliseconds would be faster than a single second."
        },
        {
          text: "About 4.2 years.",
          isCorrect: false,
          explanation: "4.2 years corresponds to a network latency hop (50-100 ms)."
        }
      ]
    },
    {
      id: 10,
      question: "What happens when an 8-bit unsigned integer holding value 255 has 1 added to it without overflow checking?",
      options: [
        {
          text: "It wraps around to 0 (arithmetic overflow).",
          isCorrect: true,
          explanation: "Correct! 255 is 0b11111111. Adding 1 produces 0b100000000 (9 bits). The 8-bit register retains only the lower 8 bits (0b00000000 = 0)."
        },
        {
          text: "The processor halts permanently.",
          isCorrect: false,
          explanation: "Standard unsigned integer addition does not fault on overflow; it sets the Carry Flag and wraps around."
        },
        {
          text: "The value saturates at 255.",
          isCorrect: false,
          explanation: "Standard binary adders wrap around; saturating arithmetic requires dedicated SIMD instructions."
        }
      ]
    }
  ],

  exercises: [
    {
      id: 1,
      title: "Exercise 1: Manual Two's Complement Calculation & Range Proof",
      level: "Beginner",
      description: "Manually compute the signed binary representations of positive and negative integers in an 8-bit register.",
      tasks: [
        "Express +53 in 8-bit unsigned binary.",
        "Derive -53 using the two-step two's complement algorithm (invert all bits and add 1).",
        "Prove that adding +53 and -53 together produces 00000000 with a discarded carry-out bit of 1.",
        "State the exact representable integer range for an 8-bit signed two's complement variable."
      ],
      solutionHint: "+53 is 00110101. Inverting all bits gives 11001010. Adding 1 gives 11001011 (-53). Adding 00110101 + 11001011 produces 100000000, which in an 8-bit register is 00000000! Range is -128 to +127 (-2^7 to 2^7 - 1)."
    },
    {
      id: 2,
      title: "Exercise 2: IEEE-754 Single-Precision Bit Packing by Hand",
      level: "Intermediate",
      description: "Convert a real fractional decimal number into its exact 32-bit IEEE-754 representation.",
      tasks: [
        "Take decimal number -18.625.",
        "Separate into integer portion (18 = 0b10010) and fractional portion (0.625 = 0.5 + 0.125 = 0b0.101).",
        "Combine in binary: 10010.101, and normalize to scientific notation: 1.0010101 × 2^4.",
        "Calculate the 1-bit sign, 8-bit biased exponent (4 + 127 = 131), and 23-bit mantissa.",
        "Verify your answer using the interactive IEEE-754 visualizer above."
      ],
      solutionHint: "Sign: 1 (negative). Exponent: 131 = 0b10000011. Mantissa: 00101010000000000000000. Full 32 bits: 1 10000011 00101010000000000000000 = 0xC1950000."
    },
    {
      id: 3,
      title: "Exercise 3: Reorder C Struct Members to Minimize Memory Footprint",
      level: "Advanced",
      description: "Optimize a large telemetry record struct to reduce padding overhead and cache line consumption.",
      tasks: [
        "Inspect a struct containing: char flag1 (1 byte), double reading (8 bytes), char flag2 (1 byte), int timestamp (4 bytes), char flag3 (1 byte).",
        "Calculate the unoptimized size including compiler padding on a 64-bit architecture.",
        "Reorder the fields by descending natural alignment to eliminate internal padding holes.",
        "Calculate the memory saved across an array of 1,000,000 telemetry records in RAM."
      ],
      solutionHint: "Unoptimized size: char (1) + 7 pad + double (8) + char (1) + 3 pad + int (4) + char (1) + 7 pad = 32 bytes! Optimized layout: double (8) + int (4) + char (1) + char (1) + char (1) + 1 pad = 16 bytes! For 1,000,000 records, this saves exactly 16 MB of RAM (50% reduction) and doubles cache line hit rates!"
    }
  ]
};
