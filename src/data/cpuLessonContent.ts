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
  starterCode?: string;
  solutionHint: string;
}

export const CPU_LESSON_CONTENT = {
  title: 'CPU Architecture, ISA & Instruction Execution',
  stageNumber: 0,
  stageTitle: 'Computer and Development Fundamentals',
  estimatedReadTime: '45 mins',

  objectives: [
    'Explain the fundamental necessity of the CPU, the Von Neumann architecture, and the memory bottleneck from first principles.',
    'Trace the discrete 5-stage instruction cycle (Fetch, Decode, Execute, Memory, Writeback) and monitor register and bus transitions.',
    'Analyze Instruction Set Architectures (ISA), comparing CISC (x86-64) and RISC (ARM64, RISC-V) instruction formats and addressing modes.',
    'Diagnose instruction pipeline hazards (Structural, Data RAW, Control) and explain how hardware forwarding, stalls, and branch prediction resolve them.',
    'Formulate CPU performance using the Iron Law, calculate CPI and AMAT, and measure cache locality using C and Linux tools.',
    'Audit CPU hardware security mechanisms, analyzing protection rings, syscall transitions, and speculative execution side-channels (Meltdown/Spectre).'
  ],

  prerequisites: [
    'Binary arithmetic: understanding bits, bytes, hexadecimals, two\'s complement representation, and bitwise logic gates (AND, OR, NOT, XOR).',
    'Basic programming intuition in any language (variables, memory pointers, loops, and conditional branching).'
  ],

  lexicon: [
    {
      term: 'ALU (Arithmetic Logic Unit)',
      alias: 'Execution Unit',
      definition: 'The combinational digital circuit inside the CPU that performs arithmetic (addition, subtraction, multiplication) and bitwise Boolean operations.',
      significance: 'Every computation, pointer calculation, and branch comparison passes through the ALU.'
    },
    {
      term: 'Control Unit (CU)',
      alias: 'Instruction Decoder & Sequencer',
      definition: 'The CPU subsystem that fetches machine instructions from memory, decodes their opcodes, and issues micro-operation control strobes to registers and buses.',
      significance: 'Acts as the orchestrator or "brain" directing data traffic across internal functional units.'
    },
    {
      term: 'Program Counter (PC / RIP)',
      alias: 'Instruction Pointer (IP)',
      definition: 'A dedicated register holding the memory address of the next instruction waiting to be fetched for execution.',
      significance: 'Automatically increments after each fetch; modified during jumps, calls, and branches to alter program flow.'
    },
    {
      term: 'Instruction Register (IR)',
      definition: 'A temporary storage register inside the Control Unit that latches the binary instruction word currently being decoded.',
      significance: 'Holds the active instruction bits stable while control matrices generate execution signals.'
    },
    {
      term: 'Register File',
      alias: 'General Purpose Registers (GPRs)',
      definition: 'An array of ultra-fast on-die SRAM storage locations directly accessible by the execution units within a single clock cycle (< 0.5 ns).',
      significance: 'Provides instant operands to the ALU without having to access external RAM.'
    },
    {
      term: 'Clock Cycle (Tick)',
      alias: 'Clock Period (τ)',
      definition: 'The duration of one complete oscillation of the CPU quartz clock signal, measured in gigahertz (GHz) or nanoseconds (ns).',
      significance: 'Synchronizes state transitions across digital flip-flops and pipeline latches.'
    },
    {
      term: 'CPI (Cycles Per Instruction)',
      definition: 'The average number of clock cycles required to execute and retire an instruction.',
      significance: 'Key metric in the CPU Performance Equation; reduced toward 1.0 by pipelining and < 1.0 by superscalar execution.'
    },
    {
      term: 'ISA (Instruction Set Architecture)',
      definition: 'The abstract boundary and specification between hardware and software, defining registers, instructions, memory models, and data types.',
      significance: 'Software compiled for one ISA (e.g. x86-64) cannot execute natively on another (e.g. ARM64) without translation.'
    },
    {
      term: 'Pipeline Hazard',
      definition: 'A condition that prevents the next instruction in the instruction stream from executing in its designated clock cycle.',
      significance: 'Categorized into Structural hazards (resource conflicts), Data hazards (dependencies), and Control hazards (branch redirection).'
    },
    {
      term: 'Cache Line',
      alias: 'Cache Block',
      definition: 'The fundamental unit of data transfer between main memory and cache, typically 64 bytes wide.',
      significance: 'Even when a program requests a single 1-byte variable, the hardware loads the full 64-byte line into cache (spatial locality).'
    },
    {
      term: 'Protection Ring',
      alias: 'Privilege Level (CPL)',
      definition: 'Hardware-enforced security boundaries separating user-space application code (Ring 3) from kernel-space operating system internals (Ring 0).',
      significance: 'Prevents untrusted user programs from directly tampering with physical hardware, page tables, or IO ports.'
    },
    {
      term: 'Syscall (System Call)',
      definition: 'A controlled programmatic mechanism by which a user-space application requests services from the operating system kernel.',
      significance: 'Triggers a privilege transition from Ring 3 to Ring 0 via instructions like `syscall` (x86-64) or `svc` (ARM64).'
    },
    {
      term: 'GPU (Graphics Processing Unit)',
      alias: 'Throughput Processor / Accelerator',
      definition: 'A specialized processor architected with thousands of lightweight arithmetic cores designed to execute thousands of parallel threads simultaneously using SIMT (Single Instruction, Multiple Threads).',
      significance: 'Powers modern deep learning and AI tensor matrix multiplications (GEMM) by providing massive parallel compute and terabyte/s memory bandwidth.'
    },
    {
      term: 'SIMT (Single Instruction, Multiple Threads)',
      definition: 'An execution model that groups threads for instruction issue. NVIDIA CUDA warps contain 32 threads; divergence and synchronization rules depend on the architecture.',
      significance: 'Scheduling another ready resident warp can hide part of a memory stall. It does not remove memory latency or synchronization costs.'
    }
  ],

  codeExamples: {
    cBitwiseAndCache: `// ============================================================================
// Cache-Conscious vs Cache-Unfriendly Matrix Traversal Benchmark in C
// Demonstrating the real-world impact of Cache Lines (64-byte spatial locality)
// ============================================================================
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define ROWS 4096
#define COLS 4096

int matrix[ROWS][COLS];

// 1. Row-Major Traversal (Cache-Friendly, High Spatial Locality)
// Elements matrix[i][j] and matrix[i][j+1] are contiguous in physical memory.
// Loading matrix[i][j] brings the next 15 integers into the 64-byte L1 cache line!
void row_major_traversal() {
    long long sum = 0;
    clock_t start = clock();
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            sum += matrix[i][j];
        }
    }
    clock_t end = clock();
    double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("Row-Major (Sequential):      %.4f seconds (Sum: %lld)\\n", time_taken, sum);
}

// 2. Column-Major Traversal (Cache-Unfriendly, Stride-4096)
// Elements matrix[i][j] and matrix[i+1][j] are separated by 4096 * 4 bytes = 16 KB!
// Every iteration causes a mandatory L1/L2 cache miss, stalling the CPU.
void col_major_traversal() {
    long long sum = 0;
    clock_t start = clock();
    for (int j = 0; j < COLS; j++) {
        for (int i = 0; i < ROWS; i++) {
            sum += matrix[i][j];
        }
    }
    clock_t end = clock();
    double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("Column-Major (Strided Miss): %.4f seconds (Sum: %lld)\\n", time_taken, sum);
}

int main() {
    // Initialize matrix
    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
            matrix[i][j] = 1;

    printf("Benchmarking 4096 x 4096 Integer Matrix (64 MB total memory)...\\n");
    row_major_traversal();
    col_major_traversal();
    return 0;
}`,

    pythonEmulator: `"""
Educational 5-Stage CPU Architecture Simulator from First Principles
Demonstrates Fetch, Decode, Execute, Memory, and Writeback with Register Bank.
"""

class EducationalCPU:
    def __init__(self, memory_size=256):
        # 16-bit registers: PC, R1, R2, R3, R4
        self.registers = {"R1": 5, "R2": 12, "R3": 0, "R4": 0}
        self.pc = 0x0000
        self.ir = None
        self.zero_flag = False
        self.carry_flag = False
        self.memory = [0] * memory_size
        self.cycle_count = 0
        self.halted = False

    def load_program(self, program, memory_data):
        self.program = program
        for addr, val in memory_data.items():
            self.memory[addr] = val

    def step(self):
        """Execute one complete 5-stage instruction cycle."""
        if self.halted or self.pc // 4 >= len(self.program):
            self.halted = True
            return False

        # STAGE 1: FETCH
        inst = self.program[self.pc // 4]
        self.ir = inst
        self.pc += 4
        self.cycle_count += 1

        # STAGE 2: DECODE
        opcode, dest, src = inst["op"], inst["dest"], inst["src"]
        val_src = 0
        if isinstance(src, str) and src.startswith("[") and src.endswith("]"):
            addr = int(src[1:-1], 16)
            val_src = self.memory[addr]
        elif isinstance(src, str) and src in self.registers:
            val_src = self.registers[src]
        elif isinstance(src, str) and "," in src:
            r_a, r_b = [r.strip() for r in src.split(",")]
            val_src = (self.registers[r_a], self.registers[r_b])

        # STAGE 3: EXECUTE (ALU)
        result = 0
        if opcode == "LOAD":
            result = val_src
        elif opcode == "ADD":
            result = val_src[0] + val_src[1]
            self.zero_flag = (result == 0)
        elif opcode == "SUB":
            result = val_src[0] - val_src[1]
            self.zero_flag = (result == 0)
        elif opcode == "STORE":
            pass # handled in Memory stage

        # STAGE 4: MEMORY ACCESS
        if opcode == "STORE":
            addr = int(dest[1:-1], 16)
            self.memory[addr] = self.registers[src]
            return True

        # STAGE 5: WRITEBACK
        self.registers[dest] = result
        return True

# Example Execution
cpu = EducationalCPU()
cpu.load_program([
    {"op": "LOAD", "dest": "R1", "src": "[0x0A]"},
    {"op": "ADD",  "dest": "R3", "src": "R1, R2"},
    {"op": "SUB",  "dest": "R4", "src": "R3, R1"},
    {"op": "STORE", "dest": "[0x0C]", "src": "R4"}
], {0x0A: 9, 0x0C: 0})

while not cpu.halted:
    cpu.step()
print("Final State -> Registers:", cpu.registers, "Mem[0x0C]:", cpu.memory[0x0C])`,

    assemblyComparison: `# ============================================================================
# Equivalent Integer Addition in x86-64 Assembly vs ARM64 Assembly
# Function: int add_and_scale(int a, int b) { return (a + b) * 2; }
# ============================================================================

# 1. x86-64 GNU Assembly (System V AMD64 ABI)
# Arguments: RDI = a, RSI = b | Return Value: EAX
.globl add_and_scale_x86
add_and_scale_x86:
    movl    %edi, %eax         # EAX = a (move 32-bit int)
    addl    %esi, %eax         # EAX = a + b (ALU Add)
    shll    $1, %eax           # EAX = EAX << 1 (Fast Multiply by 2 via bitshift)
    ret                        # Pop return address from stack and jump
    .section .note.GNU-stack,"",@progbits

# ----------------------------------------------------------------------------
# 2. ARM64 (AArch64) GNU Assembly
# Arguments: W0 = a, W1 = b | Return Value: W0
.globl add_and_scale_arm
add_and_scale_arm:
    add     w0, w0, w1         # W0 = a + b (32-bit register add)
    lsl     w0, w0, #1         # W0 = W0 << 1 (Logical Shift Left by 1)
    ret                        # Return to address in link register (X30)
    .section .note.GNU-stack,"",@progbits
`
  },

  quizQuestions: [
    {
      id: 1,
      question: "Why was the Von Neumann architecture revolutionary compared to earlier computing machines like ENIAC?",
      options: [
        {
          text: "It physically separated data memory and program memory onto separate circuit boards.",
          isCorrect: false,
          explanation: "Separate instruction and data storage defines the Harvard architecture, not Von Neumann."
        },
        {
          text: "It stored program instructions and operational data in the same electronic memory, eliminating manual physical rewiring.",
          isCorrect: true,
          explanation: "Correct! The Stored-Program concept allowed programs to be loaded, swapped, and executed dynamically as data."
        },
        {
          text: "It introduced the first multi-core execution pipeline with out-of-order reorder buffers.",
          isCorrect: false,
          explanation: "Multi-core and out-of-order execution were developed decades later in modern microarchitectures."
        }
      ]
    },
    {
      id: 2,
      question: "Which register directly controls the memory address of the next instruction word to be fetched?",
      options: [
        {
          text: "Instruction Register (IR)",
          isCorrect: false,
          explanation: "The IR holds the instruction *currently* being decoded, not the address of the next instruction."
        },
        {
          text: "Program Counter (PC / RIP)",
          isCorrect: true,
          explanation: "Correct! The Program Counter points to the next instruction in memory and increments sequentially unless branched."
        },
        {
          text: "Stack Pointer (SP / RSP)",
          isCorrect: false,
          explanation: "The Stack Pointer points to the top of the call stack frame for local variables and return addresses."
        }
      ]
    },
    {
      id: 3,
      question: "In the Iron Law of Processor Performance (CPU Time = I × CPI × τ), what is the direct effect of increasing clock frequency f from 2.0 GHz to 4.0 GHz if I and CPI remain constant?",
      options: [
        {
          text: "Execution time is halved because cycle period τ decreases from 0.5 ns to 0.25 ns.",
          isCorrect: true,
          explanation: "Correct! τ = 1/f. Doubling the clock frequency halves the cycle time, completing the same instructions in half the elapsed time."
        },
        {
          text: "Execution time doubles due to clock jitter.",
          isCorrect: false,
          explanation: "Higher frequency means faster clock pulses and shorter execution time, assuming no memory stalls."
        },
        {
          text: "CPI doubles automatically to compensate.",
          isCorrect: false,
          explanation: "CPI is determined by instruction dependencies and microarchitecture, not directly multiplied by clock frequency."
        }
      ]
    },
    {
      id: 4,
      question: "What is the primary architectural difference between CISC (e.g. x86-64) and RISC (e.g. ARM64, RISC-V)?",
      options: [
        {
          text: "RISC processors cannot execute floating-point operations.",
          isCorrect: false,
          explanation: "RISC processors have powerful floating-point and vector execution units (e.g. ARM NEON)."
        },
        {
          text: "CISC processors lack general purpose registers.",
          isCorrect: false,
          explanation: "x86-64 CISC processors have 16 general-purpose 64-bit registers (RAX-R15)."
        },
        {
          text: "CISC architectures have variable-length instructions and memory-to-register arithmetic, whereas RISC uses fixed-width instructions and a strict Load/Store model.",
          isCorrect: true,
          explanation: "Correct! In RISC, only dedicated LOAD/STORE instructions access memory, while all arithmetic executes strictly between registers."
        }
      ]
    },
    {
      id: 5,
      question: "What is a 'Data Hazard (RAW - Read After Write)' in a 5-stage CPU pipeline?",
      options: [
        {
          text: "Two instructions compete for the same physical memory bus port at the exact same cycle.",
          isCorrect: false,
          explanation: "This describes a Structural Hazard, not a Data Hazard."
        },
        {
          text: "An instruction requires an operand value computed by a preceding instruction that has not yet been committed to the register file.",
          isCorrect: true,
          explanation: "Correct! RAW occurs when instruction J needs data generated by instruction I while instruction I is still in EX or MEM stage."
        },
        {
          text: "A branch condition changes the address of the Program Counter.",
          isCorrect: false,
          explanation: "This is a Control Hazard."
        }
      ]
    },
    {
      id: 6,
      question: "How does Hardware Forwarding (Bypassing) eliminate pipeline stalls for RAW data hazards?",
      options: [
        {
          text: "By routing the output of the ALU directly back into the ALU input multiplexer for the following cycle without waiting for register writeback.",
          isCorrect: true,
          explanation: "Correct! Forwarding wires allow the newly computed result to be used immediately in the next cycle, avoiding 2 bubble cycles."
        },
        {
          text: "By flushing the pipeline and refetching the program from L3 cache.",
          isCorrect: false,
          explanation: "Flushing wastes clock cycles; forwarding avoids wasting cycles."
        },
        {
          text: "By pausing the clock oscillator until RAM completes writeback.",
          isCorrect: false,
          explanation: "Clock oscillators run at fixed crystal frequencies; pausing them is not how forwarding works."
        }
      ]
    },
    {
      id: 7,
      question: "Why does traversing a 2D array in column-major order cause drastic performance degradation compared to row-major in C?",
      options: [
        {
          text: "The C compiler refuses to vectorize column loops.",
          isCorrect: false,
          explanation: "Even with optimization flags, column-major access inherently conflicts with contiguous memory layout."
        },
        {
          text: "Column indices exceed 32-bit register limits.",
          isCorrect: false,
          explanation: "Indices fit within standard 32-bit or 64-bit integer registers."
        },
        {
          text: "Each column step jumps across rows by full stride width, missing the cached 64-byte line and incurring continuous cache miss penalties.",
          isCorrect: true,
          explanation: "Correct! C stores arrays in row-major order. Contiguous memory access leverages the full 64-byte cache line (spatial locality), while strided access thrashes cache lines."
        }
      ]
    },
    {
      id: 8,
      question: "What is the purpose of the CPU protection rings (Ring 0 to Ring 3)?",
      options: [
        {
          text: "To enforce hardware privilege separation, preventing user-space code (Ring 3) from directly modifying critical kernel data or physical devices.",
          isCorrect: true,
          explanation: "Correct! Ring 0 has full supervisor privileges (kernel mode), while Ring 3 restricts instructions (like `cli`, `lgdt`, page table modifications)."
        },
        {
          text: "To control CPU fan speeds based on core temperature.",
          isCorrect: false,
          explanation: "Thermal management is handled by ACPI and hardware thermal monitors, not CPU rings."
        },
        {
          text: "To determine how many threads each core can execute.",
          isCorrect: false,
          explanation: "Thread count is determined by SMT hardware topology."
        }
      ]
    },
    {
      id: 9,
      question: "What hardware vulnerability was exploited by the Meltdown attack?",
      options: [
        {
          text: "Physical fault injection by overclocking voltage regulators.",
          isCorrect: false,
          explanation: "Meltdown is an architectural and microarchitectural side-channel vulnerability, not a physical voltage attack."
        },
        {
          text: "Out-of-order and speculative execution permitted unauthorized reading of kernel memory before privilege checks retired, leaking data via CPU cache timing side-channels.",
          isCorrect: true,
          explanation: "Correct! The CPU executed the memory load speculatively and loaded the result into cache. Even though the instruction faulted upon retirement, the cache timing revealed the secret byte!"
        },
        {
          text: "A buffer overflow in the L1 instruction cache SRAM controller.",
          isCorrect: false,
          explanation: "Caches do not suffer software buffer overflows; the issue was speculative execution leaving observable cache state."
        }
      ]
    },
    {
      id: 10,
      question: "What fundamental architectural difference distinguishes modern GPUs from general-purpose CPUs?",
      options: [
        {
          text: "GPUs feature single-core 10 GHz processors executing out-of-order x86 instructions with deep speculative branch predictors.",
          isCorrect: false,
          explanation: "GPUs do not use 10 GHz single cores; they use thousands of low-frequency, energy-efficient cores optimized for massive parallelism."
        },
        {
          text: "GPUs lack hardware arithmetic logic units (ALUs) and execute calculations exclusively through operating system software emulation.",
          isCorrect: false,
          explanation: "GPUs contain thousands of physical ALUs and tensor cores fabricated directly in hardware."
        },
        {
          text: "CPUs dedicate significant die area to large caches and complex control logic to minimize single-thread latency, whereas GPUs dedicate most die area to thousands of lightweight ALUs operating in parallel (SIMT) to maximize throughput for data-parallel tasks.",
          isCorrect: true,
          explanation: "Correct! CPUs optimize latency for complex serial execution; GPUs optimize throughput for massive data parallelism (e.g. matrix multiplication and graphics) with parallel threads and device-dependent memory systems. HBM and GDDR are different memory technologies."
        }
      ]
    }
  ],

  exercises: [
    {
      id: 1,
      title: "Exercise 1: Calculate CPI, Clock Frequency, and Execution Time",
      level: "Beginner",
      description: "Apply the Iron Law of Processor Performance to calculate the elapsed execution time and throughput for a benchmark application.",
      tasks: [
        "A program executes 10,000,000,000 (10 billion) instructions.",
        "The CPU runs at a fixed clock frequency of 3.2 GHz (3.2 × 10^9 cycles/second).",
        "The instruction mix is: 50% ALU operations (1 cycle), 20% Branches (2 cycles), 20% Cache Hits (4 cycles), and 10% Cache Misses (50 cycles).",
        "Calculate: 1) Average CPI, 2) Total clock cycles, 3) Total execution time in seconds, 4) Effective IPC."
      ],
      solutionHint: "Average CPI = (0.50 × 1) + (0.20 × 2) + (0.20 × 4) + (0.10 × 50) = 0.50 + 0.40 + 0.80 + 5.00 = 6.70. Total cycles = 10^10 × 6.70 = 6.7 × 10^10. Time = Total Cycles / Frequency = 6.7 × 10^10 / 3.2 × 10^9 = 20.94 seconds. Effective IPC = 1 / CPI = 1 / 6.70 ≈ 0.149."
    },
    {
      id: 2,
      title: "Exercise 2: Eliminate a Cache Stride Bottleneck",
      level: "Intermediate",
      description: "Analyze an array processing algorithm that suffers severe L1/L2 cache miss stalls and refactor it for optimal 64-byte cache line utilization.",
      tasks: [
        "Inspect the provided C code example for matrix traversal.",
        "Explain why `matrix[i][j]` achieves near 95% L1 cache hits while `matrix[j][i]` incurs near 95% cache misses.",
        "Calculate how many 4-byte integers fit into a single standard 64-byte cache line.",
        "Rewrite a 2D image filter loop using block tiling (cache blocking) so that working tiles fit entirely within a 32 KB L1 cache."
      ],
      solutionHint: "A 64-byte cache line holds exactly 64 / sizeof(int) = 64 / 4 = 16 integers. In sequential row traversal, the first integer access misses (allocating the line), while the subsequent 15 integer accesses are instant L1 hits!"
    },
    {
      id: 3,
      title: "Exercise 3: Extend the Educational CPU Simulator with XOR and JNZ",
      level: "Advanced",
      description: "Enhance the Python educational CPU simulator to support bitwise XOR operations and conditional branching.",
      tasks: [
        "Add an opcode handler for 'XOR' in the ALU Execution stage, updating the Zero Flag if the result is 0.",
        "Add an instruction 'JNZ <target>' that checks if `self.zero_flag == False` and conditionally sets the Program Counter `self.pc` to the branch target.",
        "Write and step through a countdown loop program that counts down from 5 to 0 using your new instructions."
      ],
      solutionHint: "In STAGE 3 (Execute): if opcode == 'XOR': result = self.registers[dest] ^ val_src; self.zero_flag = (result == 0). In Control Flow: if opcode == 'JNZ' and not self.zero_flag: self.pc = target; return."
    }
  ]
};
