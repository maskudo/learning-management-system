import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem('login'));
    if (!loginInfo) {
      navigate('/login');
    }
  }, []);
  return <div className="home">Home</div>;
}
