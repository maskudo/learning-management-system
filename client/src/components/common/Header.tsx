import { companyLogo } from '@/constants/images';
import { useUserContext } from '@/context/userContext';
import { useApolloClient } from '@apollo/client';
import { NavLink, useNavigate } from 'react-router-dom';
const navItems = [
  {
    name: 'Home',
    to: '/',
  },
  {
    name: 'Courses',
    to: 'courses',
  },
  {
    name: 'Schedule',
    to: 'schedule',
  },
];

export default function Header() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { setUser } = useUserContext();
  const onClick = () => {
    localStorage.clear();
    client.resetStore();
    setUser(null);
    navigate('/login');
  };
  return (
    <header className="shadow px-20">
      <nav className="flex items-center gap-6 justify-between">
        <div className="left flex">
          <div className="logo">
            <img src={companyLogo} alt="company-logo" className="img w-32 " />
          </div>
          <ul className="flex items-center gap-6">
            {navItems.map((item) => {
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive, isPending }) =>
                      isPending
                        ? 'pending'
                        : isActive
                          ? 'active underline underline-offset-8 decoration-blue-400 decoration-2'
                          : ''
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <ul className="right flex gap-6 items-center">
          {
            // <li className="flex flex-col items-center">
            //   <Link to="/profile">Profile</Link>
            // </li>
          }
          <li
            onClick={onClick}
            className="border p-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-lg flex justify-center items-center gap-2"
          >
            Log out
          </li>
        </ul>
      </nav>
    </header>
  );
}
