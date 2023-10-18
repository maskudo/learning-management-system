import { useUserContext } from '@/context/userContext';
import { GET_USER_BY_EMAIL } from '@/graphql/query';
import { useQuery } from '@apollo/client';

export default function useUserQuery() {
  const email = localStorage.getItem('email');

  const { setUser } = useUserContext();
  const { data, loading, error, refetch } = useQuery(GET_USER_BY_EMAIL, {
    variables: {
      email: email,
    },
    onCompleted: (data) => {
      setUser(data.getUserByEmail);
    },
  });
  const refetchUser = () => {
    refetch().then((data) => {
      setUser(data.data.getUserByEmail);
    });
  };

  return {
    data,
    loading,
    error,
    refetchUser,
  };
}
