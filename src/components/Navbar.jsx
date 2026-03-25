import React, { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { TbDownload } from "react-icons/tb";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import resumeFile from "../assets/myresume.pdf";

import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [hasShadow, setHasShadow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          window.scrollTo({
            top: section.offsetTop - 110,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const section = document.getElementById(id);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 110,
          behavior: "smooth",
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <m.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed lg:px-28 px-5 top-0 left-0 w-full z-50 bg-white p-5 transition-shadow duration-300 ${hasShadow ? "shadow-md" : "shadow-none"
        }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <button
          onClick={() => scrollToSection("home")}
          aria-label="Scroll to home"
          className="cursor-pointer"
        >
          <m.img
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="h-9"
            src="/assets/logo.svg"
            alt="Ali Nasr Logo"
            width="120"
            height="36"
          />
        </button>

        <ul className="hidden lg:flex items-center gap-x-7 font-semibold">
          {["about", "skills", "projects", "contact"].map((section) => (
            <m.li
              key={section}
              className="group"
              whileHover={{ scale: 1.1 }}
            >
              <button onClick={() => scrollToSection(section)} aria-label={`Scroll to ${section}`}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
              <m.span
                className="w-0 transition-all duration-300 group-hover:w-full h-[2px] bg-black flex"
                layout
              ></m.span>
            </m.li>
          ))}
        </ul>

        <m.a
          href={resumeFile}
          download="Ali_Nasr_Resume.pdf"
          className="hidden relative lg:inline-block px-4 py-2 font-medium group"
          aria-label="Download Ali Nasr's Resume"
        >
          <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
          <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
          <span className="relative text-black group-hover:text-white flex items-center gap-x-3">
            Resume <TbDownload size={16} />
          </span>
        </m.a>

        <m.button
          className="lg:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.2 }}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <HiX /> : <HiOutlineMenu />}
        </m.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow"
          >
            <button
              className="absolute top-5 right-5 text-2xl"
              onClick={() => setIsOpen(false)}
              aria-label="Close Mobile Menu"
            >
              <HiX />
            </button>
            <ul className="flex flex-col items-start ml-16 mt-28 h-full gap-y-6 font-semibold">
              {["about", "skills", "projects", "contact"].map((section) => (
                <m.li
                  key={section}
                  className="border-b"
                  whileHover={{ scale: 1.1 }}
                >
                  <button onClick={() => scrollToSection(section)} aria-label={`Scroll to ${section}`}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </m.li>
              ))}
              <m.a
                href={resumeFile}
                download="Ali_Nasr_Resume.pdf"
                className="relative inline-block px-4 py-2 font-semibold group"
                whileHover={{ scale: 1.1 }}
                aria-label="Download Ali Nasr's Resume"
              >
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
                <span className="relative text-black group-hover:text-white flex items-center gap-x-3">
                  Resume <TbDownload size={16} />
                </span>
              </m.a>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}
