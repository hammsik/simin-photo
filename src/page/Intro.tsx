import { motion } from "motion/react";
import { use } from "motion/react-client";
import { useEffect, useMemo, useState } from "react";

type CircleGeneratorProps = {
  direction: "left" | "right";
};

const CircleGenerator = ({ direction }: CircleGeneratorProps) => {
  const [circleList, setCircleList] = useState<number[]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize(); // 초기 화면 크기 설정
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCircleList((prev) => {
        // 최대 3개의 원만 유지
        const newList = [...prev, (prev[prev.length - 1] ?? 0) + 1];
        if (newList.length > 20) {
          return newList.slice(-20); // 가장 최근 3개만 유지
        }
        return newList;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [direction]); // direction이 변경될 때만 effect 재실행

  return (
    <div className={`w-full bg-black h-18 relative`}>
      {circleList.map((circle) => (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -right-8 rounded-xl bg-[#ECEAE9] h-10 w-8"
          key={circle}
          animate={{ opacity: 1, x: -(screenWidth + 100) }}
          transition={{ duration: 8, ease: "linear" }}
        />
      ))}
    </div>
  );
};

export const Intro = () => {
  return (
    <div className="size-full justify-between items-center flex flex-col">
      <CircleGenerator direction="left" />
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <h1 className="font-play text-6xl font-stretch-50% text-[#B89A51] font-semibold">
          Simin Photo Booth
        </h1>
        <p className="font-extralight text-[#B89A51] mb-8">
          시민의교회 청년부 포토부스에 오신 것을 환영합니다
        </p>
      </div>
      <CircleGenerator direction="right" />
    </div>
  );
};
