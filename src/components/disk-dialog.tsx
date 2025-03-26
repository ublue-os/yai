import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {LockIcon} from "lucide-react";

export function EncryptDiskDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Confirm</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle><div className="flex items-center"><LockIcon size={32} className="px-1"/> Set a password for your disk</div></DialogTitle>
                    <DialogDescription>
                        To secure your private and sensitive data, we highly recommend setting a password for your disk.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        id="password"
                        type="password"
                        placeholder="Disk Password"
                        className="col-span-3"
                    />
                </div>
                <DialogFooter>
                    <div className={"flex justify-between gap-3 items-center"}>
                        <Button type="reset" variant="outline">Skip</Button>
                        <Button variant={"default"} type="submit">Apply</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
