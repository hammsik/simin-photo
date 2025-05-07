import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export const DuringShot = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  // 리스너가 이미 등록되었는지 추적하는 ref
  const listenerRegisteredRef = useRef(false);

  useEffect(() => {
    console.log('이미지 수신 리스너 등록 시도');

    // 이벤트 핸들러 함수 정의
    const handleImageCaptured = (_event: unknown, imageUrl: string) => {
      try {
        setPhotos((prevPhotos) => [...prevPhotos, imageUrl]);
      } catch (err) {
        alert(`이미지 수신 중 오류 발생: ${err}`);
      }
    };

    // 리스너가 이미 등록되어 있는지 확인
    if (!listenerRegisteredRef.current) {
      console.log('이미지 수신 리스너 등록 완료');
      window.ipcRenderer.on('image-captured', handleImageCaptured);
      listenerRegisteredRef.current = true;
    } else {
      console.log('이미지 수신 리스너가 이미 등록되어 있습니다.');
    }

    // // 컴포넌트 언마운트 시 리스너 제거
    // return () => {
    //   console.log("이미지 수신 리스너 제거");
    //   window.ipcRenderer.off("image-captured", handleImageCaptured);
    //   listenerRegisteredRef.current = false;
    // };
  }, []);

  return (
    <div className='flex size-full flex-col items-center justify-center gap-20'>
      <h1 className='text-4xl font-bold'>촬영중...</h1>
      <div className='grid w-4/5 grid-cols-3 gap-2'>
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            className={`my-2 flex aspect-[3/2] w-full items-center justify-center`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <img
              src={photo}
              alt={`Captured ${index}`}
              className='size-full rounded-md object-contain'
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
