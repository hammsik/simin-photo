import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// TODO: 3 2 1 카운트다운 애니메이션 추가
// TODO: 촬영 중 중복 클릭 방지
// TODO: 완료 누르면 첫 페이지로 이동 (새로운 창은 열지 않기)
// TODO: DuringShot에서 마우스 클릭 감지하도록
// TODO: 인쇄버튼 누르면 파일 저장 되도록 (안되면 인쇄창에서라도 png옵션 보이도록)
// TODO: 관리자모드 - 지금까지 찍었던 프레임들 다시 볼 수 있는 뷰

export const DuringShot = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  // 리스너가 이미 등록되었는지 추적하는 ref
  const listenerRegisteredRef = useRef(false);

  const navigate = useNavigate();

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

  // 편집하기 버튼 클릭 핸들러
  const handleEditClick = () => {
    // LiveView 새로고침을 위한 이벤트 전송
    window.ipcRenderer.send('refresh-live-view');
    // 편집 페이지로 이동
    navigate('/after-shot', { state: { photos } });
  };

  return (
    <div className='flex size-full flex-col items-center justify-center gap-20'>
      {photos.length < 6 && <h1 className='text-4xl font-bold'>촬영중...</h1>}
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
