import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-linear-to-bl from-[#cbcac8] to-[#ECEAE9]">
      <Outlet />
    </div>
  );
};
