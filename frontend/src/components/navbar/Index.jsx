"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { RiFlashlightFill } from "react-icons/ri";
import {
  MdOutlineExplore,
  MdOutlinePriceChange,
  MdOutlineInfo,
  MdOutlineContactMail,
} from "react-icons/md";
import Image from "next/image";
import Logo from "@/assets/logo.png";

const navLinks = [
  { label: "সম্পর্কে", href: "/", icon: <MdOutlineExplore size={16} /> },
  {
    label: "কমিটি",
    href: "/",
    icon: <MdOutlinePriceChange size={16} />,
  },
  {
    label: "আর্থিক প্রতিবেদন",
    href: "/",
    icon: <MdOutlineInfo size={16} />,
  },
  {
    label: "যোগাযোগ",
    href: "/",
    icon: <MdOutlineContactMail size={16} />,
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-section-bg-gray backdrop-blur-md border-b border-border-prim shadow-[0_4px_40px_rgba(0,0,0,0.08)] mb-16">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 group select-none">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <Image
              src={Logo}
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-inter font-medium text-text hover:bg-black/5 transition-all duration-200 group"
              >
                <span className="text-button-bg">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop Auth Buttons ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-inter font-medium text-text rounded-lg border border-border-prim hover:bg-button-bg transition-all duration-200"
          >
            লগইন
          </Link>
          <Link
            href="/pages/ragistration"
            className="px-5 py-2 text-sm font-inter font-semibold text-white-text bg-button-bg rounded-lg shadow-md hover:opacity-90 transition-all duration-200"
          >
            রেজিস্ট্রেশন
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-text hover:bg-black/5 transition-all duration-200"
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
        </button>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 md:hidden bg-section-bg border-b border-border-prim backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col px-4 pt-3 pb-2">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-inter font-medium text-text hover:bg-black/5 transition-all duration-150"
              >
                <span className="text-button-bg">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 px-8 py-4 border-t border-border-prim">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="w-full text-center px-4 py-2.5 text-sm font-inter font-medium text-text rounded-lg border border-border-prim hover:bg-button-bg transition-all duration-150"
          >
            লগইন
          </Link>
          <Link
            href="/pages/ragistration"
            className="w-full text-center px-4 py-2.5 text-sm font-inter font-semibold text-white-text bg-button-bg rounded-lg hover:opacity-90 transition-all duration-150"
          >
            রেজিস্ট্রেশন
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
