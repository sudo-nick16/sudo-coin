import { RiAccountCircleLine } from 'react-icons/ri';

type NavbarProps = {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <div className={`bg-[#191A23] flex flex-col items-center justify-between rounded-xl w-20 ${className}`}>
      <div className=''>
        <img src="/sudocoin.png" className='p-4' />
      </div>
      <div className='w-full flex flex-col items-center py-4'>
        <RiAccountCircleLine className="w-10 h-10 cursor-pointer" />
      </div>
    </div>
  )
}

export default Navbar;
