// 이미지 크롭 함수
export const cropImage = (imageUrl: string): Promise<string> => {
  const cropConfig = {
    x: 0, // 이미지 왼쪽에서 시작 위치 (픽셀)
    y: 65, // 이미지 상단에서 시작 위치 (픽셀)
    height: 1022, // 크롭할 높이 (픽셀)
    width: (1022 * 3) / 2, // 크롭할 너비 (픽셀)
  };

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // 캔버스 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context를 가져올 수 없습니다.'));
          return;
        }

        // 크롭 영역이 이미지 범위를 벗어나는지 확인
        const cropX = Math.min(cropConfig.x, img.width - 10);
        const cropY = Math.min(cropConfig.y, img.height - 10);
        const cropWidth = Math.min(cropConfig.width, img.width - cropX);
        const cropHeight = Math.min(cropConfig.height, img.height - cropY);

        // 캔버스 크기 설정
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // 이미지 크롭하여 캔버스에 그리기
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight, // 소스 이미지의 영역
          0,
          0,
          cropWidth,
          cropHeight, // 캔버스에 그릴 영역
        );

        // 캔버스를 이미지 URL로 변환
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 1);
        resolve(croppedImageUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (error) => {
      reject(error);
    };

    // 이미지 로드 시작
    img.src = imageUrl;
  });
};
