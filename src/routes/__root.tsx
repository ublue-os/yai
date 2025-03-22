import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {ThemeProvider} from "@/components/theme-provider.tsx";

const client = new QueryClient();
export const Route = createRootRoute({
    component: () => (
        <>
            <QueryClientProvider client={client}>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

                    <Outlet/>
                    <TanStackRouterDevtools/>
                    <ReactQueryDevtools initialIsOpen={false}/>
                </ThemeProvider>
            </QueryClientProvider>
        </>
    ),
})