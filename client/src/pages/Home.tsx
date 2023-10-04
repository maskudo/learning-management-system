import Header from '@/components/common/Header';
import { Outlet } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home h-screen">
      <Header />
      <div className="container w-8/12 mx-auto my-4 border h-full p-12">
        <Outlet />
      </div>
    </div>
  );
}
