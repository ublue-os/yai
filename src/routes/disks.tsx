import { Command } from "@tauri-apps/plugin-shell";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import {
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ArrowLeftCircle, HardDrive, LockIcon } from "lucide-react";
import { useDiskStore } from "@/lib/useDiskStore.ts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/disks")({
  component: Disks,
});

function Disks() {
  const router = useRouter();
  // @ts-ignore
  const setDisk = useDiskStore((state) => state.setDisk);
  // @ts-ignore
  const selectedDisk = useDiskStore((state) => state.disk);

  const { data, isLoading } = useQuery({
    queryKey: ["disks"],
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
        `lsblk -n -p --json --filter 'TYPE == "disk"' -o NAME,SIZE,MODEL`,
      ]).execute();
      const data: {
        blockdevices: [
          {
            name: string;
            size: string;
            model: string;
          },
        ];
      } = JSON.parse(_call.stdout);
      console.log(data);
      return data;
    },
  });


  return (
    <main
      className={
        "w-dvw h-dvh flex flex-col items-center justify-center bg-zinc-950 text-white gap-5"
      }
    >
      <h1
        className={
          "text-4xl font-semibold text-left inline-flex items-center gap-3"
        }
      >
        <HardDrive size={32} />
        Disks
      </h1>
      <div>
        <p className={"text-lg"}>Pick your disk to install Bluefin on.</p>
      </div>
      <div className={"flex flex-col gap-4 w-2/3 max-h-96 overflow-y-auto"}>
        {data?.blockdevices.map((disk, idx) => {
          const parts = disk.name.split("/");
          const lastPart = parts[parts.length - 1];
          return (
            <Card
              key={idx}
              className={`w-full ${selectedDisk === disk.name ? "bg-blue-500" : ""}`}
              onClick={() => {
                setDisk(disk.name);
              }}
            >
              <CardHeader>
                <CardTitle>
                  {lastPart} <span>{disk.model && `(${disk.model})`}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>Disk Size: {disk.size}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className={"flex justify-between items-center w-2/3"}>
        <Button onClick={() => router.history.back()} variant="outline">
          <ArrowLeftCircle />
          Go back
        </Button>
        <Drawer>
          <DrawerTrigger>
            <Button
              disabled={!selectedDisk}
              variant={selectedDisk ? "default" : "outline"}
            >
              Install
            </Button>
          </DrawerTrigger>
          <DrawerContent className="items-center w-full">
            <DrawerHeader>
              <DrawerTitle className="text-2xl text-center">Are you sure?</DrawerTitle>
              <DrawerDescription className="text-md">
                This will format your disk and wipe any existing data
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="px-20 py-2">Confirm</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle><div className="flex items-center"><LockIcon size={32} className="px-1"/> Set a password for your disk</div></DialogTitle>
                  </DialogHeader>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Disk Password"
                    className="col-span-3"
                  />
                  <DialogFooter className={"flex justify-between items-center w-full"}>
                    <Button type="submit">Apply</Button>
                    <Button type="reset" variant="outline">Skip</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  );
}
