import {Command} from "@tauri-apps/plugin-shell";
import {useQuery} from "@tanstack/react-query";
import {Button} from "@/components/ui/button.tsx";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ArrowLeftCircle, HardDrive} from "lucide-react";
import {useDiskStore} from "@/lib/useDiskStore.ts";

export const Route = createFileRoute('/disks')({
    component: Disks,
})

function Disks() {

    // @ts-ignore
    const setDisk = useDiskStore((state) => state.setDisk);
    // @ts-ignore
    const selectedDisk = useDiskStore((state) => state.disk);

    const {data, isLoading} = useQuery({
        queryKey: ['disks'],
        queryFn: async () => {
            /** Schema:
             * ```js
             {
             "blockdevices": [
             {
             "name": "/dev/sda",
             "size": "894,3G"
             }
             ]
             }
             ```
             */
            const _call = await Command.create("exec-sh", [
                "-c",
                `lsblk -n -p --json --filter 'TYPE == "disk"' -o NAME,SIZE,MODEL`
            ]).execute();
            const data: {
                "blockdevices": [{
                    name: string,
                    size: string,
                    model: string
                }]
            } = JSON.parse(_call.stdout);
            console.log(data);
            return data;
        }
    })

    const navigate = useNavigate();

    return (
        <main className={"w-dvw h-dvh flex flex-col items-center justify-center bg-zinc-950 text-white gap-5"}>
            <h1 className={"text-4xl font-semibold text-left inline-flex items-center gap-3"}><HardDrive size={32}/>Disks
            </h1>
            <div>
                <p className={"text-lg"}>Please pick your disk to install Bluefin on. This will wipe the entire disk and
                    install the OS.</p>
                <p className={"text-lg"}>Once you have selected your disk, you can click on the button to install your
                    new OS.</p>
            </div>
            <div className={"flex flex-col gap-4 w-2/3 max-h-96 overflow-y-auto"}>
                {data?.blockdevices.map((disk, idx) => {
                    const parts = disk.name.split("/");
                    const lastPart = parts[parts.length - 1];
                    return (
                        <Card key={idx}
                              className={`w-full ${selectedDisk === disk.name ? 'bg-blue-500' : ''}`}
                              onClick={() => {
                                    setDisk(disk.name);
                              }}>
                            <CardHeader>
                                <CardTitle>{lastPart} <span>({disk.model})</span></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>Disk Size: {disk.size}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            <div className={"flex justify-between items-center w-2/3"}>
                <Button onClick={() => navigate({to: "/"})}><ArrowLeftCircle/>Go back to start</Button>
                {selectedDisk &&
                    <Button onClick={() => navigate({to: "/installation"})} disabled={isLoading}>Install</Button>}
            </div>
        </main>
    )
}