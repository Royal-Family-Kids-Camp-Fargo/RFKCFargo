import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useStore from '../zustand/store';
import { queryRefetchConfig } from '../config/queryRefetchConfig';

const useInvalidateQueriesOnStoreChange = () => {
  const queryClient = useQueryClient();
  const latestEndpoints = useStore((state) => state.latestEndpoints);

  const invalidateQueries = useCallback(() => {
    console.log('latestEndpoints from callback', latestEndpoints);
    if (!latestEndpoints || !Array.isArray(latestEndpoints)) {
      return;
    }

    // Wrap in setTimeout to ensure DOM updates have completed
    setTimeout(() => {
      Object.entries(queryRefetchConfig).forEach(([queryKey, configs]) => {
        configs.forEach(({ path, methods }) => {
          const shouldInvalidate = latestEndpoints.some((endpoint) => {
            if (!endpoint || !endpoint.path || !endpoint.method) return false;

            return path.some((pattern) => {
              const endpointMethods = endpoint.method.replace(/[\[\]']/g, '').split(',').map(method => method.trim());
              return (
                endpoint.path === pattern &&
                endpointMethods.some((method) => methods.includes(method))
              );
            });
          });

          if (shouldInvalidate) {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          }
        });
      });
    }, 0);
  }, [latestEndpoints, queryClient]);

  useEffect(() => {
    invalidateQueries();
  }, [invalidateQueries]);
};

export default useInvalidateQueriesOnStoreChange;
