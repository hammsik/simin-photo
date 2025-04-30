import { useState } from "react";

export const LiveView = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = async () => {
    setIsCapturing(true);

    try {
      const sources = await window.ipcRenderer.captureScreen();

      if (sources && sources.length > 0) {
        const source = sources[0];
        const fullScreenImageUrl = source.thumbnail.toDataURL();

        // 캡처한 이미지를 메인 창으로 전송
        window.ipcRenderer.send("image-captured", fullScreenImageUrl);
        console.log("이미지 전송 완료");
      }
    } catch (err) {
      console.error("화면 캡쳐 중 오류 발생:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      {/* 드래그 가능한 영역 */}
      <div className="absolute top-0 left-0 w-full h-10 draggable" />

      <button
        className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
        onClick={() => window.close()}
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        ✕
      </button>

      <button
        className={`absolute bottom-50 right-20 bg-black text-white rounded-full w-16 h-16 flex items-center justify-center
                  ${isCapturing ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={captureScreen}
        disabled={isCapturing}
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        {isCapturing ? "..." : "촬영"}
      </button>

      <p className="absolute bottom-20 text-6xl right-20 text-white">1/2</p>
    </div>
  );
};
