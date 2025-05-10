type FrameSelectorProps = {
  customFrameUrls: string[];
  solidFrameUrls: string[];
  setSelectedFrame: React.Dispatch<React.SetStateAction<string>>;
};

export const FrameSelector = ({
  customFrameUrls,
  solidFrameUrls,
  setSelectedFrame,
}: FrameSelectorProps) => {
  return (
    <div className='flex size-full gap-10 rounded-2xl bg-black/8 p-8 pb-6'>
      <div className='flex h-full flex-col gap-4'>
        <div className='flex h-full gap-10'>
          {customFrameUrls.map((url, index) => (
            <div className='flex flex-col items-center gap-3' key={index}>
              <img
                src={url}
                onClick={() => setSelectedFrame(url)}
                className='h-72 cursor-pointer object-contain transition hover:scale-95'
              />
              <p className='text-lg'>커스텀 {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='w-px bg-black/20' />
      <div className='flex h-full flex-col gap-4'>
        <div className='flex h-full gap-10'>
          {solidFrameUrls.map((url, index) => (
            <div className='flex flex-col items-center gap-3' key={index}>
              <img
                src={url}
                onClick={() => setSelectedFrame(url)}
                className='h-72 cursor-pointer object-contain transition hover:scale-95'
              />
              <p className='text-lg'>단색 {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
