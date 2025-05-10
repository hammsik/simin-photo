import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import { PhotoGrid } from '../components/aftershot/PhotoGrid';
import { FrameSelector } from '../components/aftershot/FrameSelector';
import { ExportButtons } from '../components/aftershot/ExportButtons';
import { PhotoPreview } from '../components/aftershot/PhotoPreview';

const customFrameUrls = ['/frames/custom-1.png', '/frames/custom-2.png'];
const solidFrameUrls = [
  '/frames/black.png',
  '/frames/gray.png',
  '/frames/blue.png',
  '/frames/pink.png',
];

export const AfterShot = () => {
  const photos: string[] = useLocation().state?.photos; // 촬영한 사진들
  const photoName: string = useLocation().state?.photoName; // 파일 이름

  const [selectedPhotos, setSelectedPhotos] = useState<Array<string | null>>(
    Array(4).fill(null),
  );
  const [selectedFrame, setSelectedFrame] =
    useState<string>('/frames/black.png');
  const [saving, setSaving] = useState(false);
  const [clickedCnt, setClickedCnt] = useState(0);

  const photoRef = useRef<HTMLDivElement>(null);
  const pngExportRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: photoRef,
    documentTitle: `시민포토_${photoName ? photoName : '없음'}`,
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
      link.download = `시민포토_${photoName ? photoName : '없음'}.png`;
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

    setClickedCnt((prev) => prev + 1);

    if (type === 'pdf') {
      reactToPrintFn();
    } else {
      saveAsPNG();
    }
  };

  const selectedPhotosCount = selectedPhotos.filter((p) => p !== null).length;

  return (
    <div className='relative flex size-full items-center gap-24 p-8'>
      <div className='flex h-full w-[55%] flex-col'>
        <h2 className='mb-4 text-2xl font-bold'>사진 선택</h2>
        <PhotoGrid
          photos={photos}
          selectedPhotos={selectedPhotos}
          setSelectedPhotos={setSelectedPhotos}
        />

        <h2 className='mt-8 mb-4 text-2xl font-bold'>프레임 선택</h2>
        <FrameSelector
          customFrameUrls={customFrameUrls}
          solidFrameUrls={solidFrameUrls}
          setSelectedFrame={setSelectedFrame}
        />
      </div>

      <div className='flex h-full flex-col'>
        <h2 className='mb-4 text-2xl font-bold'>미리보기</h2>
        <div className='flex h-full flex-col justify-center rounded-2xl bg-black/8 p-8'>
          <PhotoPreview
            selectedFrame={selectedFrame}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
            photoRef={photoRef}
            pngExportRef={pngExportRef}
          />
        </div>
      </div>
      <ExportButtons
        handlePhotoPrint={handlePhotoPrint}
        clickedCnt={clickedCnt}
        selectedPhotosCount={selectedPhotosCount}
      />
    </div>
  );
};
