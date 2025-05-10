import { useNavigate } from 'react-router-dom';

type ExportButtonsProps = {
  handlePhotoPrint: (type: 'pdf' | 'png') => void;
  clickedCnt: number;
  selectedPhotosCount: number;
};

export const ExportButtons = ({
  handlePhotoPrint,
  clickedCnt,
  selectedPhotosCount,
}: ExportButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-12'>
      <button
        className='flex cursor-pointer items-center justify-center rounded bg-rose-500 p-4 text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-black/30'
        onClick={() => handlePhotoPrint('pdf')}
        disabled={selectedPhotosCount < 4}
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
        className='flex cursor-pointer items-center justify-center rounded bg-blue-600 p-4 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-black/30'
        onClick={() => handlePhotoPrint('png')}
        disabled={selectedPhotosCount < 4}
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
        className={`flex cursor-pointer items-center justify-center rounded bg-green-600 p-4 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-black/30`}
        disabled={clickedCnt < 3}
        onClick={() => navigate('/')}
      >
        종료
      </button>
    </div>
  );
};
