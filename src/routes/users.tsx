import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  User,
  SettingsIcon,
  ArrowLeftCircle,
  ArrowRightCircle,
  EyeIcon,
  EyeClosedIcon,
} from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUsersStore } from "@/lib/useUsersStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const formSchema = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(50),
    password_repeat: z.string().min(1).max(50),
    unixname: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.password != values.password_repeat) {
      form.setError(
        "password_repeat",
        { type: "custom", message: "Your password does not match" },
        { shouldFocus: true },
      );
      return;
    }

    updateUnixName();
    setUsername(values.username);
    setPassword(values.password);
    setUnixname(values.unixname);

    router.navigate({ to: "/disks" });
  };

  const [manualUnixnameEnabled, setManualUnixnameEnabled] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const password = useUsersStore((state) => state.password);
  const setPassword = useUsersStore((state) => state.setPassword);
  const username = useUsersStore((state) => state.username);
  const setUsername = useUsersStore((state) => state.setUsername);
  const unixname = useUsersStore((state) => state.unixname);
  const setUnixname = useUsersStore((state) => state.setUnixname);

  const ASCII_CHARACTERS = /[^\x00-\x7F]/g;

  const updateUnixName = () => {
    if (
      manualUnixnameEnabled ||
      form.getValues("username") == undefined ||
      form.getValues("username")?.length == 0
    ) {
      return;
    }
    form.setValue(
      "unixname",
      toUnixName(form
        .getValues("username"))
    );
  };

  const toUnixName = (s: string): string => s
        .toLowerCase()
        .trim()
        .replace(/ /g, "_")
        .normalize("NFC")
        .replace(ASCII_CHARACTERS, "");

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
        <User />
        User
      </h1>
      <p className={"text-lg px-10 text-justify text-nowrap"}>
        Create your user for the installation
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <div className="flex space-x-1">
                  <FormControl>
                    <Input
                      defaultValue={username}
                      onFocus={() => updateUnixName()}
                      onInput={() => updateUnixName()}
                      placeholder="Your Username"
                      {...field}
                    />
                  </FormControl>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        onFocus={() => updateUnixName()}
                      >
                        <SettingsIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Your unix name</DialogTitle>
                        <DialogDescription>
                          This is a techincal user name used by tools like SSH
                          and SUDO. It should be modified only if you know what
                          you are doing.
                        </DialogDescription>
                      </DialogHeader>
                      <FormField
                        control={form.control}
                        name="unixname"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                defaultValue={unixname}
                                disabled={!manualUnixnameEnabled}
                                placeholder="Your unix username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="unixnamecheck"
                          defaultChecked={
                            manualUnixnameEnabled || (toUnixName(username) != unixname)
                          }
                          onCheckedChange={() => {
                            setManualUnixnameEnabled(!manualUnixnameEnabled);
                            updateUnixName();
                          }}
                        />
                        <label htmlFor="unixnamecheck" className="">
                          Manually override unix username
                        </label>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="flex items-center space-x-1">
                  <FormControl>
                    <Input
                      defaultValue={password}
                      type={showPassword ? "text" : "password"}
                      placeholder="Your Password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_repeat"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-1">
                  <FormControl>
                    <Input
                      defaultValue={password}
                      type={showPasswordRepeat ? "text" : "password"}
                      placeholder="Repeat Your Password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                  >
                    {showPasswordRepeat ? <EyeClosedIcon /> : <EyeIcon />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={"flex justify-between items-center"}>
            <Button onClick={() => router.history.back()} variant="outline">
              <ArrowLeftCircle />
              Go back
            </Button>

            <Button
              variant={"default"}
              type="submit"
              className={"px-5 text-lg inline-flex items-center"}
            >
              Next
              <ArrowRightCircle />
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
