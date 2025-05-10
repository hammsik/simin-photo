import { motion } from 'motion/react';

type PhotoGridProps = {
  photos: string[];
  selectedPhotos: Array<string | null>;
  setSelectedPhotos: React.Dispatch<React.SetStateAction<Array<string | null>>>;
};

export const PhotoGrid = ({
  photos,
  selectedPhotos,
  setSelectedPhotos,
}: PhotoGridProps) => {
  return (
    <div className='flex flex-col gap-4 rounded-2xl bg-black/8 p-8'>
      <div className='grid w-full grid-cols-3 items-center justify-center gap-10'>
        {photos.map((photo, index) => (
          <motion.button
            whileHover={{ y: selectedPhotos.includes(photo) ? 0 : -10 }}
            key={index}
            className='relative cursor-pointer drop-shadow-xl disabled:cursor-not-allowed disabled:opacity-30'
            disabled={selectedPhotos.includes(photo)}
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
              className='w-full rounded-md object-cover'
            />
            <div className='absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-md rounded-tr-none rounded-bl-none bg-white'>
              <p>{index + 1}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
