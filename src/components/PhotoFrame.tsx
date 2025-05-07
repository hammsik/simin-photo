import { Dispatch, ForwardedRef, forwardRef, SetStateAction } from 'react';

type PhotoFrameProps = {
  ref?: React.RefObject<HTMLDivElement>;
  imageUrls: Array<string | null>;
  selectedFrame: string;
  setImageUrls: Dispatch<SetStateAction<Array<string | null>>>;
};

export const PhotoFrame = forwardRef(
  (
    { imageUrls, selectedFrame, setImageUrls }: PhotoFrameProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div className='relative flex size-full flex-col' ref={ref}>
        <img
          src={selectedFrame}
          className='pointer-events-none z-20 h-[900px] object-contain'
        />
        {imageUrls.length > 0 &&
          imageUrls.map((url, index) =>
            url ?
              <img
                key={index}
                src={url}
                // 중간에 오도록
                className={`absolute left-1/2 z-10 h-[161px] -translate-x-1/2 transition hover:opacity-50`}
                style={{ top: `${index * 177 + 31}px` }}
                onClick={() =>
                  setImageUrls((prev) =>
                    prev.map((item, i) => (i === index ? null : item)),
                  )
                } // 클릭 시 삭제
              />
            : <div></div>,
          )}
      </div>
    );
  },
);
