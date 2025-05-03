import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Intro = () => {
  const openCameraWindow = () => {
    // Electron의 ipcRenderer를 통해 메인 프로세스에 새 창 요청
    window.ipcRenderer.send('open-camera-window');
  };

  const navigate = useNavigate();

  return (
    <div className='flex size-full flex-col items-center justify-center'>
      <div className='flex w-full flex-col items-center justify-center gap-6'>
        <h1 className='font-play text-8xl font-semibold text-[#B89A51] font-stretch-50%'>
          Simin Photo Booth
        </h1>
        <p className='mb-12 text-2xl font-extralight text-[#b39344]'>
          시민의교회 청년부 포토부스에 오신 것을 환영합니다
        </p>
        <motion.button
          whileHover={{ scale: 1.2 }}
          className='cursor-pointer'
          onClick={() => {
            navigate('/shot');
            openCameraWindow();
          }}
        >
          <img src='/camera.png' alt='Camera' className='h-24 w-24' />
        </motion.button>
      </div>
    </div>
  );
};
