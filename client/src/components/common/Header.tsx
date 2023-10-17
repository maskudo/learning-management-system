import { companyLogo } from '@/constants/images';
import { useUserContext } from '@/context/userContext';
import { Dropdown, MenuProps } from 'antd';
import { FaRegUser } from 'react-icons/fa';
import { NavLink, Link, useNavigate } from 'react-router-dom';
const navItems = [
  {
    name: 'Dashboard',
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
const items: MenuProps['items'] = [
  {
    key: '1',
    label: <Link to="/profile">Profile</Link>,
  },
  {
    key: '2',
    label: <div>Logout</div>,
  },
];

export default function Header() {
  const navigate = useNavigate();
  const { setUser, user } = useUserContext();
  const onClick = ({ key }) => {
    if (key === '2') {
      localStorage.clear();
      setUser(null);
      navigate('/login');
    }
  };
  return (
    <header className="shadow px-20">
      <nav className="flex items-center gap-6 justify-between">
        <div className="left flex">
          <div className="logo">
            <img
              src={companyLogo}
              alt="company-logo"
              className="img w-32 h-auto"
            />
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
          <li className=" rounded ">{user?.name}</li>
          <li className=" rounded ">
            <Dropdown menu={{ items, onClick }} placement="bottomRight" arrow>
              <FaRegUser className="w-8 h-8" />
            </Dropdown>
          </li>
        </ul>
      </nav>
    </header>
  );
}
