import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Platform } from 'react-native';

// React Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: (failureCount: number, error: any) => {
        // Don't retry on 404 errors or authentication errors
        if (error?.status === 404 || error?.status === 401) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Only refetch when window is focused (for mobile)
      refetchOnWindowFocus: Platform.OS === 'web',
      // Enable background refetching
      refetchOnReconnect: true,
      // Disable refetching when component mounts
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations 2 times
      retry: 2,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Custom hook for using the query client
export const useQueryClient = () => queryClient;

// React Query provider component
interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only in development */}
      {__DEV__ && Platform.OS === 'web' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// Custom hooks for common query patterns
export const useInfiniteQuery = (options: any) => {
  return queryClient.useInfiniteQuery({
    ...options,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      // Implement your pagination logic here
      return lastPage.nextCursor;
    },
  });
};

export const usePrefetchQuery = (key: any, queryFn: any) => {
  return queryClient.prefetchQuery({
    queryKey: key,
    queryFn: queryFn,
  });
};

export const useInvalidateQueries = () => {
  return queryClient.invalidateQueries;
};

export const useResetQueries = () => {
  return queryClient.resetQueries;
};

export const useRemoveQueries = () => {
  return queryClient.removeQueries;
};

export const useSetQueryData = () => {
  return queryClient.setQueryData;
};

export const useGetQueryData = () => {
  return queryClient.getQueryData;
};

export const useQueryClientContext = () => {
  return queryClient;
};