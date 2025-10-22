'use client'

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function Layout({ children }) {
  // children is the page content (passed automatically when I wrap pages in Layout)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // state: true = expanded sidebar, false = collapsed

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  // toggle function for hamburger button

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <Header onToggleSidebar={handleToggleSidebar} />

      {/* Body (Sidebar + page contents) */}
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        {/* we pass the state to Sidebar to know if it's expanded/collapsed */}

        <main className="flex-1 p-6">{children}</main>
        {/* page content is here */}
      </div>
    </div>
  );
}
