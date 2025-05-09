import { RefObject } from 'react';
import { PhotoFrame } from '../PhotoFrame';

type PhotoPreviewProps = {
  selectedFrame: string;
  selectedPhotos: Array<string | null>;
  setSelectedPhotos: React.Dispatch<React.SetStateAction<Array<string | null>>>;
  photoRef: RefObject<HTMLDivElement>;
  pngExportRef: RefObject<HTMLDivElement>;
};

export const PhotoPreview = ({
  selectedFrame,
  selectedPhotos,
  setSelectedPhotos,
  photoRef,
  pngExportRef,
}: PhotoPreviewProps) => {
  return (
    <>
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

      {/* PNG 내보내기용 숨겨진 프레임 */}
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
    </>
  );
};
