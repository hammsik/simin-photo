export const LiveView = () => {
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
      <p className="absolute bottom-10 text-6xl right-10 text-white">1/2</p>
    </div>
  );
};
