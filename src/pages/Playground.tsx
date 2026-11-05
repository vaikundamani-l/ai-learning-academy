import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Code, 
  Cpu, 
  Sparkles,
  FileCode2
} from 'lucide-react';

export const Playground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'python' | 'asm' | 'c'>('python');
  const [output, setOutput] = useState<string>('Code scratchpad preview. Browser execution is not implemented yet.');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const starterCode = {
    python: `# Educational CPU Instruction Execution Emulator
# Stage 0 — Fundamental Architecture Demonstration

def execute_cpu(instructions):
    registers = {"R1": 10, "R2": 25, "R3": 0, "FLAG_ZERO": 0}
    print(f"Initial State: {registers}")
    
    for cycle, (op, dest, src) in enumerate(instructions, 1):
        print(f"\\n--- Cycle {cycle}: {op} {dest}, {src} ---")
        if op == "ADD":
            registers[dest] = registers[dest] + registers[src]
        elif op == "SUB":
            registers[dest] = registers[dest] - registers[src]
            registers["FLAG_ZERO"] = 1 if registers[dest] == 0 else 0
        elif op == "LOAD_IMM":
            registers[dest] = src
        print(f"Updated Registers: {registers}")
    
    return registers

program = [
    ("LOAD_IMM", "R1", 15),
    ("ADD", "R1", "R2"),
    ("SUB", "R2", "R2")
]

final_state = execute_cpu(program)
print("\\n[SUCCESS] Final CPU State:", final_state)
`,
    asm: `; Stage 0: 64-bit Assembly (x86-64 Linux System Call)
; Educational Syscall & Register Manipulation

section .data
    msg db "AI Academy: CPU Executing Instruction Cycle", 10
    len equ $ - msg

section .text
    global _start

_start:
    ; sys_write (rax=1, rdi=1 for stdout, rsi=msg, rdx=len)
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, len
    syscall

    ; sys_exit (rax=60, rdi=0)
    mov rax, 60
    xor rdi, rdi
    syscall
`,
    c: `// Stage 2: Pointer Arithmetic & Memory Allocation in C
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    int value;
} CacheNode;

int main() {
    printf("Simulating Dynamic Memory Allocation on Heap...\\n");
    
    CacheNode *node = (CacheNode*)malloc(sizeof(CacheNode));
    if (!node) {
        fprintf(stderr, "Allocation failed!\\n");
        return 1;
    }
    
    node->id = 101;
    node->value = 42;
    
    printf("CacheNode Allocated at Heap Address: %p\\n", (void*)node);
    printf("Node ID: %d | Node Value: %d\\n", node->id, node->value);
    
    free(node);
    printf("[CLEANUP] Memory successfully freed with zero leaks.\\n");
    return 0;
}
`
  };

  const [code, setCode] = useState<string>(starterCode.python);

  const handleTabChange = (tab: 'python' | 'asm' | 'c') => {
    setActiveTab(tab);
    setCode(starterCode[tab]);
    setOutput(`Switched environment to ${tab.toUpperCase()}. Copy the code to run it locally.`);
  };

  const handleRun = () => {
    setOutput('Execution is not available yet. Copy this code and run it in your local development environment. Edits in this scratchpad are not executed.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
            <Terminal className="w-4 h-4" />
            <span>Interactive Code Playground</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Programming Scratchpad
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Explore and edit sample code. A browser runtime will be added in a later phase; use your local tools to execute it.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-slate-300 transition flex items-center space-x-1.5"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setCode(starterCode[activeTab])}
            className="p-2 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-slate-300 transition"
            title="Reset code to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRun}
            disabled title="Browser execution is not implemented yet"
            className="px-4 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-2 shadow-lg shadow-cyber-sky/20 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? 'Running...' : 'Execution unavailable'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor Panel */}
        <div className="rounded-xl bg-surface-card border border-surface-border overflow-hidden flex flex-col h-[520px]">
          {/* Editor Header / Language Tabs */}
          <div className="bg-surface px-4 py-2 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTabChange('python')}
                className={`px-3 py-1 rounded text-xs font-mono transition ${
                  activeTab === 'python'
                    ? 'bg-cyber-sky/20 text-cyber-sky font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => handleTabChange('asm')}
                className={`px-3 py-1 rounded text-xs font-mono transition ${
                  activeTab === 'asm'
                    ? 'bg-cyber-sky/20 text-cyber-sky font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                x86-64 ASM
              </button>
              <button
                onClick={() => handleTabChange('c')}
                className={`px-3 py-1 rounded text-xs font-mono transition ${
                  activeTab === 'c'
                    ? 'bg-cyber-sky/20 text-cyber-sky font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                C (C11)
              </button>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Live Editor</span>
          </div>

          {/* Textarea Editor */}
          <div className="flex-1 p-3 bg-void">
            <textarea
              aria-label="Code scratchpad"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent font-mono text-xs text-slate-200 resize-none focus:outline-none selection:bg-cyber-sky/30 leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output Console Panel */}
        <div className="rounded-xl bg-surface-card border border-surface-border overflow-hidden flex flex-col h-[520px]">
          {/* Console Header */}
          <div className="bg-surface px-4 py-2 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-cyber-emerald" />
              <span>Runtime Status</span>
            </div>
            <button
              onClick={() => setOutput('')}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition"
            >
              Clear
            </button>
          </div>

          {/* Console Textarea */}
          <div className="flex-1 p-4 bg-void font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};
