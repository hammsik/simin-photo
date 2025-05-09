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
  );
};
