import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export const Intro = () => {
  const openCameraWindow = () => {
    // Electron의 ipcRenderer를 통해 메인 프로세스에 새 창 요청
    window.ipcRenderer.send("open-camera-window");
  };

  const navigate = useNavigate();

  return (
    <div className="size-full justify-center items-center flex flex-col">
      <div className="flex flex-col justify-center items-center gap-6 w-full">
        <h1 className="font-play text-8xl font-stretch-50% text-[#B89A51] font-semibold">
          Simin Photo Booth
        </h1>
        <p className="font-extralight text-2xl text-[#b39344] mb-12">
          시민의교회 청년부 포토부스에 오신 것을 환영합니다
        </p>
        <motion.button
          whileHover={{ scale: 1.2 }}
          className="cursor-pointer"
          onClick={() => {
            navigate("/shot");
            openCameraWindow();
          }}
        >
          <img src="/camera.png" alt="Camera" className="w-24 h-24" />
        </motion.button>
      </div>
    </div>
  );
};
