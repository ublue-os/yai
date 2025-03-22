import {createFileRoute, useNavigate} from '@tanstack/react-router'
import { LoaderCircle, CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/installation')({
    component: RouteComponent,
})

function RouteComponent() {
    const [installationLogs, setInstallationLogs] = useState([
        { text: "Downloading system packages (450MB)...", status: "pending" },
        { text: "Verifying package integrity...", status: "pending" },
        { text: "Installing base system...", status: "pending" },
        { text: "Configuring system settings...", status: "pending" },
        { text: "Setting up user accounts...", status: "pending" },
        { text: "Installing additional software...", status: "pending" },
        { text: "Finalizing installation...", status: "pending" }
    ]);

    const [installationComplete, setInstallationComplete] = useState(false);
    const navigate = useNavigate();
    // Simulate installation progress
    useEffect(() => {
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex >= installationLogs.length) {
                clearInterval(interval);
                setInstallationComplete(true);
                return;
            }

            setInstallationLogs(prev => {
                const updated = [...prev];

                // Set the current task to in-progress
                if (currentIndex < updated.length) {
                    updated[currentIndex].status = "in-progress";
                }

                // Set the previous task to complete
                if (currentIndex > 0) {
                    updated[currentIndex - 1].status = "complete";
                }

                return updated;
            });

            currentIndex++;

            // When reaching the last item, mark it as complete
            if (currentIndex === installationLogs.length) {
                setTimeout(() => {
                    setInstallationLogs(prev => {
                        const updated = [...prev];
                        updated[currentIndex - 1].status = "complete";
                        return updated;
                    });
                }, 1500); // Give the last item some time to show as "in-progress"
            }
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);


    return (
        <main className={"w-dvw h-dvh flex flex-col items-center justify-center gap-6"}>
            <h1 className={"text-5xl font-bold inline-flex items-center gap-5"}>
                {!installationComplete ? (
                    <LoaderCircle size={48} className={"animate-spin"}/>
                ) : (
                    <CheckCircle2 size={48} className={"text-green-500"}/>
                )}
                Installation
            </h1>
            <p className={"text-xl"}>
                {installationComplete
                    ? "Installation complete! Your new OS is ready to use."
                    : "Please wait while we install your new OS."}
            </p>
            <div className={"flex flex-col gap-4 font-mono max-w-2xl w-full px-4"}>
                {installationLogs.map((log, index) => (
                    <div key={index} className="flex items-center gap-3">
                        {log.status === "complete" ? (
                            <CheckCircle2 className="text-green-500" size={18} />
                        ) : log.status === "in-progress" ? (
                            <LoaderCircle className="animate-spin text-blue-500" size={18} />
                        ) : (
                            <Circle className="text-gray-400" size={18} />
                        )}
                        <span className={log.status === "pending" ? "text-gray-400" : ""}>
              {log.text}
            </span>
                    </div>
                ))}
            </div>

            {installationComplete && (
                <button
                    onClick={() => navigate({to: "/done"})}
                    className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                  transition-colors shadow-lg flex items-center justify-center"
                >
                    Continue
                </button>
            )}
        </main>
    )
}