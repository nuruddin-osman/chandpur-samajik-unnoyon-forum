"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiInfo,
  FiEdit,
  FiDollarSign,
  FiChevronRight,
} from "react-icons/fi";
import { logout } from "@/store/auth/authSlice";
import AccountInformation from "./profile-items/AccountInformation";
import MonthlyChanda from "./profile-items/MonthlyChanda";
import UpdateProfile from "./profile-items/UpdateProfile";

const navItems = [
  { key: "info", label: "Account Information", icon: <FiInfo size={16} /> },
  { key: "update", label: "Update Profile", icon: <FiEdit size={16} /> },
  { key: "chanda", label: "Monthly Chada", icon: <FiDollarSign size={16} /> },
];

const page = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [active, setActive] = useState("info");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) router.push("/client/login");
  }, [token, router]);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/client/login");
  };

  const handleNav = (key) => {
    setActive(key);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (active === "info") return <AccountInformation user={user} />;
    if (active === "update") return <UpdateProfile />;
    if (active === "chanda") return <MonthlyChanda />;
  };

  const activeLabel = navItems.find((n) => n.key === active)?.label;
  return (
    <div className="min-h-screen bg-section-bg-gray font-inter">
      {/* Top bar — mobile only */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-50 text-text"
        >
          <FiMenu size={20} />
        </button>
        <span className="text-sm font-semibold text-heading font-playfair">
          {activeLabel}
        </span>
        <div className="w-9" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
        <div className="flex gap-6 items-start">
          {/* ── Sidebar ── */}
          <aside
            className={`
              fixed top-0 left-0 h-full w-72 bg-white z-20 shadow-xl
              transform transition-transform duration-300 ease-in-out
              lg:static lg:h-auto lg:w-64 lg:shadow-none lg:rounded-2xl
              lg:transform-none lg:transition-none lg:shrink-0
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 lg:hidden">
              <span className="font-semibold text-heading text-sm font-playfair">
                মেনু
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* User info — sidebar top */}
            <div className="px-5 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-button-bg/10 flex items-center justify-center shrink-0">
                  <FiUser className="text-button-bg" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-heading truncate font-playfair">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.phone}</p>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <nav className="px-3 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left
                    ${
                      active === item.key
                        ? "bg-button-bg/10 text-button-bg"
                        : "text-text hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={
                      active === item.key ? "text-button-bg" : "text-gray-400"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {active === item.key && (
                    <FiChevronRight size={14} className="text-button-bg" />
                  )}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-5 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150 text-left"
              >
                <FiLogOut size={16} />
                লগআউট
              </button>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm px-5 md:px-7 py-6">
            {/* Desktop section heading */}
            <div className="hidden lg:flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <span className="text-button-bg">
                {navItems.find((n) => n.key === active)?.icon}
              </span>
              <h2 className="text-base font-semibold text-heading font-playfair">
                {activeLabel}
              </h2>
            </div>

            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default page;
