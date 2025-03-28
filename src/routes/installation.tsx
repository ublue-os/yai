import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useDiskStore } from "@/lib/useDiskStore.ts";
import { Button } from "@/components/ui/button.tsx";
import { HardDriveDownloadIcon } from "lucide-react";
import { Terminal } from "@xterm/xterm"; 
import { FitAddon } from "@xterm/addon-fit";
import { initShell, readFromPty, writeToPty } from "@/lib/terminal";

export const Route = createFileRoute("/installation")({
  component: RouteComponent,
});


const formatToShell = (commands: string): string => {
  const finalCommand = commands.trim()
    
  return `sh <<"EOF"\n${finalCommand}\nEOF\n`
}

const bootcInstall = (disk: string) => {
  writeToPty(formatToShell(`
CONTAINER_IMAGE=$(distrobox-host-exec pkexec podman images --format '{{.Repository}}:{{.Tag}}' | head -n 1)
if [ "$YAI_DEBUG_BREAK_MY_SYSTEM" != 1 ] && ! systemd-analyze condition ConditionKernelCommandLine=rd.live.image; then
    echo >&2 "Detected non-LiveCD environment. Aborting..."
    exit 1
fi
pkexec bootc install to-disk \
    --wipe \
    --source-imgref containers-storage:$CONTAINER_IMAGE \
    ${disk}
`))
}


function RouteComponent() {
  // @ts-ignore
  const selectedDisk = useDiskStore((state) => state.disk);


  const term = new Terminal({
    fontFamily: "Jetbrains Mono",
    theme: {
      background: "rgb(47, 47, 47)",
    },
  });
  const termRef = useRef(null);

  useEffect(() => {
    const fitAddon = new FitAddon();
    initShell()
    term.loadAddon(fitAddon);
    // term.onData(writeToPty); Uncomment to make the terminal writeable by the user
    term.open(termRef.current!);
    window.requestAnimationFrame(() =>readFromPty(term));
  }, [])

  return (
    <main
      className={
        "w-full flex flex-col items-center justify-center dark:text-white gap-5"
      }
    >
      <h1
        className={
          "text-4xl font-semibold text-left inline-flex items-center gap-3"
        }
      >
        <HardDriveDownloadIcon size={32} />
        Installation
      </h1>
      <Button
        variant={"default"}
        onClick={() => bootcInstall(selectedDisk)}
      >
        Click me
      </Button>
      <div className="text-white" ref={termRef}></div>
    </main>
  );
}
