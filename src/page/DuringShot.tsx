import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';

// TODO: 3 2 1 카운트다운 애니메이션 추가
// TODO: DuringShot에서 마우스 클릭 감지하도록

export const DuringShot = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  const navigate = useNavigate();
  const photoName: string = useLocation().state?.photoName; // 파일 이름

  useEffect(() => {
    const handleImageCaptured = (_event: unknown, imageUrl: string) => {
      console.log('에엣 핸들러 호출');
      try {
        setPhotos((prevPhotos) => [...prevPhotos, imageUrl]);
      } catch (err) {
        alert(`이미지 수신 중 오류 발생: ${err}`);
      }
    };

    console.log('이벤트 리스너 등록', handleImageCaptured);
    window.ipcRenderer.on('main-image-received', handleImageCaptured);

    // // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      console.log('컴포넌트 언마운트 - 이벤트 리스너 제거');
      window.ipcRenderer.removeAllListeners('main-image-received');
    };
  }, []); // 의존성 배열 비움

  // 사진 촬영 함수
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 스페이스바(keyCode: 32) 누르면 촬영
      if (e.code === 'ArrowLeft') {
        e.preventDefault(); // 기본 스크롤 동작 방지
        window.ipcRenderer.send('shutter-release');
        console.log('눌렸다');
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 편집하기 버튼 클릭 핸들러
  const handleEditClick = () => {
    // LiveView 새로고침을 위한 이벤트 전송
    window.ipcRenderer.send('refresh-live-view');
    // 편집 페이지로 이동
    navigate('/after-shot', { state: { photos, photoName } });
  };

  return (
    <div className='flex size-full flex-col items-center justify-center gap-20'>
      {photos.length < 6 && (
        <motion.h1
          className='text-4xl font-bold'
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        >
          촬영중...
        </motion.h1>
      )}
      <div className='grid w-4/5 grid-cols-3 gap-12'>
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
      {photos.length >= 6 && (
        <button
          className='rounded bg-gray-700 px-8 py-4 text-2xl font-bold text-white transition hover:scale-105 hover:bg-gray-800'
          onClick={handleEditClick}
        >
          편집하러 가기
        </button>
      )}
    </div>
  );
};
