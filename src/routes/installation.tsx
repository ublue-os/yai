import {createFileRoute} from '@tanstack/react-router'
import {Command} from '@tauri-apps/plugin-shell';
import {useState} from 'react';
import {useDiskStore} from "@/lib/useDiskStore.ts";
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/installation')({
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
    onerror: (error: string) => void
): Promise<void> {

    // TODO: Add image selector screen
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
        `
    ]);
    cmd.stdout.on('data', online);
    cmd.stderr.on('data', online);
    cmd.on('error', onerror);

    const childProc = await cmd.spawn();
    console.log(childProc.pid);
}

function RouteComponent() {

    const [errorText, setErrorText] = useState<string>('');
    const [lines, setLines] = useState<string[]>([]);

    // @ts-ignore
    const selectedDisk = useDiskStore((state) => state.disk);

    const addLine = (line: string) => {
        const newLines = lines.concat([line]);
        setLines(newLines);
    }

    const changeErrorText = (errorText: string): void => {
        setErrorText(errorText);
    }

    return (
        <main className={"w-dvw h-dvh flex flex-col items-center justify-center gap-6"}>
           <h1>Installation</h1>
            <div>Selected disk {selectedDisk}</div>
            <Button variant={"default"} onClick={() => bootcInstall("/dev/vda", addLine, changeErrorText )}>Click me</Button>
            {errorText && <div className={"text-red-500"}>{errorText}</div>}
            {lines.length > 0 && lines.map((line, index) => (
                <div key={index}>{line}</div>
            ))}
        </main>
    )
}
