import { useUserContext } from '@/context/userContext';
import { GET_ASSIGNMENTS_BY_USER } from '@/graphql/query';
import { useApolloClient, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

export default function useAssignmentsQuery() {
  const { user } = useUserContext();
  const client = useApolloClient();
  const [getAssignments, { data, error, loading, refetch }] = useLazyQuery(
    GET_ASSIGNMENTS_BY_USER,
    {}
  );
  const refetchAssignments = () => {
    refetch().then((data) => {
      client.writeQuery({
        query: GET_ASSIGNMENTS_BY_USER,
        data: data.data,
        variables: {
          userId: user?.id,
        },
      });
    });
  };
  useEffect(() => {
    if (user) {
      getAssignments({
        variables: {
          userId: user?.id,
        },
      });
    }
  }, [user, getAssignments]);

  return {
    data: data?.getAssignmentsByUser,
    loading,
    error,
    refetchAssignments,
  };
}
