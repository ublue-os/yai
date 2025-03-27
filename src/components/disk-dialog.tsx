import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "@tanstack/react-router";
import { LockIcon } from "lucide-react";
import { useDiskPasswordStore } from "@/lib/useDiskPasswordStore";

export function EncryptDiskDialog() {
  const router = useRouter();

  const formSchema = z.object({
    disk_password: z.string().min(1).max(50),
    disk_password_repeat: z.string().min(1).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const setDiskPassword = useDiskPasswordStore((state) => state.setPassword);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.disk_password != values.disk_password_repeat) {
      form.setError(
        "disk_password_repeat",
        { type: "custom", message: "Passwords do not match" },
        { shouldFocus: true },
      );

      return;
    }
    setDiskPassword(values.disk_password);
    router.navigate({ to: "/installation" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Confirm</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <LockIcon size={32} className="px-1" /> Set a password for your
              disk
            </div>
          </DialogTitle>
          <DialogDescription>
            To secure your private and sensitive data, we highly recommend
            setting a password for your disk.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-md"
          >
            <FormField
              control={form.control}
              name="disk_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Disk Password"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disk_password_repeat"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Repeat disk password"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className={"flex justify-between gap-3 items-center"}>
                <Button
                  onClick={() => router.navigate({ to: "/installation" })}
                  type="reset"
                  variant="outline"
                >
                  Skip
                </Button>
                <Button variant={"default"} type="submit">
                  Apply
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
