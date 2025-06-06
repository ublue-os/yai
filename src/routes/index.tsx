import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { ArrowRightCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <main
      className={
        "w-full h-full flex flex-col items-center justify-center dark:text-white gap-5"
      }
    >
      <img src={"/achillobator.webp"} alt={"logo"} width={250} />
      <h1 className={"text-4xl font-semibold "}>Welcome to Bluefin</h1>
      <p>
        You're just a few clicks away from a fresh Bluefin installation. At long
        last, you have ascended.
      </p>
      <Button
        variant={"default"}
        className={"p-5 text-lg inline-flex items-center"}
        onClick={() => navigate({ to: "/users" })}
      >
        Get started
        <ArrowRightCircle />
      </Button>
    </main>
  );
}
