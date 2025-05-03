import { useState } from 'react';

export const LiveView = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = async () => {
    setIsCapturing(true);

    try {
      const sources = await window.ipcRenderer.captureScreen();

      if (sources && sources.length > 0) {
        const source = sources[0];
        const fullScreenImageUrl = source.thumbnail.toDataURL();

        // 캡처한 이미지를 메인 창으로 전송
        window.ipcRenderer.send('image-captured', fullScreenImageUrl);
        console.log('이미지 전송 완료');
      }
    } catch (err) {
      console.error('화면 캡쳐 중 오류 발생:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      {/* 드래그 가능한 영역 */}
      <div className='draggable absolute top-0 left-0 h-10 w-full' />

      <button
        className='absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white'
        onClick={() => window.close()}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        ✕
      </button>

      <button
        className={`absolute right-20 bottom-50 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white ${isCapturing ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={captureScreen}
        disabled={isCapturing}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {isCapturing ? '...' : '촬영'}
      </button>

      <p className='absolute right-20 bottom-20 text-6xl text-white'>1/2</p>
    </div>
  );
};
