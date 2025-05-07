import { Dispatch, ForwardedRef, forwardRef, SetStateAction } from 'react';

type PhotoFrameProps = {
  imageUrls: Array<string | null>; // ref prop 제거
  selectedFrame: string;
  setImageUrls: Dispatch<SetStateAction<Array<string | null>>>;
};

export const PhotoFrame = forwardRef(
  (
    { imageUrls, selectedFrame, setImageUrls }: PhotoFrameProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    // 하나의 프레임 컴포넌트 (재사용)
    const SingleFrame = () => (
      <div className='full-page-image relative flex size-full flex-col'>
        <img
          src={selectedFrame}
          className='pointer-events-none z-20 h-[900px] object-contain print:h-full print:w-full'
        />
        {imageUrls.length > 0 &&
          imageUrls.map((url, index) =>
            url ?
              <img
                key={index}
                src={url}
                // 중간에 오도록
                className={`absolute left-1/2 z-10 h-[17.74%] -translate-x-1/2 transition hover:opacity-50`}
                // 높이의 일정 비율 만큼 띄우기
                style={{
                  top: `${index * 19.7 + 3.4}%`,
                }}
                onClick={() =>
                  setImageUrls((prev) =>
                    prev.map((item, i) => (i === index ? null : item)),
                  )
                } // 클릭 시 삭제
              />
            : null,
          )}
      </div>
    );

    return (
      <>
        {/* 화면에 보이는 프레임 */}
        <div className='print-container'>
          <SingleFrame />
        </div>

        {/* 인쇄용 프레임 (화면에는 숨기고 인쇄 시에만 표시) */}
        <div
          ref={ref}
          className='print-container hidden print:block'
          style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}
        >
          <SingleFrame />
          <SingleFrame />
        </div>
      </>
    );
  },
);
