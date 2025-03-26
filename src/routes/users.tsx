import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
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
      <Input className="max-w-sm py-6" placeholder="Username" type="text" />
      <Input className="max-w-sm py-6" placeholder="Password" type="password" />
      <Button
        variant={"default"}
        className={"p-5 text-lg inline-flex items-center"}
        onClick={() => navigate({ to: "/disks" })}
      >
        Next
        <ArrowRightCircle />
      </Button>
    </main>
  );
}
