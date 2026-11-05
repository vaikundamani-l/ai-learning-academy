# ==============================================================================
# Dockerfile — Stage 0 Reproducible Developer Environment
# ==============================================================================
# Provides a completely isolated, reproducible POSIX development environment
# equipped with GNU coreutils, Python 3, Git, and build tools.
# ==============================================================================

FROM python:3.11-slim-bookworm

# Avoid prompts from debconf
ENV DEBIAN_FRONTEND=noninteractive

# Install essential system tools and compilers
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    coreutils \
    git \
    make \
    gcc \
    g++ \
    curl \
    tree \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root developer user
RUN useradd -m -s /bin/bash developer && \
    mkdir -p /workspace && \
    chown -R developer:developer /workspace

USER developer
WORKDIR /workspace

# Copy workspace source files
COPY --chown=developer:developer . /workspace/

# Default entrypoint runs the automated verification suite
CMD ["make", "all"]
