import { RiAccountCircleLine, RiShutDownLine } from 'react-icons/ri';
import { FaBitcoin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import useAxios from '../hooks/useAxios';

type NavbarProps = {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const user = useSelector<RootState, RootState["auth"]>((state) => state.auth);
  const api = useAxios();
  console.log(user);
  const handleLogout = async () => {
    const res = await api.post("/auth/logout", {}, {
      withCredentials: true,
    })
    if (!res.data.error) {
      console.log(res.data.message);
    }
  }
  return (
    <div className={`bg-[#191A23] flex flex-col items-center justify-between rounded-xl w-20 min-w-[80px] ${className}`}>
      <div className='w-full'>
        <Link to="/">
          <img src="/sudocoin.png" className='p-4' />
        </Link>
        <Link to="/tracked-coins">
          <span className='mt-4 w-full flex flex-col items-center'>
            <FaBitcoin className="w-11 h-11 cursor-pointer" />
          </span>
        </Link>
      </div>
      <div className='w-full flex flex-col items-center py-4'>
        <RiAccountCircleLine className="w-10 h-10 cursor-pointer" />
        {
          user.user && user.accessToken && (
            <div className='mt-6'>
              <RiShutDownLine onClick={handleLogout} className="w-10 h-10 cursor-pointer" />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Navbar;
