import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import SideMenu from "@/components/common/SideMenu.jsx";
import SuggestedFriends from "./SuggestedFriends";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content layout */}
      <div className="pt-16 pb-6">
        <div className="max-w-screen-xl mx-auto px-4 mt-6">
          <div className="flex gap-8">
            {/* Left column - Sidemenu */}
            <div className="w-80 hidden md:block">
              <div className="sticky top-20">
                <SideMenu />
              </div>
            </div>

            {/* Center column - Main content */}
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>

            {/* Right column - Suggested friends */}
            <div className="w-80 hidden lg:block">
              <div className="sticky top-20">
                <SuggestedFriends />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
