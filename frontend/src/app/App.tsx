import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./providers/router";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};
