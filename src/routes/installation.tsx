import { createFileRoute } from "@tanstack/react-router";
import { Command } from "@tauri-apps/plugin-shell";
import { useState } from "react";
import { useDiskStore } from "@/lib/useDiskStore.ts";
import { Button } from "@/components/ui/button.tsx";
import { useEffect } from "react";
import { FitAddon } from '@xterm/addon-fit';
import { useXTerm } from 'react-xtermjs';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress";
import { HardDriveDownloadIcon } from "lucide-react";

export const Route = createFileRoute("/installation")({
  component: RouteComponent,
});

/**
 * Run `bootc install to-disk to a specific disk`
 * @param online Callback called when stdin receives a line.
 * @param onerror Callback called when an error happens.
 */
async function bootcInstall(
  disk: string,
  online: (line: string) => void,
  onerror: (error: string) => void,
): Promise<void> {
  const cmd = Command.create("exec-sh", [
    "-c",
    `
        CONTAINER_IMAGE=$(pkexec podman images --format '{{.Repository}}:{{.Tag}}' | head -n 1)
        if [ "$YAI_DEBUG_BREAK_MY_SYSTEM" != 1 ] && ! systemd-analyze condition ConditionKernelCommandLine=rd.live.image; then
            echo >&2 "Detected non-LiveCD environment. Aborting..."
            exit 1
        fi
        pkexec bootc install to-disk \
            --wipe \
            --source-imgref containers-storage:$CONTAINER_IMAGE \
            ${disk}
        `,
  ]);
  cmd.stdout.on("data", online);
  cmd.stderr.on("data", online);
  cmd.on("error", onerror);

  const childProc = await cmd.spawn();
  console.log(childProc.pid);
}

function RouteComponent() {
  const [errorText, setErrorText] = useState<string>("");
  const [lines, setLines] = useState<string[]>([]);

  // @ts-ignore
  const selectedDisk = useDiskStore((state) => state.disk);

  const addLine = (line: string) => {
    const newLines = lines.concat([line]);
    setLines(newLines);
  };

  const changeErrorText = (errorText: string): void => {
    setErrorText(errorText);
  };

  const [progress, setProgress] = useState(13)

  const { instance, ref } = useXTerm()
  const fitAddon = new FitAddon()

  useEffect(() => {
    // Load the fit addon
    instance?.loadAddon(fitAddon)

    const handleResize = () => fitAddon.fit()

    // Write custom message on your terminal
    lines.forEach((line) => instance?.writeln(line))
    instance?.clear()

    // Handle resize event
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref, instance, lines])


  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main
      className={
        "w-full h-full flex flex-col items-center justify-center dark:text-white gap-5"
      }
    >
      <h1
        className={
          "text-4xl font-semibold text-left inline-flex items-center gap-3"
        }
      >
        <HardDriveDownloadIcon size={32}/>
        Installation
      </h1>
      <Carousel>
        <CarouselContent>
          <CarouselItem>Here is some text!</CarouselItem>
          <CarouselItem>Here is some text!</CarouselItem>
          <CarouselItem>Here is some text!</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Progress value={progress} className="w-[60%]" />

      <Button
        variant={"default"}
        onClick={() => {
          setLines([])
          console.log(lines)
          bootcInstall("/dev/vda", addLine, changeErrorText)
        }}
      >
        Start installation (DEBUG)
      </Button>
      {errorText && <div className={"text-red-500"}>{errorText}</div>}
      <div ref={ref} style={{ height: '100%', width: '100%' }} />
    </main>
  );
}
