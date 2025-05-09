import { useEffect, useState, useCallback } from 'react';
import { cropImage } from '../utils/imageUtils';
import { motion } from 'motion/react';

export const LiveView = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [shutterReleaseCnt, setShutterReleaseCnt] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // captureScreen 함수를 useCallback으로 메모이제이션
  const captureScreen = useCallback(async () => {
    // 이미 촬영 중이거나 6장 이상 촬영했으면 무시
    if (isCapturing || photoUrls.length >= 6) return;

    setIsCapturing(true);

    try {
      const sources = await window.ipcRenderer.captureScreen();
      setShutterReleaseCnt((prev) => prev + 1);

      if (sources && sources.length > 0) {
        const source = sources[0];
        const fullScreenImageUrl = source.thumbnail.toDataURL();
        const croppedImageUrl = await cropImage(fullScreenImageUrl);

        // 촬영한 이미지를 배열에 저장
        setPhotoUrls((prev) => [...prev, croppedImageUrl]);

        // 캡처한 이미지를 메인 창으로 전송
        window.ipcRenderer.send('live-image-captured', croppedImageUrl);
        console.log('이미지 전송 완료');
      }
    } catch (err) {
      alert(`화면 캡쳐 및 크롭 중 오류 발생했습니다: ${err}`);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, photoUrls.length]);

  // 스페이스바 이벤트 리스너 추가
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 스페이스바(keyCode: 32) 누르면 촬영
      if (e.code === 'ArrowLeft') {
        e.preventDefault(); // 기본 스크롤 동작 방지
        captureScreen();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [captureScreen]);

  // 6장 촬영 완료 시 완료 상태로 전환
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
            className='bg-primary flex size-full flex-col items-center justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className='flex flex-col items-center justify-center gap-16'>
              <div className='flex w-3/4 gap-10'>
                {photoUrls.map((photoUrl, index) => (
                  <motion.div
                    key={index}
                    className={`my-2 flex aspect-[3/2] w-full items-center justify-center`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <img
                      src={photoUrl}
                      alt={`Captured ${index}`}
                      className='size-full rounded-md object-contain'
                    />
                  </motion.div>
                ))}
              </div>
              <motion.h1
                className='text-5xl font-bold'
                transition={{ delay: 0.4 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                촬영이 완료되었습니다!
              </motion.h1>
              <motion.h2
                className='text-3xl font-medium'
                transition={{ delay: 0.6 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                옆에서 사진과 프레임을 선택하고 인쇄해주세요!
              </motion.h2>
            </div>
          </motion.div>
        : <>
            <div className='relative size-full'>
              {photoUrls.length > 0 && (
                <>
                  <motion.div
                    key={shutterReleaseCnt}
                    className='absolute top-0 w-full bg-black'
                    initial={{ height: 0 }}
                    animate={{ height: [0, '50%', '50%', 0] }}
                    transition={{ ease: 'linear', times: [0, 0.2, 0.8, 1] }}
                  />
                  <motion.div
                    key={shutterReleaseCnt}
                    className='absolute bottom-0 w-full bg-black'
                    initial={{ height: 0 }}
                    animate={{ height: [0, '50%', '50%', 0] }}
                    transition={{ ease: 'linear', times: [0, 0.2, 0.8, 1] }}
                  />
                </>
              )}
            </div>
            <div className='bg-primary flex h-full w-[516px] flex-col items-center px-2 py-10'>
              <div className='flex size-full flex-col items-center justify-center'>
                {photoUrls.map((photoUrl, index) => (
                  <motion.div
                    key={index}
                    className={`my-2 flex aspect-[3/2] w-3/5 items-center justify-center`}
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
