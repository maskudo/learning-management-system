import { useUserContext } from '@/context/userContext';
import { GET_USER_BY_EMAIL } from '@/graphql/query';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

export default function useUserQuery() {
  const { setUser } = useUserContext();
  const [getUser, { data, loading, error, refetch }] =
    useLazyQuery(GET_USER_BY_EMAIL);
  const refetchUser = () => {
    refetch().then((data) => {
      setUser(data.data.getUserByEmail);
    });
  };
  useEffect(() => {
    const email = localStorage.getItem('email');
    getUser({
      variables: {
        email: email,
      },
      onCompleted: (data) => {
        setUser(data.getUserByEmail);
      },
    });
  }, [setUser, getUser]);

  return {
    data,
    loading,
    error,
    refetchUser,
  };
}
