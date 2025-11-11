import { useMemo } from "react";
import Threads from "../background/Threads";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
function MainLayout() {
  const threadsAnimation = useMemo(
    () => <Threads amplitude={1} distance={0} />,
    []
  );

  return (
    <div className="relative h-screen w-full  overflow-hidden bg-gray-100 z-0">
      <div className="absolute inset-0 -z-20">{threadsAnimation}</div>
      <Header />
      <div className="relative flex items-center justify-center h-full w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
