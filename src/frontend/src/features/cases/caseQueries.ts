import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import type { CaseRecord } from '@/backend';

const CASES_QUERY_KEY = ['cases'];

export function useCaseRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<CaseRecord[]>({
    queryKey: CASES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

interface AddRecordParams {
  name: string;
  caseNumber: string;
  crimeNumber: string | null;
  forwardDate: string | null;
  manualNote: string;
}

export function useAddCaseRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddRecordParams) => {
      if (!actor) throw new Error('Actor not initialized');
      
      await actor.addRecord(
        params.name,
        params.caseNumber,
        params.crimeNumber,
        params.forwardDate,
        params.manualNote
      );
    },
    onSuccess: () => {
      // Invalidate and refetch cases
      queryClient.invalidateQueries({ queryKey: CASES_QUERY_KEY });
    },
  });
}
