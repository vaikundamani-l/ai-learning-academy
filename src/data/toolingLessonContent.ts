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

export const TOOLING_LESSON_CONTENT = {
  title: 'Terminal Shell, Developer Tooling & Git Internals',
  stageNumber: 0,
  stageTitle: 'Computer and Development Fundamentals',
  estimatedReadTime: '45 mins',

  objectives: [
    'Master Unix command-line shell mechanics: Standard streams (stdin 0, stdout 1, stderr 2), pipeline buffering, and stream redirection.',
    'Understand environment variables: Process inheritance during fork(), subshells, and how the kernel resolves executables via $PATH.',
    'Explore the Linux Filesystem Hierarchy Standard (FHS): The distinct roles of /bin, /usr, /etc, /var, /proc, and /sys.',
    'Deconstruct Git internals: Content-addressable storage, SHA-1 object hashing, blobs, trees, commits, and the .git directory structure.',
    'Analyze Git branching and graph theory: Directed Acyclic Graphs (DAG), HEAD pointer tracking, fast-forward vs. three-way recursive merges, and conflict resolution.',
    'Demystify basic internet architecture: Packet switching, IPv4 addresses, CIDR subnetting (/24), transport layer ports, DNS resolution, and the TCP 3-way handshake.'
  ],

  prerequisites: [
    'Stage 0 Lesson 1: CPU Architecture, ISA & Instruction Execution (Registers, Syscalls, Protection Rings).',
    'Stage 0 Lesson 3: Operating System Primitives, Processes, Threads & Permissions (fork, execve, File Descriptors, Inodes).',
    'Basic command-line familiarity (typing commands in a terminal).'
  ],

  lexicon: [
    {
      term: 'Shell',
      alias: 'Command Language Interpreter',
      definition: 'A userland program (such as Bash or Zsh) that reads human commands from standard input, parses tokens, manages processes, and executes system calls.',
      significance: 'Serves as the primary human interface to the operating system kernel and provides powerful pipeline automation.'
    },
    {
      term: 'Pipe (|)',
      definition: 'A unidirectional data channel in kernel memory connecting the standard output (FD 1) of one process to the standard input (FD 0) of another.',
      significance: 'Enables the Unix philosophy: building complex, composable data-processing workflows from small, modular programs.'
    },
    {
      term: 'File Redirection (<, >, >>)',
      definition: 'A shell mechanism that reassigns a process’s file descriptors to read from or write to disk files rather than the default terminal.',
      significance: 'Implemented at the OS kernel level using the dup2() system call before process execution begins.'
    },
    {
      term: 'PATH Environment Variable',
      definition: 'A colon-delimited list of filesystem directory paths that the shell searches sequentially to locate an executable binary when a command is typed.',
      significance: 'Eliminates the need to type absolute paths (e.g. typing "python3" instead of "/usr/bin/python3").'
    },
    {
      term: 'Git Blob (Binary Large Object)',
      definition: 'The fundamental Git object type that stores the raw byte content of a file without its filename, directory path, or permissions.',
      significance: 'Identical files across different directories or commits share the exact same blob hash, deduplicating storage.'
    },
    {
      term: 'Git Tree',
      definition: 'A Git object representing a filesystem directory, mapping filenames and file modes (permissions) to their corresponding SHA-1 blob or sub-tree hashes.',
      significance: 'Constructs the hierarchical snapshot of the project directory tree at a given commit.'
    },
    {
      term: 'Git Commit',
      definition: 'An immutable Git object pointing to a root Tree object, containing parent commit hashes, author/committer metadata, timestamp, and a commit message.',
      significance: 'Forms an immutable node in the Directed Acyclic Graph (DAG) tracking project history.'
    },
    {
      term: 'HEAD Pointer',
      definition: 'A reference pointer in .git/HEAD that indicates the currently checked-out commit or branch tip in the working directory.',
      significance: 'Determines the parent commit for any newly created commit and tracks branch checkout state.'
    },
    {
      term: 'Fast-Forward Merge',
      definition: 'A merge operation occurring when the target branch tip is a direct linear ancestor of the branch being merged, requiring only moving the branch pointer forward.',
      significance: 'Creates clean, linear history without generating an extraneous merge commit.'
    },
    {
      term: 'Three-Way Merge',
      definition: 'A merge operation that reconciles divergent branch histories by comparing two branch tips against their Most Recent Common Ancestor (MRCA).',
      significance: 'Automatically integrates non-overlapping edits and flags true conflicting lines for human developer resolution.'
    },
    {
      term: 'Packet Switching',
      definition: 'A networking paradigm where digital data is segmented into independent packets containing header metadata (source, destination IP) routed across a distributed network.',
      significance: 'Contrasts with circuit switching (traditional telephone networks); maximizes link utilization through statistical multiplexing.'
    },
    {
      term: 'CIDR Subnetting',
      alias: 'Classless Inter-Domain Routing',
      definition: 'A method for allocating IP addresses and IP routing where a prefix length (/24) specifies the number of leading bits identifying the network boundary versus host addresses.',
      significance: 'Determines the broadcast address, netmask, and maximum usable client devices on a local subnet.'
    },
    {
      term: 'TCP 3-Way Handshake',
      definition: 'The connection establishment protocol (SYN, SYN-ACK, ACK) used by the Transmission Control Protocol to synchronize sequence numbers and flow control windows before data transmission.',
      significance: 'Guarantees reliable, ordered, full-duplex byte stream delivery over unreliable packet-switched IP networks.'
    }
  ],

  codeExamples: {
    cPipelines: `// ============================================================================
// Shell Pipe & File Descriptor Redirection in C11
// Proving pipe() and dup2() mechanics connecting child and parent
// ============================================================================
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main() {
    int pipefd[2];
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return 1;
    }

    printf("--- 1. Linux Kernel Pipe Creation ---\\n");
    printf("Pipe created: Read FD = %d, Write FD = %d\\n", pipefd[0], pipefd[1]);

    pid_t pid = fork();
    if (pid == -1) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        // Child Process: Producer (writes message into pipe)
        close(pipefd[0]); // Close unused read end

        const char *msg = "PIPELINE_TELEMETRY: STATUS=OK BATCH=42\\n";
        // Write message directly into pipe buffer
        if (write(pipefd[1], msg, strlen(msg)) == -1) {
            perror("write");
            exit(1);
        }
        close(pipefd[1]); // Flush and close write end
        printf("[Child PID %d] Wrote message to pipe\\n", getpid());
        exit(0);
    } else {
        // Parent Process: Consumer (reads from pipe)
        close(pipefd[1]); // Close unused write end

        char buffer[128];
        ssize_t bytes_read = read(pipefd[0], buffer, sizeof(buffer) - 1);
        if (bytes_read > 0) {
            buffer[bytes_read] = '\\0';
            printf("[Parent PID %d] Received from Pipe: %s", getpid(), buffer);
        }
        close(pipefd[0]);
        waitpid(pid, NULL, 0);
        printf("Verdict: Unidirectional kernel ring buffer transmitted data successfully!\\n");
    }

    return 0;
}`,

    pythonGitEngine: `"""
Pure Python Git Object Generator & Content-Addressable Storage
Demonstrating raw SHA-1 hashing, object header formatting, and zlib compression.
"""
import hashlib
import zlib

def make_git_blob(content_str):
    """Create a raw Git blob object with header and SHA-1 hash."""
    content_bytes = content_str.encode('utf-8')
    # Standard Git header format: 'blob <byte_count>\\0'
    header = f"blob {len(content_bytes)}\\0".encode('utf-8')
    full_payload = header + content_bytes
    
    # Compute 40-character hexadecimal SHA-1 hash
    sha1_hash = hashlib.sha1(full_payload).hexdigest()
    
    # Compress payload using zlib (as stored in .git/objects/xx/yy...)
    compressed = zlib.compress(full_payload)
    
    return sha1_hash, full_payload, compressed

# Verification with standard Git example
test_content = "Hello World\\n"
hash_val, payload, compressed_data = make_git_blob(test_content)

print("--- Git Blob Deconstruction ---")
print(f"Content:         {test_content.strip()}")
print(f"Payload Header:  {payload[:15]}")
print(f"Computed SHA-1:  {hash_val}")
print(f"Object Path:     .git/objects/{hash_val[:2]}/{hash_val[2:]}")
print(f"Compressed Size: {len(compressed_data)} bytes")

# Git's universal hash for 'Hello World\\n'
assert hash_val == "557db03de997c86a4a028e1ebd3a1ceb225be238", "Git SHA-1 hash mismatch!"
print("Verdict: Hash matches git hash-object exactly!")
`,

    pythonSocketAndDns: `# Local TCP example: no Internet service or external DNS is required.
# The operating system performs TCP connection setup; this is not a packet capture.
import socket
import threading

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listener:
    listener.bind(("127.0.0.1", 0))  # Ask the OS for an available local port.
    listener.listen(1)
    listener.settimeout(5)
    address = listener.getsockname()
    errors = []

    def serve_once():
        try:
            connection, _ = listener.accept()
            with connection:
                connection.settimeout(5)
                chunks = []
                while True:
                    chunk = connection.recv(1024)
                    if not chunk:
                        break
                    chunks.append(chunk)
                connection.sendall(b"".join(chunks))
        except Exception as error:
            errors.append(error)

    server = threading.Thread(target=serve_once)
    server.start()
    try:
        with socket.create_connection(address, timeout=5) as client:
            client.sendall(b"hello")
            client.shutdown(socket.SHUT_WR)
            chunks = []
            while True:
                chunk = client.recv(1024)
                if not chunk:
                    break
                chunks.append(chunk)
            reply = b"".join(chunks)
        print("Local TCP reply:", reply.decode("ascii"))
        assert reply == b"hello"
    finally:
        server.join(timeout=6)
    assert not server.is_alive(), "Server did not finish"
    if errors:
        raise errors[0]
    print("Verified: local TCP connection exchanged application bytes.")
    print("DNS is separate: a domain lookup may resolve a name before connection setup.")
`
  },

  quizQuestions: [
    {
      id: 1,
      question: "In a Unix shell, what do file descriptors 0, 1, and 2 represent by convention?",
      options: [
        {
          text: "0: Standard Input (stdin), 1: Standard Output (stdout), 2: Standard Error (stderr).",
          isCorrect: true,
          explanation: "Correct! Every Unix process inherits these three standard I/O channels from its parent shell."
        },
        {
          text: "0: Kernel, 1: User, 2: Root.",
          isCorrect: false,
          explanation: "These are privilege concepts, not stream file descriptors."
        },
        {
          text: "0: Disk read, 1: Disk write, 2: Network packet.",
          isCorrect: false,
          explanation: "File descriptors represent abstract stream channels, not hardware device actions."
        }
      ]
    },
    {
      id: 2,
      question: "What does the shell command syntax '2>&1' accomplish in command redirection?",
      options: [
        {
          text: "It multiplies the file size by 2.",
          isCorrect: false,
          explanation: "Redirection operators manipulate I/O channels, not file contents."
        },
        {
          text: "It duplicates File Descriptor 2 (stderr) to point to the exact same destination as File Descriptor 1 (stdout), combining both streams.",
          isCorrect: true,
          explanation: "Correct! The '2>&1' operator uses the dup2() system call to redirect standard error into the standard output stream."
        },
        {
          text: "It runs the command twice in the background.",
          isCorrect: false,
          explanation: "Running commands concurrently in the background uses the '&' operator."
        }
      ]
    },
    {
      id: 3,
      question: "How does the shell locate an executable program when you type a command like 'python3' without specifying a directory path?",
      options: [
        {
          text: "It performs a global search across all connected physical hard drives.",
          isCorrect: false,
          explanation: "A full disk scan would be far too slow; searches are strictly restricted to $PATH directories."
        },
        {
          text: "It queries the DNS server on the local network.",
          isCorrect: false,
          explanation: "DNS resolves internet domain names, not local executable file paths."
        },
        {
          text: "It searches each directory listed in the colon-separated $PATH environment variable sequentially from left to right until the first executable match is found.",
          isCorrect: true,
          explanation: "Correct! The shell splits $PATH by colons (:) and checks directory by directory. The first matching executable is executed."
        }
      ]
    },
    {
      id: 4,
      question: "What is the difference between setting a shell variable ('MY_VAR=hello') and exporting it ('export MY_VAR=hello')?",
      options: [
        {
          text: "A non-exported variable is private to the current shell, while an exported variable is copied into the environment array of all subsequently spawned child processes.",
          isCorrect: true,
          explanation: "Correct! Exported variables are placed in the process's environ array, which is inherited by children during fork()."
        },
        {
          text: "Exported variables are permanently saved into the computer's BIOS chip.",
          isCorrect: false,
          explanation: "Environment variables reside purely in volatile RAM and terminate with the session."
        },
        {
          text: "Non-exported variables can only store numbers.",
          isCorrect: false,
          explanation: "Both types of variables store arbitrary strings."
        }
      ]
    },
    {
      id: 5,
      question: "How does Git store the contents of a file in its internal object database?",
      options: [
        {
          text: "As a delta diff patch against the original installation CD.",
          isCorrect: false,
          explanation: "Git stores complete content snapshots as compressed objects, not simple delta chains."
        },
        {
          text: "As a 'blob' object containing the raw file bytes preceded by a header 'blob <byte_length>\\0', indexed by its SHA-1 or SHA-256 hash (without the filename).",
          isCorrect: true,
          explanation: "Correct! Git is a content-addressable storage system. Blobs hold pure file data; filenames and permissions are stored separately in Tree objects."
        },
        {
          text: "Inside a centralized SQLite database file.",
          isCorrect: false,
          explanation: "Git uses a flat filesystem object hierarchy (.git/objects/xx/yy...) rather than an SQL database."
        }
      ]
    },
    {
      id: 6,
      question: "What does a Git 'Tree' object represent?",
      options: [
        {
          text: "The list of remote servers configured in git remote.",
          isCorrect: false,
          explanation: "Remote servers are stored in the text configuration file .git/config."
        },
        {
          text: "The binary compiler abstract syntax tree.",
          isCorrect: false,
          explanation: "Git is a version control system and does not compile code."
        },
        {
          text: "A directory snapshot, mapping file names and file modes (permissions) to their corresponding SHA-1 blob or sub-tree hashes.",
          isCorrect: true,
          explanation: "Correct! A Tree object is analogous to a Unix directory, pairing file names with their content-addressed blob hashes."
        }
      ]
    },
    {
      id: 7,
      question: "What information is encapsulated inside a Git 'Commit' object?",
      options: [
        {
          text: "The root Tree hash, parent commit hash(es), author and committer names/emails, timestamp, and the commit message.",
          isCorrect: true,
          explanation: "Correct! A commit ties a complete project tree snapshot to its chronological ancestors and author metadata."
        },
        {
          text: "Only the plain text lines that were modified.",
          isCorrect: false,
          explanation: "Commits point to complete Trees, not merely lines of text."
        },
        {
          text: "The encrypted root password of the developer's computer.",
          isCorrect: false,
          explanation: "Commits do not store system passwords."
        }
      ]
    },
    {
      id: 8,
      question: "Why is Git's commit history described as an 'Immutable Directed Acyclic Graph (DAG)'?",
      options: [
        {
          text: "Because Git deletes all files after 30 days.",
          isCorrect: false,
          explanation: "Git preserves repository history indefinitely."
        },
        {
          text: "Because each commit's cryptographic hash incorporates its parent hash; altering any historical commit changes its hash, breaking all subsequent descendant nodes.",
          isCorrect: true,
          explanation: "Correct! The cryptographic hash chain guarantees historical immutability; nodes have directed edges pointing backward to parents without circular loops."
        },
        {
          text: "Because commits can only be created by certified database administrators.",
          isCorrect: false,
          explanation: "Any user can create commits in a distributed Git repository."
        }
      ]
    },
    {
      id: 9,
      question: "Under what specific condition can Git perform a 'Fast-Forward' merge between two branches?",
      options: [
        {
          text: "When both developers use the same laptop computer.",
          isCorrect: false,
          explanation: "Git branching is independent of physical hardware."
        },
        {
          text: "When all files in the project are written in Python.",
          isCorrect: false,
          explanation: "Git is language-agnostic."
        },
        {
          text: "When the tip of the target branch is a direct linear ancestor of the branch being merged (no divergent commits exist on the target).",
          isCorrect: true,
          explanation: "Correct! If no new commits were created on the base branch, Git simply advances the branch pointer forward without creating a merge commit."
        }
      ]
    },
    {
      id: 10,
      question: "In basic internet architecture, how does the Transmission Control Protocol (TCP) establish a reliable connection between a client and server before data transfer begins?",
      options: [
        {
          text: "The client immediately streams UDP packets without waiting for connection confirmation or sequence synchronization.",
          isCorrect: false,
          explanation: "UDP is connectionless; TCP requires a 3-way handshake to synchronize sequence numbers and flow control parameters."
        },
        {
          text: "Via the TCP 3-Way Handshake: the client sends a SYN packet with an initial sequence number (ISN), the server responds with SYN-ACK acknowledging the client's ISN and offering its own, and the client replies with an ACK.",
          isCorrect: true,
          explanation: "Correct! The SYN -> SYN-ACK -> ACK handshake synchronizes initial sequence numbers ($ISN_c$ and $ISN_s$) and establishes flow control parameters for a reliable byte stream."
        },
        {
          text: "The client broadcasts an ARP request to all global routers to reserve a dedicated physical copper wire for circuit switching.",
          isCorrect: false,
          explanation: "The internet uses packet switching over shared infrastructure, not circuit switching with dedicated copper lines."
        }
      ]
    }
  ],

  exercises: [
    {
      id: 1,
      title: "Exercise 1: Manually Compute a Git Blob SHA-1 Hash",
      level: "Beginner",
      description: "Calculate the exact Git object header and SHA-1 hash for a short string.",
      tasks: [
        "Take string 'test content\\n' (13 bytes including newline).",
        "Formulate the uncompressed Git object payload: 'blob 13\\0test content\\n'.",
        "Compute the SHA-1 hash using python or the visualizer.",
        "Verify where Git would store this file in the .git/objects/ directory."
      ],
      solutionHint: "Payload is 'blob 13\\0test content\\n'. Its SHA-1 hash is d670460b4b4aece5915caf5c68d12f560a9fe3e4! It is stored at .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4."
    },
    {
      id: 2,
      title: "Exercise 2: Design a Composable Unix Pipeline",
      level: "Intermediate",
      description: "Construct a multi-stage shell pipeline to analyze an Apache/Nginx web server access log.",
      tasks: [
        "Extract the client IP addresses (column 1) from access.log.",
        "Sort the IP addresses so duplicate values appear contiguously.",
        "Count the frequency of each unique IP address and sort by descending count.",
        "Output the top 10 most active IP addresses into top_ips.txt using standard redirection."
      ],
      solutionHint: "Pipeline: cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 10 > top_ips.txt. Notice how standard output of each process flows seamlessly into standard input of the next!"
    },
    {
      id: 3,
      title: "Exercise 3: Trace a 3-Way Merge & Reconcile Merge Conflict",
      level: "Advanced",
      description: "Analyze the graph topology of a divergent branch merge and identify why conflicts occur.",
      tasks: [
        "Base commit C0 has line: 'TIMEOUT = 30'.",
        "Branch A (commit C1) modifies line to: 'TIMEOUT = 60'.",
        "Branch B (commit C2) modifies same line to: 'TIMEOUT = 90'.",
        "Explain why Git cannot automatically fast-forward and why a 3-way merge generates a conflict marker (<<<<<<<, =======, >>>>>>>)."
      ],
      solutionHint: "Both C1 and C2 modified the exact same line relative to their common ancestor C0. Because Git cannot deduce whether 60 or 90 was the intended business logic, it halts the 3-way merge and leaves conflict markers for human developer resolution!"
    }
  ]
};
