'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Button from './button';
import Menu from './menu';

//UserRole = guest | user(non-member) | member | officer | faculty?
type UserRole = 'guest' | 'user' ;

const Header = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>('guest');

  return (
    <header className="w-full border-b border-gray bg-white relative z-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-10 lg:px-10 py-3">
        {/* Left: Logo + Titles */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Image
            src="/icpep logo.png"
            alt="ICPEP Logo"
            width={55}
            height={55}
            className="md:h-15 md:w-auto sm:h-25 sm:w-auto rounded-full"
          />
          <div className="flex items-end gap-0.5">
            <Image src="/Vector-i.svg" alt="I" width={0} height={50} className="h-0 w-auto sm:h-12" />
            <Image src="/Vector-c.svg" alt="C" width={0} height={50} className="h-0 w-auto sm:h-12" />
            <Image src="/Vector-p1.svg" alt="P" width={0} height={50} className="h-0 w-auto sm:h-12" />
            <Image src="/Vector-e1.svg" alt="E" width={0} height={50} className="h-0 w-auto sm:h-12" />
            <Image src="/Vector-p2.svg" alt="P" width={0} height={50} className="h-0 w-auto sm:h-12" />
            <Image src="/Vector-dot.svg" alt="." width={0} height={16} className="h-0 w-auto sm:h-4 -ml-2" />
            <Image src="/Vector-s.svg" alt="S" width={0} height={50} className="h-0 w-auto sm:h-12" />
            <Image src="/Vector-e2.svg" alt="E" width={0} height={50} className="h-0 w-auto sm:h-12" />
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

        {/* Right side: Role-based rendering */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Guest View */}
          {role === 'guest' && (
            <>
              <Button className="sm:block" variant="secondary" onClick={() => setRole('user')}>
                Sign Up
              </Button>
              <Button className="sm:block border-2" onClick={() => setRole('user')}>
                Log In
              </Button>
            </>
          )}

          {/* Member View */}
          {role === 'user' && (
            <div className="flex items-center gap-3">
              <Image
                src="/user.svg"
                alt="User Profile"
                width={36}
                height={36}
                className="h-11 w-11 cursor-pointer"
              />
              <Button variant="outline" size="md" className="border border-2" onClick={() => setRole('guest')}>
                Log Out
              </Button>
            </div>
          )}

          {/* Menu icon */}
          <div
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid grid-cols-3 gap-1 cursor-pointer"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-[3px] bg-primary1" />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-50 transition-transform duration-700 ease-out ${
          open ? 'translate-y-0' : '-translate-y-[120vh]'
        }`}
      >
        <Menu
          userRole={role}
          onExit={() => setOpen(false)} // closes only when Exit is clicked
        />
      </div>
    </header>
  
  );
};

export default Header;
