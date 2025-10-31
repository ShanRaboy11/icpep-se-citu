"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "./button";
import Menu from "./menu";
import { useRouter } from "next/navigation";

type UserRole = "guest" | "user";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("guest");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 right-0 z-40 border-b border-foreground cursor-default transition-all duration-500
        ${
          scrolled
            ? "bg-white/85 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            : "bg-white"
        }`}
    >
      <div className="flex items-center justify-between py-3 px-4 md:max-w-[93%] md:mx-auto md:px-8 lg:px-16">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Image
            src="/icpep logo.png"
            alt="ICPEP Logo"
            width={55}
            height={55}
            className="md:h-15 md:w-auto sm:h-25 sm:w-auto rounded-full cursor-pointer 
                       transition-all duration-300 ease-in-out 
                       hover:drop-shadow-[0_0_8px_rgba(0,167,238,0.7)]"
            onClick={() => router.push("/home")}
          />
          <div className="flex items-end gap-0.5">
            <Image
              src="/Vector-i.svg"
              alt="I"
              width={0}
              height={50}
              className="h-0 w-auto sm:h-12"
            />
            <Image
              src="/Vector-c.svg"
              alt="C"
              width={0}
              height={50}
              className="h-0 w-auto sm:h-12"
            />
            <Image
              src="/Vector-p1.svg"
              alt="P"
              width={0}
              height={50}
              className="h-0 w-auto sm:h-12"
            />
            <Image
              src="/Vector-e1.svg"
              alt="E"
              width={0}
              height={50}
              className="h-0 w-auto sm:h-12"
            />
            <Image
              src="/Vector-p2.svg"
              alt="P"
              width={0}
              height={50}
              className="h-0 w-auto sm:h-12"
            />
            <Image
              src="/Vector-dot.svg"
              alt="."
              width={0}
              height={16}
              className="h-0 w-auto sm:h-3.5 -ml-2"
            />
            <Image
              src="/Vector-s.svg"
              alt="S"
              width={0}
              height={50}
              className="h-0 w-auto sm:h-12"
            />
            <Image
              src="/Vector-e2.svg"
              alt="E"
              width={0}
              height={50}
              className="h-0 w-auto sm:h-12"
            />
          </div>
          <div className="min-w-0 font-rubik -ml-2">
            <div className="truncate text-[0px] sm:text-[22px] font-bold text-primary1 -mt-1 pt-1">
              Region 7
            </div>
            <div className="truncate text-[0px] sm:text-[22px] font-bold text-primary1 -mt-1">
              CIT-U Chapter
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          {role === "guest" && (
            <>
              <Button
                className="sm:block h-10.5 transition-all duration-300 ease-in-out 
             hover:scale-105 hover:brightness-110 hover:shadow-[0_0_10px_rgba(0,167,238,0.5)] 
             active:scale-95"
                variant="secondary"
                onClick={() => setRole("user")}
              >
                Sign Up
              </Button>

              <Button
                className="sm:block border-2 relative overflow-hidden 
             transition-all duration-300 ease-in-out active:scale-95 
             before:absolute before:inset-0 before:bg-gradient-to-r 
             before:from-transparent before:via-white/40 before:to-transparent 
             before:translate-x-[-100%] hover:before:translate-x-[100%] 
             before:transition-transform before:duration-700"
                onClick={() => {
                  setRole("user");
                }}
              >
                Log In
              </Button>
            </>
          )}

          {role === "user" && (
            <div className="flex items-center gap-3">
              <Image
                src="/user.svg"
                alt="User Profile"
                width={36}
                height={36}
                className="h-11.5 w-11.5 cursor-pointer transition-all duration-300 ease-in-out
             hover:scale-105 hover:brightness-110 hover:drop-shadow-[0_0_10px_rgba(0,167,238,0.5)]
             active:scale-95"
              />

              <Button
                className="sm:block border-2 relative overflow-hidden 
             transition-all duration-300 ease-in-out active:scale-95 
             before:absolute before:inset-0 before:bg-gradient-to-r 
             before:from-transparent before:via-white/40 before:to-transparent 
             before:translate-x-[-100%] hover:before:translate-x-[100%] 
             before:transition-transform before:duration-700"
                onClick={() => setRole("guest")}
              >
                Log Out
              </Button>
            </div>
          )}

          <div
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`grid grid-cols-3 gap-1 cursor-pointer transition-transform duration-500 ease-in-out hover:rotate-90 ${
              open ? "rotate-[360deg]" : ""
            }`}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-[3px] bg-primary1" />
            ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-transform duration-700 ease-out ${
          open ? "translate-y-0" : "-translate-y-[120vh]"
        }`}
      >
        <Menu userRole={role} onExit={() => setOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
