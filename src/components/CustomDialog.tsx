import { motion } from 'motion/react';
import { useState } from 'react';

type CustomDialogProps = {
  submit: (photoName: string) => void;
  cancel: () => void;
};

export const CustomDialog = ({ submit, cancel }: CustomDialogProps) => {
  const [photoName, setPhotoName] = useState('');

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
        <h3 className='mb-4 text-xl font-bold'>사진 제목 입력</h3>
        {/* esc 누르면 모달제거 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(photoName);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              cancel();
            }
          }}
        >
          <input
            type='text'
            className='mb-4 w-full rounded border border-gray-300 p-2'
            placeholder='사진 제목을 입력하세요'
            value={photoName}
            onChange={(e) => setPhotoName(e.target.value)}
            autoFocus
          />
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              className='rounded bg-gray-300 px-4 py-2 hover:bg-gray-400'
              onClick={cancel}
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
  );
};
