import { useUserContext } from '@/context/userContext';
import { GET_ASSIGNMENTS_BY_USER } from '@/graphql/query';
import { useApolloClient, useQuery } from '@apollo/client';

export default function useAssignmentsQuery() {
  const { user } = useUserContext();
  const client = useApolloClient();
  const { data, error, loading, refetch } = useQuery(GET_ASSIGNMENTS_BY_USER, {
    variables: {
      userId: user?.id,
    },
  });
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

  return {
    data: data?.getAssignmentsByUser,
    loading,
    error,
    refetchAssignments,
  };
}
