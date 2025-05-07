import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className='h-screen w-screen bg-linear-to-bl from-[#cbcac8] to-[#ECEAE9]'>
      <Outlet />
    </div>
  );
};
