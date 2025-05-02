import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";

export const Shot = () => {
  // 촬영한 사진을 저장할 배열
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [imageText, setImageText] = useState("");

  // 리스너가 이미 등록되었는지 추적하는 ref
  const listenerRegisteredRef = useRef(false);

  const printPhoto = () => {
    // 선택된 이미지가 없으면 인쇄 불가
    if (selectedPhotos.length === 0) {
      setError("인쇄할 사진을 선택해주세요.");
      return;
    }

    const photoElement = document.getElementById("photo");
    if (!photoElement) {
      setError("인쇄할 요소를 찾을 수 없습니다.");
      return;
    }

    // 현재 페이지에 인쇄용 스타일 추가
    const style = document.createElement("style");
    style.id = "print-style";
    style.innerHTML = `
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: black !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body * {
          visibility: hidden;
        }
        
        #photo, #photo * {
          visibility: visible;
        }
        
        #photo {
          position: absolute;
          left: 0;
          top: 0;
          width: 100mm;
          margin: 0;
          padding: 10mm;
          box-sizing: border-box;
          background-color: black !important;
        }
        
        img {
          width: 80mm;
          height: auto;
          margin-bottom: 4mm;
        }
        
        @page {
          size: 100mm 150mm;
          margin: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // 인쇄 실행 (미리보기 포함)
    window.print();

    // 인쇄 후 스타일 제거
    setTimeout(() => {
      const printStyle = document.getElementById("print-style");
      if (printStyle) {
        document.head.removeChild(printStyle);
      }
    }, 1000);
  };

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
    <div className="relative w-screen h-screen flex justify-center items-center bg-linear-to-bl from-[#cbcac8] to-[#ECEAE9]">
      {error && (
        <div
          className="absolute top-0 w-full bg-red-100 text-red-700 p-2 mb-2 rounded"
          onClick={() => setError(null)}
        >
          오류: {error}
        </div>
      )}
      <div className="flex-1 h-full bg-amber-200 overflow-y-auto p-2">
        <div className="grid grid-cols-3 gap-2">
          {photos.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center p-4">
              촬영된 사진이 없습니다
            </p>
          ) : (
            photos.map((photo, index) => (
              <motion.button
                whileHover={{ scale: 1.2 }}
                key={index}
                className={`cursor-pointer ${
                  selectedPhotos.includes(photo) && "opacity-50"
                }`}
                onClick={() => {
                  if (selectedPhotos.includes(photo)) {
                    setError("이미 선택된 사진입니다.");
                  } else {
                    setSelectedPhotos((prev) => [...prev, photo]);
                  }
                }}
              >
                <img
                  src={photo}
                  alt={`촬영한 사진 ${index + 1}`}
                  className="w-full object-cover"
                />
              </motion.button>
            ))
          )}
        </div>
      </div>
      <div className="gap-10 flex-1 h-full bg-cyan-300 flex flex-col justify-center items-center">
        <div
          id="photo"
          className="relative w-[300px] h-[900px] bg-black flex flex-col items-center p-6 gap-4"
        >
          {/* 선택한 사진들 */}
          {selectedPhotos.length === 0 ? (
            <p className="text-gray-400 text-center p-4">
              선택된 사진이 없습니다
            </p>
          ) : (
            selectedPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`선택한 사진 ${index + 1}`}
                className="w-full object-cover"
                onClick={() => {
                  setSelectedPhotos((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              />
            ))
          )}
          <h1 className="absolute bottom-10 text-white text-2xl">
            {imageText}
          </h1>
        </div>

        <div className="flex flex-col gap-4 mt-6 w-[300px]">
          {/* 텍스트 입력 인풋 */}
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 rounded border border-gray-300 bg-slate-50"
              placeholder="텍스트를 입력하세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={() => setImageText(text)}
              className="px-4 py-2 bg-gray-800 text-white rounded"
            >
              확인
            </button>
          </div>

          <button
            className={`flex items-center justify-center p-4 rounded ${
              selectedPhotos.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={printPhoto}
            disabled={selectedPhotos.length === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            인쇄하기
          </button>
        </div>
      </div>
    </div>
  );
};
