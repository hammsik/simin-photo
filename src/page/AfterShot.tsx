import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhotoFrame } from '../components/PhotoFrame';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';

const customFrameUrls = ['/frames/custom-1.png', '/frames/custom-2.png'];
const solidFrameUrls = [
  '/frames/black.png',
  '/frames/gray.png',
  '/frames/blue.png',
  '/frames/pink.png',
];

export const AfterShot = () => {
  const navigate = useNavigate();
  const photos: string[] = useLocation().state?.photos; // 촬영한 사진들

  const [selectedPhotos, setSelectedPhotos] = useState<Array<string | null>>(
    Array(4).fill(null),
  );
  const [selectedFrame, setSelectedFrame] =
    useState<string>('/frames/black.png');
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  // 상단에 Dialog 관련 상태 추가
  const [showDialog, setShowDialog] = useState<'pdf' | 'png' | null>(null);

  const photoRef = useRef<HTMLDivElement>(null);
  const pngExportRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: photoRef,
    documentTitle: `시민포토_${fileName}`,
    pageStyle: `@page {
      size: 100mm 148mm; /* A4 용지 크기 설정 */
      margin: 0;
    }
    @media print {
      html, body {
        width: 100mm;
        height: 148mm;
        margin: 0;
        padding: 0;
      }
      .print-container {
        width: 100mm;
        height: 148mm;
        display: flex;
        page-break-after: avoid;
        page-break-before: avoid;
      }
      .full-page-image {
        width: 50%;
        height: 100%;
        position: relative;
        max-width: 100mm; 
        max-height: 148mm;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }`,
  });

  const saveAsPNG = async () => {
    if (!pngExportRef.current || saving) return;

    try {
      setSaving(true);

      // html2canvas 설정
      const canvas = await html2canvas(pngExportRef.current, {
        scale: 5,
        useCORS: true, // 외부 이미지 허용
        allowTaint: true,
      });

      // 이미지 데이터 생성
      const imageData = canvas.toDataURL('image/png');

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `시민포토_${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('이미지 저장 에러:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoPrint = (type: 'pdf' | 'png') => {
    if (selectedPhotos.filter((p) => p !== null).length < 4) {
      alert('먼저 사진 4장을 선택해주세요.');
      return;
    }

    setShowDialog(type);
  };

  // 파일명 입력 후 처리하는 함수 추가
  const handleFileNameSubmit = (type: 'pdf' | 'png') => {
    // 파일명이 비어있으면 현재 날짜로 설정
    if (!fileName) {
      alert('파일명을 입력하세요.');
      return;
    }

    // 다이얼로그 닫기
    setShowDialog(null);

    if (type === 'pdf') {
      reactToPrintFn();
    } else if (type === 'png') {
      saveAsPNG();
    }
  };

  return (
    <div className='relative flex size-full items-center justify-between'>
      <div className='flex h-full w-2/3 flex-col gap-12 p-12'>
        <div className='grid w-full grid-cols-3 items-center justify-center gap-10'>
          {photos.map((photo, index) => (
            <motion.button
              whileHover={{ y: -10 }}
              key={index}
              className={`cursor-pointer drop-shadow-xl ${
                selectedPhotos.includes(photo) && 'opacity-30'
              }`}
              onClick={() => {
                if (!selectedPhotos.includes(photo)) {
                  if (selectedPhotos.filter((p) => p !== null).length >= 4) {
                    alert('최대 4장까지 선택할 수 있습니다.');
                    return;
                  }
                  setSelectedPhotos((prev) => {
                    const newPhotos = [...prev];
                    for (let i = 0; i < newPhotos.length; i++) {
                      if (newPhotos[i] === null) {
                        newPhotos[i] = photo;
                        break;
                      }
                    }
                    return newPhotos;
                  });
                }
              }}
            >
              <img
                src={photo}
                alt={`촬영한 사진 ${index + 1}`}
                className='w-full object-cover'
              />
            </motion.button>
          ))}
        </div>
        <div className='flex size-full gap-30'>
          <div className='flex h-full flex-col gap-4'>
            <h3 className='text-2xl font-bold'>커스텀 프레임</h3>
            <div className='flex h-full gap-10'>
              {customFrameUrls.map((url, index) => (
                <img
                  src={url}
                  key={index}
                  onClick={() => setSelectedFrame(url)}
                  className='h-80 cursor-pointer object-contain transition hover:scale-95'
                />
              ))}
            </div>
          </div>
          <div className='flex h-full flex-col gap-4'>
            <h3 className='text-2xl font-bold'>단색 프레임</h3>
            <div className='flex h-full gap-10'>
              {solidFrameUrls.map((url, index) => (
                <img
                  src={url}
                  key={index}
                  onClick={() => setSelectedFrame(url)}
                  className='h-80 cursor-pointer object-contain transition hover:scale-95'
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='flex h-full flex-col items-center justify-center gap-6 p-6 pr-20'>
        {/* 화면에 보이는 프레임 */}
        <div className='print-container'>
          <PhotoFrame
            selectedFrame={selectedFrame}
            imageUrls={selectedPhotos}
            setImageUrls={setSelectedPhotos}
          />
        </div>

        {/* 인쇄용 프레임 (화면에는 숨기고 인쇄 시에만 표시) */}
        <div
          ref={photoRef}
          className='print-container hidden print:block'
          style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}
        >
          <PhotoFrame
            selectedFrame={selectedFrame}
            imageUrls={selectedPhotos}
            setImageUrls={setSelectedPhotos}
          />
          <PhotoFrame
            selectedFrame={selectedFrame}
            imageUrls={selectedPhotos}
            setImageUrls={setSelectedPhotos}
          />
        </div>

        <div ref={pngExportRef} className='fixed -right-300 flex'>
          <PhotoFrame
            selectedFrame={selectedFrame}
            imageUrls={selectedPhotos}
            setImageUrls={setSelectedPhotos}
          />
          <PhotoFrame
            selectedFrame={selectedFrame}
            imageUrls={selectedPhotos}
            setImageUrls={setSelectedPhotos}
          />
        </div>

        <div className='flex gap-4'>
          <button
            className={`flex cursor-pointer items-center justify-center rounded p-4 ${
              selectedPhotos.length === 0 ?
                'cursor-not-allowed bg-gray-300'
              : 'bg-rose-400 hover:bg-rose-500'
            } text-white`}
            onClick={() => handlePhotoPrint('pdf')}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mr-2 h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              />
            </svg>
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
            PDF
          </button>
          <button
            className={`flex cursor-pointer items-center justify-center rounded p-4 ${
              selectedPhotos.length === 0 ?
                'cursor-not-allowed bg-gray-300'
              : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            onClick={() => handlePhotoPrint('png')}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mr-2 h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              />
            </svg>
            PNG
          </button>

          <button
            className={`flex cursor-pointer items-center justify-center rounded p-4 ${
              selectedPhotos.length === 0 ?
                'cursor-not-allowed bg-gray-300'
              : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            onClick={() => navigate('/complete')}
          >
            완료
          </button>
        </div>
        {/* 파일명 입력 다이얼로그 */}
        {showDialog && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
              <h3 className='mb-4 text-xl font-bold'>파일 이름 입력</h3>
              {/* esc 누르면 모달제거 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFileNameSubmit(showDialog);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowDialog(null);
                  }
                }}
              >
                <input
                  type='text'
                  className='mb-4 w-full rounded border border-gray-300 p-2'
                  placeholder='파일명을 입력하세요'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  autoFocus
                />
                <div className='flex justify-end gap-2'>
                  <button
                    type='button'
                    className='rounded bg-gray-300 px-4 py-2 hover:bg-gray-400'
                    onClick={() => setShowDialog(null)}
                  >
                    취소
                  </button>
                  <button
                    type='submit'
                    className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                  >
                    확인
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
