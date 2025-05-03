import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

export const Shot = () => {
  // 촬영한 사진을 저장할 배열
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [imageText, setImageText] = useState('');

  // 리스너가 이미 등록되었는지 추적하는 ref
  const listenerRegisteredRef = useRef(false);

  const printPhoto = () => {
    // 선택된 이미지가 없으면 인쇄 불가
    if (selectedPhotos.length === 0) {
      setError('인쇄할 사진을 선택해주세요.');
      return;
    }

    const photoElement = document.getElementById('photo');
    if (!photoElement) {
      setError('인쇄할 요소를 찾을 수 없습니다.');
      return;
    }

    // 현재 페이지에 인쇄용 스타일 추가
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: black !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body * {
          visibility: hidden;
        }
        
        #photo, #photo * {
          visibility: visible;
        }
        
        #photo {
          position: absolute;
          left: 0;
          top: 0;
          width: 100mm;
          margin: 0;
          padding: 10mm;
          box-sizing: border-box;
          background-color: black !important;
        }
        
        img {
          width: 80mm;
          height: auto;
          margin-bottom: 4mm;
        }
        
        @page {
          size: 100mm 150mm;
          margin: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // 인쇄 실행 (미리보기 포함)
    window.print();

    // 인쇄 후 스타일 제거
    setTimeout(() => {
      const printStyle = document.getElementById('print-style');
      if (printStyle) {
        document.head.removeChild(printStyle);
      }
    }, 1000);
  };

  console.log(window.screen.height);

  useEffect(() => {
    console.log('이미지 수신 리스너 등록 시도');

    // 이벤트 핸들러 함수 정의
    const handleImageCaptured = (_event: unknown, imageUrl: string) => {
      try {
        setIsCapturing(true);
        setPhotos((prevPhotos) => [...prevPhotos, imageUrl]);
      } catch (err) {
        console.error('이미지 수신 중 오류 발생:', err);
        setError('이미지를 수신하는 동안 오류가 발생했습니다.');
      } finally {
        setIsCapturing(false);
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
    <div className='relative flex size-full items-center justify-center'>
      {error && (
        <div
          className='absolute top-0 mb-2 w-full rounded bg-red-100 p-2 text-red-700'
          onClick={() => setError(null)}
        >
          오류: {error}
        </div>
      )}
      <div className='h-full flex-1 overflow-y-auto p-2'>
        <div className='grid grid-cols-3 gap-2'>
          {photos.length === 0 ?
            <p className='col-span-3 p-4 text-center text-gray-400'>
              촬영된 사진이 없습니다
            </p>
          : photos.map((photo, index) => (
              <motion.button
                whileHover={{ scale: 1.2 }}
                key={index}
                className={`cursor-pointer ${
                  selectedPhotos.includes(photo) && 'opacity-50'
                }`}
                onClick={() => {
                  if (selectedPhotos.includes(photo)) {
                    setError('이미 선택된 사진입니다.');
                  } else {
                    setSelectedPhotos((prev) => [...prev, photo]);
                  }
                }}
              >
                <img
                  src={photo}
                  alt={`촬영한 사진 ${index + 1}`}
                  className='w-full object-cover'
                />
              </motion.button>
            ))
          }
        </div>
      </div>
      <div className='flex h-full flex-1 flex-col items-center justify-center gap-10'>
        <div
          id='photo'
          className='relative flex h-[900px] w-[300px] flex-col items-center gap-4 bg-black p-6'
        >
          {/* 선택한 사진들 */}
          {selectedPhotos.length === 0 ?
            <p className='p-4 text-center text-gray-400'>
              선택된 사진이 없습니다
            </p>
          : selectedPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`선택한 사진 ${index + 1}`}
                className='w-full object-cover'
                onClick={() => {
                  setSelectedPhotos((prev) =>
                    prev.filter((_, i) => i !== index),
                  );
                }}
              />
            ))
          }
          <h1 className='absolute bottom-10 text-2xl text-white'>
            {imageText}
          </h1>
        </div>

        <div className='mt-6 flex w-[300px] flex-col gap-4'>
          {/* 텍스트 입력 인풋 */}
          <div className='flex gap-2'>
            <input
              type='text'
              className='flex-1 rounded border border-gray-300 bg-slate-50 p-2'
              placeholder='텍스트를 입력하세요'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={() => setImageText(text)}
              className='rounded bg-gray-800 px-4 py-2 text-white'
            >
              확인
            </button>
          </div>

          <button
            className={`flex items-center justify-center rounded p-4 ${
              selectedPhotos.length === 0 ?
                'cursor-not-allowed bg-gray-300'
              : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            onClick={printPhoto}
            disabled={selectedPhotos.length === 0}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mr-2 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
              />
            </svg>
            인쇄하기
          </button>
        </div>
      </div>
    </div>
  );
};
