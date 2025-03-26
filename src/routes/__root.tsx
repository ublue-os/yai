import {createRootRoute, Outlet} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {ModeToggle} from "@/components/mode-toggle.tsx";

const client = new QueryClient();
export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <QueryClientProvider client={client}>
                    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                        <main className={"w-dvw h-dvh bg-gray-100 dark:bg-zinc-950"}>
                            <div className={"w-full p-4 flex justify-end"}>
                                <ModeToggle/>
                            </div>
                            <div className={"w-full flex-grow"}>
                                <Outlet/>
                            </div>
                        </main>
                        <TanStackRouterDevtools/>
                        <ReactQueryDevtools initialIsOpen={false}/>
                    </ThemeProvider>
                </QueryClientProvider>
            </>
        );
    },
});
