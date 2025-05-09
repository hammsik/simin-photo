import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomDialog } from '../components/CustomDialog';

export const Intro = () => {
  const navigate = useNavigate();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  useEffect(() => {
    // Electron의 ipcRenderer를 통해 메인 프로세스에 새 창 요청
    window.ipcRenderer.send('open-camera-window');
  }, []);

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
          onClick={() => setIsOpenDialog(true)}
        >
          <img src='/camera.png' alt='Camera' className='h-24 w-24' />
        </motion.button>
      </div>
      {isOpenDialog && (
        <CustomDialog
          submit={(photoName: string) => {
            if (photoName.length === 0) {
              alert('사진 제목을 입력해주세요.');
              return;
            }
            navigate('/during-shot', { state: { photoName } });
          }}
          cancel={() => setIsOpenDialog(false)}
        />
      )}
    </div>
  );
};
