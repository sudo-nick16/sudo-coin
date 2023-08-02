import { RiAccountCircleLine, RiShutDownLine } from 'react-icons/ri';
import { FaBitcoin } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, logout, useAppDispatch } from '../store/store';
import useAxios from '../hooks/useAxios';

type NavbarProps = {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const user = useSelector<RootState, RootState["auth"]>((state) => state.auth);
  const api = useAxios();
  const location = useLocation();
  const appDispatch = useAppDispatch();
  console.log(location.pathname);
  const handleLogout = async () => {
    const res = await api.post("/auth/logout", {}, {
      withCredentials: true,
    })
    if (!res.data.error) {
      console.log(res.data.message);
      appDispatch(logout());
    }
  }

  return (
    <div className={`bg-[#191A23] flex flex-col items-center py-4 justify-between rounded-xl w-20 min-w-[80px] ${className}`}>
      <div className='w-full flex justify-center'>
        <Link to="/">
          <img src="/sudocoin.png" className='w-14 h-14 opacity-90 shadow-yellow-400 shadow-xl rounded-full' />
        </Link>
      </div>
      <div className='w-full flex flex-col gap-y-6 items-center'>
        {
          (user.user && user.accessToken) ? (
            <>
              <span className={`mt-4 w-full flex flex-col items-center ${location.pathname === '/tracked-coins' && 'border-l-2'}`}>
                <Link to="/tracked-coins">
                  <FaBitcoin className="w-10 h-10 cursor-pointer" />
                </Link>
              </span>
              <span className={`w-full flex flex-col items-center ${location.pathname === '/me' && 'border-l-2'}`}>
                <Link to="/me">
                  <RiAccountCircleLine className="w-10 h-10 cursor-pointer" />
                </Link>
              </span>
              <RiShutDownLine onClick={handleLogout} className="w-10 h-10 cursor-pointer" />
            </>
          ) : (
            <span className={`w-full flex flex-col items-center ${(location.pathname === '/login' || location.pathname === '/signup') && 'border-l-2'}`}>
              <Link to="/login">
                <RiAccountCircleLine className="w-10 h-10 cursor-pointer" />
              </Link>
            </span>
          )
        }
      </div>
    </div>
  )
}

export default Navbar;
