import { useState } from "react";

export const Shot = () => {
  // 촬영한 사진을 저장할 배열
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureScreen = async () => {
    setIsCapturing(true);
    setError(null);

    try {
      // preload에서 노출된 captureScreen 메서드 사용
      const sources = await window.ipcRenderer.captureScreen();

      if (sources && sources.length > 0) {
        // 첫 번째 스크린 소스 사용 (메인 디스플레이)
        console.log(sources);
        const source = sources[0];

        // 이미지 데이터 URL을 직접 사용 (크롭 없이)
        const fullScreenImageUrl = source.thumbnail.toDataURL();

        // 새 사진을 photos 배열에 추가
        setPhotos((prevPhotos) => [...prevPhotos, fullScreenImageUrl]);

        console.log("전체 화면 캡쳐 성공!");
      } else {
        throw new Error("사용 가능한 화면 소스가 없습니다.");
      }
    } catch (err) {
      console.error("화면 캡쳐 중 오류 발생:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsCapturing(false);
    }
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
            <div key={index} className="w-1/3 p-2">
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
        className={`size-20 bg-black text-white rounded-md hover:bg-gray-800 mb-4 
                   ${isCapturing ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={captureScreen}
        disabled={isCapturing}
      >
        {isCapturing ? "촬영중..." : "촬영"}
      </button>
    </div>
  );
};
