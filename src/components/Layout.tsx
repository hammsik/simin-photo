import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center bg-linear-to-bl from-[#cbcac8] to-[#ECEAE9]'>
      <Outlet />
    </div>
  );
};
