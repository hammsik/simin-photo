import { useNavigate } from 'react-router-dom';

export const Complete = () => {
  const navigate = useNavigate();

  return (
    <div className='flex size-full flex-col items-center justify-center gap-10'>
      <h1 className='text-4xl font-bold'>촬영이 완료되었습니다!</h1>
      <button onClick={() => navigate('/during-shot')}>돌아가기</button>
    </div>
  );
};
