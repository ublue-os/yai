import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {ArrowLeftCircle, CircleCheckBigIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/done')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    return (
        <main className={"w-dvw h-dvh flex flex-col items-center justify-center gap-4"}>
            <h1 className={"text-5xl font-bold inline-flex items-center gap-5"}><CircleCheckBigIcon size={48}/>The
                installation is done.</h1>
            <p className={"text-xl"}>You can now restart your computer.</p>
            <Button onClick={() => navigate({to: "/"})}><ArrowLeftCircle/>Go back to start</Button>
        </main>
    )
}
