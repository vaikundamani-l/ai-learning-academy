import React, { useState } from 'react';
import { SvgDiagramFrame } from '../SvgDiagramFrame';

export const CpuArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('alu');

  const componentDetails: Record<
    string,
    { title: string; type: string; width?: string; description: string; signals?: string[] }
  > = {
    cu: {
      title: 'Control Unit (CU)',
      type: 'Instruction Orchestrator',
      width: '32/64-bit Microcode',
      description:
        'The brain of the processor. It decodes opcodes fetched from memory into low-level micro-operations, coordinating register enables, ALU operation selection, and memory bus read/write strobes.',
      signals: ['CLK', 'ALU_OP[3:0]', 'REG_WRITE', 'MEM_READ', 'MEM_WRITE', 'BRANCH_EN'],
    },
    alu: {
      title: 'Arithmetic Logic Unit (ALU)',
      type: 'Execution Engine',
      width: '64-bit Wide',
      description:
        'Performs all integer arithmetic (addition, subtraction, multiplication) and bitwise logical operations (AND, OR, XOR, NOT, bit shifts). Evaluates status flags (Zero, Carry, Negative, Overflow) after every computation.',
      signals: ['OP_SEL', 'FLAG_Z', 'FLAG_C', 'FLAG_S', 'FLAG_O', 'CARRY_IN'],
    },
    registers: {
      title: 'Register File (GPRs & Special Registers)',
      type: 'Ultra-Fast On-Die Storage',
      width: '16 × 64-bit Registers',
      description:
        'The fastest storage in the entire computer hierarchy (~0.5 ns latency, 1 clock cycle). Holds immediate operands for ALU computations, stack pointers (RSP), base pointers (RBP), and general data.',
      signals: ['READ_ADDR_A[3:0]', 'READ_ADDR_B[3:0]', 'WRITE_ADDR[3:0]', 'WRITE_ENABLE'],
    },
    pc: {
      title: 'Program Counter (PC / RIP)',
      type: 'Instruction Pointer',
      width: '64-bit Pointer',
      description:
        'Holds the memory address of the next instruction waiting to be fetched. Automatically increments by instruction word length (e.g. +4 bytes in RISC or variable in x86) unless overridden by a branch or jump.',
      signals: ['PC_INCREMENT', 'BRANCH_TARGET_LOAD', 'RESET_VECTOR'],
    },
    cache: {
      title: 'Multi-Level On-Die Cache (L1 / L2 / L3)',
      type: 'SRAM Cache Hierarchy',
      width: '64-Byte Cache Lines',
      description:
        'High-speed Static RAM that bridges the massive speed gap between the GHz CPU core and the slower off-chip DDR5 RAM. L1 is split into Instruction and Data caches (1-4 cycles latency).',
      signals: ['CACHE_HIT', 'CACHE_MISS', 'TAG_MATCH', 'DIRTY_BIT', 'EVICT_LINE'],
    },
    bus_data: {
      title: 'Internal Data Bus',
      type: 'Bidirectional Interconnect',
      width: '64-bit Parallel Bus',
      description:
        'Carries operand values and memory contents between the CPU registers, cache, ALU, and system bus.',
      signals: ['DATA_STROBE', 'BUS_BUSY', 'BYTE_ENABLE[7:0]'],
    },
    bus_addr: {
      title: 'Internal Address Bus',
      type: 'Unidirectional Addressing',
      width: '64-bit (48-bit Virtual Addressable)',
      description:
        'Specifies the exact physical or virtual memory location that the CPU is requesting to read from or write into.',
      signals: ['ADDR_VALID', 'PAGE_OFFSET[11:0]', 'FRAME_TAG'],
    },
    clock: {
      title: 'System Clock Oscillator',
      type: 'Crystal Resonator & PLL',
      width: '3.2 GHz Frequency',
      description:
        'Generates square-wave voltage pulses that synchronize the latching of flip-flops and state transitions across all internal CPU pipeline stages.',
      signals: ['CLK_RISING_EDGE', 'PLL_LOCK', 'DUTY_CYCLE_50'],
    },
  };

  return (
    <SvgDiagramFrame
      title="Von Neumann CPU Architecture & Internal Bus Interconnect"
      description="Click on any internal sub-system to inspect its bit-width, signals, and functional role."
      viewBox="0 0 920 540"
      selectedComponent={selectedNode}
      onSelectComponent={setSelectedNode}
      componentDetails={componentDetails}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="gradCu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="gradAlu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="gradRegs" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="gradCache" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Background Die Outline */}
      <rect
        x="20"
        y="20"
        width="880"
        height="500"
        rx="16"
        fill="#0b1120"
        stroke="#1e293b"
        strokeWidth="2"
      />
      <text x="40" y="50" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="bold">
        CPU DIE BOUNDARY • 64-BIT ARCHITECTURE
      </text>

      {/* CLOCK GENERATOR */}
      <g
        role="button" tabIndex={0} aria-label={componentDetails['clock'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('clock'); } }}
        onClick={() => setSelectedNode('clock')}
        className="cursor-pointer transition-transform hover:opacity-90"
      >
        <rect
          x="40"
          y="70"
          width="130"
          height="55"
          rx="8"
          fill="#1e1b4b"
          stroke={selectedNode === 'clock' ? '#818cf8' : '#312e81'}
          strokeWidth={selectedNode === 'clock' ? '2.5' : '1.5'}
        />
        <text x="55" y="93" fill="#a5b4fc" fontSize="12" fontFamily="monospace" fontWeight="bold">
          CLOCK (3.2 GHz)
        </text>
        <path d="M 55 110 L 65 110 L 65 102 L 75 102 L 75 110 L 85 110 L 85 102 L 95 102" fill="none" stroke="#818cf8" strokeWidth="2" />
        <text x="110" y="110" fill="#6366f1" fontSize="10" fontFamily="monospace">
          ~0.31 ns
        </text>
      </g>

      {/* PROGRAM COUNTER (PC) */}
      <g
        role="button" tabIndex={0} aria-label={componentDetails['pc'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('pc'); } }}
        onClick={() => setSelectedNode('pc')}
        className="cursor-pointer transition-transform hover:opacity-90"
      >
        <rect
          x="200"
          y="70"
          width="180"
          height="55"
          rx="8"
          fill="#172554"
          stroke={selectedNode === 'pc' ? '#38bdf8' : '#1e3a8a'}
          strokeWidth={selectedNode === 'pc' ? '2.5' : '1.5'}
        />
        <text x="215" y="93" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
          PROGRAM COUNTER
        </text>
        <text x="215" y="112" fill="#93c5fd" fontSize="11" fontFamily="monospace">
          PC / RIP: 0x00401080
        </text>
      </g>

      {/* CONTROL UNIT (CU) */}
      <g
        role="button" tabIndex={0} aria-label={componentDetails['cu'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('cu'); } }}
        onClick={() => setSelectedNode('cu')}
        className="cursor-pointer transition-transform hover:opacity-90"
      >
        <rect
          x="40"
          y="150"
          width="340"
          height="140"
          rx="12"
          fill="url(#gradCu)"
          stroke={selectedNode === 'cu' ? '#f59e0b' : '#b45309'}
          strokeWidth={selectedNode === 'cu' ? '2.5' : '1.5'}
        />
        <text x="60" y="180" fill="#f59e0b" fontSize="14" fontFamily="monospace" fontWeight="bold">
          CONTROL UNIT (CU)
        </text>
        <text x="60" y="200" fill="#fbbf24" fontSize="11" fontFamily="monospace">
          • Instruction Decoder & Sequencer
        </text>
        <text x="60" y="220" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
          • Current IR: 0x48 0x89 0xC3 (MOV RBX, RAX)
        </text>
        <text x="60" y="240" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
          • Micro-operation timing matrix
        </text>
        <text x="60" y="265" fill="#94a3b8" fontSize="10" fontFamily="monospace">
          [Outputs: ALU_OP, REG_EN, MEM_STRB]
        </text>
      </g>

      {/* REGISTER FILE */}
      <g
        role="button" tabIndex={0} aria-label={componentDetails['registers'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('registers'); } }}
        onClick={() => setSelectedNode('registers')}
        className="cursor-pointer transition-transform hover:opacity-90"
      >
        <rect
          x="420"
          y="70"
          width="210"
          height="220"
          rx="12"
          fill="url(#gradRegs)"
          stroke={selectedNode === 'registers' ? '#38bdf8' : '#0284c7'}
          strokeWidth={selectedNode === 'registers' ? '2.5' : '1.5'}
        />
        <text x="440" y="98" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">
          REGISTER FILE (GPRs)
        </text>
        <g fontFamily="monospace" fontSize="10" fill="#e2e8f0">
          <text x="440" y="125">RAX: 0x000000000000002A</text>
          <text x="440" y="145">RBX: 0x0000000000000005</text>
          <text x="440" y="165">RCX: 0x00007FFD2B889000</text>
          <text x="440" y="185">RDX: 0x0000000000000000</text>
          <text x="440" y="205">RSP: 0x00007FFE4C001280</text>
          <text x="440" y="225">RBP: 0x00007FFE4C0012A0</text>
          <text x="440" y="250" fill="#38bdf8" fontWeight="bold">
            R8-R15: [8 General Regs]
          </text>
          <text x="440" y="270" fill="#94a3b8">
            Access: 1 Clock Cycle (~0.5ns)
          </text>
        </g>
      </g>

      {/* ARITHMETIC LOGIC UNIT (ALU) */}
      <g
        role="button" tabIndex={0} aria-label={componentDetails['alu'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('alu'); } }}
        onClick={() => setSelectedNode('alu')}
        className="cursor-pointer transition-transform hover:opacity-90"
      >
        <path
          d="M 660 70 L 860 110 L 860 180 L 660 220 L 660 160 L 710 145 L 660 130 Z"
          fill="url(#gradAlu)"
          stroke={selectedNode === 'alu' ? '#10b981' : '#059669'}
          strokeWidth={selectedNode === 'alu' ? '2.5' : '1.5'}
        />
        <text x="730" y="140" fill="#10b981" fontSize="15" fontFamily="monospace" fontWeight="bold">
          ALU
        </text>
        <text x="715" y="160" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
          64-bit Integer
        </text>
        <text x="695" y="178" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
          [ADD • SUB • AND • OR]
        </text>

        {/* Status Flags attached to ALU */}
        <rect x="670" y="240" width="180" height="50" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
        <text x="680" y="260" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontWeight="bold">
          EFLAGS: [ZF=1, CF=0, SF=0, OF=0]
        </text>
        <text x="680" y="278" fill="#34d399" fontSize="9" fontFamily="monospace">
          Zero • Carry • Sign • Overflow
        </text>
      </g>

      {/* SYSTEM BUSES */}
      {/* Control Bus */}
      <g role="button" tabIndex={0} aria-label={componentDetails['cu'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('cu'); } }}
        onClick={() => setSelectedNode('cu')} className="cursor-pointer">
        <path d="M 210 290 L 210 320 L 760 320 L 760 290" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" />
        <text x="220" y="315" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
          CONTROL BUS (OP_CODES & STROBES)
        </text>
      </g>

      {/* Data Bus */}
      <g role="button" tabIndex={0} aria-label={componentDetails['bus_data'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('bus_data'); } }}
        onClick={() => setSelectedNode('bus_data')} className="cursor-pointer">
        <path d="M 525 290 L 525 350 L 80 350 L 80 380" fill="none" stroke="#38bdf8" strokeWidth="4" />
        <path d="M 525 350 L 780 350 L 780 290" fill="none" stroke="#38bdf8" strokeWidth="4" />
        <text x="320" y="345" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
          DATA BUS [64-BIT BIDIRECTIONAL]
        </text>
      </g>

      {/* Address Bus */}
      <g role="button" tabIndex={0} aria-label={componentDetails['bus_addr'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('bus_addr'); } }}
        onClick={() => setSelectedNode('bus_addr')} className="cursor-pointer">
        <path d="M 290 125 L 290 370 L 840 370 L 840 400" fill="none" stroke="#eab308" strokeWidth="3" />
        <text x="560" y="365" fill="#eab308" fontSize="10" fontFamily="monospace" fontWeight="bold">
          ADDRESS BUS [48/64-BIT]
        </text>
      </g>

      {/* CACHE & MEMORY SUBSYSTEM */}
      <g
        role="button" tabIndex={0} aria-label={componentDetails['cache'].title}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNode('cache'); } }}
        onClick={() => setSelectedNode('cache')}
        className="cursor-pointer transition-transform hover:opacity-90"
      >
        <rect
          x="40"
          y="390"
          width="820"
          height="110"
          rx="12"
          fill="url(#gradCache)"
          stroke={selectedNode === 'cache' ? '#818cf8' : '#4338ca'}
          strokeWidth={selectedNode === 'cache' ? '2.5' : '1.5'}
        />
        <text x="60" y="415" fill="#a5b4fc" fontSize="13" fontFamily="monospace" fontWeight="bold">
          MEMORY SUBSYSTEM (HIERARCHY & BUS INTERFACE)
        </text>

        {/* L1 Cache */}
        <rect x="60" y="430" width="160" height="55" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
        <text x="75" y="450" fill="#c7d2fe" fontSize="11" fontFamily="monospace" fontWeight="bold">
          L1 CACHE (64 KB)
        </text>
        <text x="75" y="468" fill="#818cf8" fontSize="10" fontFamily="monospace">
          3-4 Cycles (~1.0 ns)
        </text>

        {/* L2 Cache */}
        <rect x="240" y="430" width="160" height="55" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
        <text x="255" y="450" fill="#c7d2fe" fontSize="11" fontFamily="monospace" fontWeight="bold">
          L2 CACHE (1 MB)
        </text>
        <text x="255" y="468" fill="#818cf8" fontSize="10" fontFamily="monospace">
          12-14 Cycles (~3.5 ns)
        </text>

        {/* L3 Cache */}
        <rect x="420" y="430" width="180" height="55" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
        <text x="435" y="450" fill="#c7d2fe" fontSize="11" fontFamily="monospace" fontWeight="bold">
          L3 CACHE (32 MB)
        </text>
        <text x="435" y="468" fill="#818cf8" fontSize="10" fontFamily="monospace">
          Shared LL (~12 ns)
        </text>

        {/* Main Memory (DRAM) */}
        <rect x="620" y="430" width="220" height="55" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <text x="635" y="450" fill="#cbd5e1" fontSize="11" fontFamily="monospace" fontWeight="bold">
          MAIN RAM (DDR5 32 GB)
        </text>
        <text x="635" y="468" fill="#94a3b8" fontSize="10" fontFamily="monospace">
          60-80 ns (~200+ Cycles)
        </text>
      </g>
    </SvgDiagramFrame>
  );
};
