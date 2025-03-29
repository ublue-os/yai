import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useDiskStore } from "@/lib/useDiskStore.ts";
import { Button } from "@/components/ui/button.tsx";
import { HardDriveDownloadIcon } from "lucide-react";
import { Terminal } from "@xterm/xterm"; 
import { FitAddon } from "@xterm/addon-fit";
import { initShell, readFromPty, writeToPty } from "@/lib/terminal";
import { useDiskPasswordStore } from "@/lib/useDiskPasswordStore";
 
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export const Route = createFileRoute("/installation")({
  component: RouteComponent,
});


const formatToShell = (commands: string): string => {
  const finalCommand = commands.trim()

  return `pkexec sh --norc --noprofile <<"EOF"\n${finalCommand}\nEOF\n`
}

const bootcInstall = (disk: string, diskPassword: string) => {
  const installWithEncyption = diskPassword.trim() != ""
  writeToPty(formatToShell(`
set -x
CONTAINER_IMAGE=$(podman images --format '{{.Repository}}:{{.Tag}}' | head -n 1)
if [ "$YAI_DEBUG_BREAK_MY_SYSTEM" != 1 ] && ! systemd-analyze condition ConditionKernelCommandLine=rd.live.image; then
    echo >&2 "Detected non-LiveCD environment. Aborting..."
    exit 1
fi
# We cant have the progress bar here else bootc locks up
bootc install to-disk \
    --wipe ${installWithEncyption ? "--block-setup tpm2-luks" : ""} \
    --source-imgref containers-storage:$CONTAINER_IMAGE \
    --target-imgref $CONTAINER_IMAGE \
    ${disk} |& cat

set -euo pipefail
# FIXME: also account for luks2, /dev/mapper/root should be it
TARGET_ENTRY="$(lsblk --json | jq '.blockdevices[] | select(. != null) | .children | select(. != null) | .[] | select(.mountpoints[] == "/run/bootc/storage")')"
TARGET_BLOCKDEVICE="/dev/$(jq -r '.name' <<<"$TARGET_ENTRY")"
umount "$TARGET_BLOCKDEVICE"
mkdir -p "/mnt/rootfs"
mount "$TARGET_BLOCKDEVICE" "/mnt/rootfs"

VAR_ON_ROOTFS="/mnt/rootfs/ostree/deploy/default/var"
mkdir -p "$VAR_ON_ROOTFS/lib"
rsync -ah --info=progress2 /var/lib/flatpak $VAR_ON_ROOTFS/lib
`))
}


function RouteComponent() {
  // @ts-ignore
  const selectedDisk = useDiskStore((state) => state.disk);
  const diskPassword = useDiskPasswordStore((state) => state.password);


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
        onClick={() => bootcInstall(selectedDisk, diskPassword)}
      >
        Click me
      </Button>
     <Carousel className="w-full max-w-xl">
      <CarouselContent className="w-full">
          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardContent className="flex w-full aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">Bluefin is built on Cloud native technologies!</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">1</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    
      <div ref={termRef}></div>
    </main>
  );
}
