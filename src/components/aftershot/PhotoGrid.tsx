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
    <div className='grid w-full grid-cols-3 items-center justify-center gap-10'>
      {photos.map((photo, index) => (
        <motion.button
          whileHover={{ y: -10 }}
          key={index}
          className={`cursor-pointer drop-shadow-xl ${
            selectedPhotos.includes(photo) && 'opacity-30'
          }`}
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
            className='w-full object-cover'
          />
        </motion.button>
      ))}
    </div>
  );
};
