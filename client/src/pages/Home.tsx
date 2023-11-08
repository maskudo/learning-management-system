import Header from '@/components/common/Header';
import { Outlet } from 'react-router-dom';
import useUserQuery from '@/hooks/useUserQuery';

export default function Home() {
  useUserQuery();
  return (
    <div className="home h-[100vh] flex flex-col">
      <Header />
      <div className="container lg:w-6/12 md:2-9/12 sm:w-full mx-auto mt-4 border p-12">
        <Outlet />
      </div>
    </div>
  );
}
