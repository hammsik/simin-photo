import { useEffect, useState } from 'react';
import { cropImage } from '../utils/imageUtils';
import { motion } from 'motion/react';

export const LiveView = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const captureScreen = async () => {
    setIsCapturing(true);

    try {
      const sources = await window.ipcRenderer.captureScreen();

      if (sources && sources.length > 0) {
        const source = sources[0];
        const fullScreenImageUrl = source.thumbnail.toDataURL();
        const croppedImageUrl = await cropImage(fullScreenImageUrl);

        // 촬영한 이미지를 배열에 저장
        setPhotoUrls((prev) => [...prev, croppedImageUrl]);

        // 캡처한 이미지를 메인 창으로 전송
        window.ipcRenderer.send('image-captured', croppedImageUrl);
        console.log('이미지 전송 완료');
      }
    } catch (err) {
      alert(`화면 캡쳐 및 크롭 중 오류 발생했습니다: ${err}`);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (photoUrls.length >= 6) {
      setTimeout(() => setIsFinished(true), 500);
    }
  }, [photoUrls]);

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      {/* 드래그 가능한 영역 */}
      <div className='draggable absolute top-0 left-0 flex h-10 w-full cursor-grab items-center justify-end'>
        <button
          className='mr-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:opacity-50'
          onClick={captureScreen}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          ✕
        </button>
      </div>
      <div className='flex size-full'>
        {isFinished ?
          <motion.div
            className='bg-primary size-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          ></motion.div>
        : <>
            <div className='size-full'></div>
            <div className='bg-primary flex h-full w-[202px] flex-col items-center px-2 py-10'>
              <div className='flex size-full flex-col'>
                {photoUrls.map((photoUrl, index) => (
                  <motion.div
                    key={index}
                    className={`my-2 flex aspect-[3/2] w-full items-center justify-center`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img
                      src={photoUrl}
                      alt={`Captured ${index}`}
                      className='size-full rounded-md object-contain'
                    />
                  </motion.div>
                ))}
              </div>
              <p className='text-6xl'>{`${photoUrls.length} / 6`}</p>
            </div>
          </>
        }
      </div>
    </div>
  );
};
