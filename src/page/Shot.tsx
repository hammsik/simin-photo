import { useState, useEffect, useRef } from "react";

export const Shot = () => {
  // 촬영한 사진을 저장할 배열
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 리스너가 이미 등록되었는지 추적하는 ref
  const listenerRegisteredRef = useRef(false);

  console.log(window.screen.height);
  // 크롭할 영역을 정의 (예: 중앙에서 500x500 크기)
  const cropConfig = {
    x: 0, // 이미지 왼쪽에서 시작 위치 (픽셀)
    y: 65, // 이미지 상단에서 시작 위치 (픽셀)
    height: 1000, // 크롭할 높이 (픽셀)
    width: (1000 * 3) / 2, // 크롭할 너비 (픽셀)
  };

  // 이미지 크롭 함수
  const cropImage = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // 캔버스 생성
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context를 가져올 수 없습니다."));
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
            cropHeight // 캔버스에 그릴 영역
          );

          // 캔버스를 이미지 URL로 변환
          const croppedImageUrl = canvas.toDataURL("image/jpeg", 0.9);
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

  useEffect(() => {
    console.log("이미지 수신 리스너 등록 시도");

    // 이벤트 핸들러 함수 정의
    const handleImageCaptured = async (_event: any, imageUrl: string) => {
      console.log("이미지 수신됨!");
      try {
        setIsCapturing(true);
        // 이미지 자동 크롭
        const croppedImageUrl = await cropImage(imageUrl);
        // 크롭된 이미지를 photos에 추가
        setPhotos((prevPhotos) => [...prevPhotos, croppedImageUrl]);
      } catch (err) {
        console.error("이미지 크롭 중 오류 발생:", err);
        setError("이미지를 크롭하는 동안 오류가 발생했습니다.");
      } finally {
        setIsCapturing(false);
      }
    };

    // 리스너가 이미 등록되어 있는지 확인
    if (!listenerRegisteredRef.current) {
      console.log("이미지 수신 리스너 등록 완료");
      window.ipcRenderer.on("image-captured", handleImageCaptured);
      listenerRegisteredRef.current = true;
    } else {
      console.log("이미지 수신 리스너가 이미 등록되어 있습니다.");
    }

    // // 컴포넌트 언마운트 시 리스너 제거
    // return () => {
    //   console.log("이미지 수신 리스너 제거");
    //   window.ipcRenderer.off("image-captured", handleImageCaptured);
    //   listenerRegisteredRef.current = false;
    // };
  }, []);

  const openCameraWindow = () => {
    window.ipcRenderer.send("open-camera-window");
  };

  return (
    <div className="size-full justify-between items-center flex flex-col">
      <div className="w-full flex flex-wrap max-h-[300px] overflow-y-auto p-2">
        {error && (
          <div className="w-full bg-red-100 text-red-700 p-2 mb-2 rounded">
            오류: {error}
          </div>
        )}

        {photos.length === 0 ? (
          <p className="text-gray-400 w-full text-center p-4">
            촬영된 사진이 없습니다
          </p>
        ) : (
          photos.map((photo, index) => (
            <div key={index} className="w-100">
              <img
                src={photo}
                alt={`촬영한 사진 ${index + 1}`}
                className="w-full object-cover border border-gray-200 rounded"
              />
            </div>
          ))
        )}
      </div>

      <button
        className="size-20 bg-black text-white rounded-md hover:bg-gray-800 mb-4"
        onClick={openCameraWindow}
        disabled={isCapturing}
      >
        {isCapturing ? "처리 중..." : "카메라 열기"}
      </button>
    </div>
  );
};
