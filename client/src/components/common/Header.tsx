import { companyLogo } from '@/constants/images';
import { FaRegBell, FaRegUser } from 'react-icons/fa';
import { NavLink, Link } from 'react-router-dom';
const navItems = [
  {
    name: 'Dashboard',
    to: 'dashboard',
  },
  {
    name: 'All Courses',
    to: 'courses',
  },
  {
    name: 'My Courses',
    to: 'mycourse',
  },
  {
    name: 'Schedule',
    to: 'schedule',
  },
];
export default function Header() {
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
          <li className=" rounded ">
            <FaRegBell className="w-8 h-8" />
          </li>
          <li className=" rounded ">
            <Link to="/profile">
              <FaRegUser className="w-8 h-8" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
