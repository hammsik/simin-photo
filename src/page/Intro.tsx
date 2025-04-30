import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const CircleGenerator = () => {
//   const [circleList, setCircleList] = useState<number[]>([]);
//   const [screenWidth, setScreenWidth] = useState<number>(0);

//   useEffect(() => {
//     const handleResize = () => {
//       setScreenWidth(window.innerWidth);
//     };

//     handleResize(); // 초기 화면 크기 설정
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCircleList((prev) => {
//         const newList = [...prev, (prev[prev.length - 1] ?? 0) + 1];
//         if (newList.length > 20) {
//           return newList.slice(-20); // 가장 최근 20개만 유지
//         }
//         return newList;
//       });
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className={`w-full bg-black h-24 relative`}>
//       {circleList.map((circle) => (
//         <motion.div
//           className="absolute top-1/2 -translate-y-1/2 -right-8 rounded-xl bg-[#ECEAE9] h-12 w-10"
//           key={circle}
//           animate={{ opacity: 1, x: -(screenWidth + 100) }}
//           transition={{ duration: 8, ease: "linear" }}
//         />
//       ))}
//     </div>
//   );
// };

export const Intro = () => {
  const openCameraWindow = () => {
    // Electron의 ipcRenderer를 통해 메인 프로세스에 새 창 요청
    window.ipcRenderer.send("open-camera-window");
  };

  const navigate = useNavigate();

  return (
    <div className="size-full justify-center items-center flex flex-col">
      {/* <CircleGenerator /> */}
      <div className="flex flex-col justify-center items-center gap-6 w-full">
        <h1 className="font-play text-8xl font-stretch-50% text-[#B89A51] font-semibold">
          Simin Photo Booth
        </h1>
        <p className="font-extralight text-2xl text-[#b39344] mb-12">
          시민의교회 청년부 포토부스에 오신 것을 환영합니다
        </p>
        <button onClick={() => openCameraWindow()}>창 띄우기</button>
        <motion.button
          whileHover={{ scale: 1.2 }}
          className="cursor-pointer"
          // onClick={openCameraWindow}
          onClick={() => navigate("/shot")}
        >
          <img src="/camera.png" alt="Camera" className="w-24 h-24" />
        </motion.button>
      </div>
      {/* <CircleGenerator /> */}
    </div>
  );
};
