import Header from '@/components/common/Header';
import { Outlet } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <Header />
      <Outlet />
    </div>
  );
}
