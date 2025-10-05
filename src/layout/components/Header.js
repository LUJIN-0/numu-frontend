import { Search, Sun, Menu } from "lucide-react"; 
import Image from "next/image"; 

export default function Header({ onToggleSidebar }) {
  // onToggleSidebar: passed from Layout.js to expand/collapse sidebar

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      {/* Left side: Toggle + Logo + Search */}
      <div className="flex items-center gap-4 w-1/2">
        
        {/* Hamburger button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded text-gray-600"
        >
          <Menu size={22} />
        </button>

        {/*  Vertical divider */}
        <div className="w-px h-9 bg-gray-300"></div>

        {/* Logo */}
        <div className="flex items-center gap-2 pl-1">
          <Image src="/logo.png" alt="NUMU Logo" width={75} height={28} />
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-md mx-5">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-1.5 bg-gray-100 focus:outline-none rounded-lg 
            placeholder-gray-300 text-gray-700 text-sm placeholder:text-sm placeholder:italic border-gray-300 border-1"
          />
        </div>
      </div>

      {/* Right side: Theme + Language + User */}
      <div className="flex items-center gap-4">
        <Sun size={18} className="text-gray-600" />

        {/* Vertical divider */}
        <div className="w-px h-9 bg-gray-300"></div>

        {/* Language switcher */}
        <select className="bg-gray-100 px-3 py-2 rounded text-gray-700 text-sm">
          <option>English</option>
          <option>Arabic</option>
        </select>

        {/* Vertical divider */}
        <div className="w-px h-9 bg-gray-300"></div>

        {/* User name (Later add dropdown for profile) */}
        <div className="bg-gray-100 px-3 py-2 rounded text-gray-700 text-sm cursor-pointer">
          Sara Khalid
        </div>
      </div>
    </header>
  );
}
