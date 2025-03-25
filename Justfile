bundle:
    #!/usr/bin/env bash
    podman run --rm -i -v ".:/app:Z" -w "/app" registry.fedoraproject.org/fedora:latest sh <<EOF
    set -xeuo pipefail
    dnf install -y unzip
    curl -fsSL https://bun.sh/install | bash
    dnf install -y webkit2gtk4.1-devel cargo rustc nodejs
    PATH=/root/.bun/bin:/usr/bin bun i
    PATH=/root/.bun/bin:/usr/bin bun run tauri build
    EOF
