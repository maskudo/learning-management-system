import Header from '@/components/common/Header';
import { Outlet } from 'react-router-dom';
import { GET_USER_BY_EMAIL } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { useUserContext } from '@/context/userContext';

export default function Home() {
  const email = localStorage.getItem('email');

  const { setUser } = useUserContext();
  useQuery(GET_USER_BY_EMAIL, {
    variables: {
      email: email,
    },
    onCompleted: (data) => {
      setUser(data.getUserByEmail);
    },
  });
  return (
    <div className="home h-screen">
      <Header />
      <div className="container lg:w-6/12 md:2-9/12 sm:w-full mx-auto my-4 border h-full p-12">
        <Outlet />
      </div>
    </div>
  );
}
