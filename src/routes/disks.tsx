import {invoke} from "@tauri-apps/api/core";
import {useQuery} from "@tanstack/react-query";
import {Button} from "@/components/ui/button.tsx";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ArrowLeftCircle, HardDrive} from "lucide-react";
import {useState} from "react";

export const Route = createFileRoute('/disks')({
    component: Disks,
})

function Disks() {

    const [selectedDisk, setSelectedDisk] = useState<string>("");

    const {data, isLoading} = useQuery({
        queryKey: ['disks'],
        queryFn: async () => {
            const data: string[] = await invoke('get_blockdevices');
            console.log(data);
            return data;
        }
    })

    const navigate = useNavigate();

    return (
        <main className={"w-dvw h-dvh flex flex-col items-center justify-center bg-zinc-950 text-white gap-5"}>
            <h1 className={"text-4xl font-semibold text-left inline-flex items-center gap-3"}><HardDrive size={32}/>Disks</h1>
            <div>
            <p className={"text-lg"}>Please pick your disk to install Bluefin on. This will wipe the entire disk and install the OS.</p>
            <p className={"text-lg"}>Once you have selected your disk, you can click on the button to install your new OS.</p>
            </div>
            <div className={"flex flex-col gap-4 w-2/3 max-h-96 overflow-y-auto"}>
                {data?.map((disk) => {
                    const parts = disk.split('/');
                    const lastPart = parts[parts.length - 1];
                    return (
                        <Card id={disk} className={`w-full ${selectedDisk === disk ? 'bg-blue-500' : ''}`}
                        onClick={() => setSelectedDisk(disk)}>
                            <CardHeader>
                                <CardTitle>{lastPart}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>Disk Size: 1.8 Petabytes</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            <div className={"flex justify-between items-center w-2/3"}>
                <Button onClick={() => navigate({to: "/"})}><ArrowLeftCircle/>Go back to start</Button>
                {selectedDisk && <Button onClick={() => navigate({to: "/installation"})} disabled={isLoading}>Install</Button>}
            </div>
        </main>
    )
}