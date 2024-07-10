"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import tw from "tailwind-styled-components";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const NavBar = tw.div`
  sticky 
  lg:static 
  top-0 
  navbar 
  bg-base-100 
  min-h-0 
  flex-shrink-0 
  justify-between 
  z-20 
  shadow-md 
  shadow-secondary 
  px-0 
  sm:px-2
`;

const NavbarStart = tw.div`
  navbar-start 
  w-auto 
  lg:w-1/2
`;

const DropdownContainer = tw.div`
  lg:hidden 
  dropdown
`;

const BurgerMenuButton = tw.label<{ $isOpen: boolean }>`
  ml-1 
  btn 
  btn-ghost 
  ${p => (p.$isOpen ? "hover:bg-secondary" : "hover:bg-transparent")}
`;

const DropdownMenu = tw.ul`
  menu 
  menu-compact 
  dropdown-content 
  mt-3 
  p-2 
  shadow 
  bg-base-100 
  rounded-box 
  w-52
`;

const LogoLink = tw(Link)`
  hidden 
  lg:flex 
  items-center 
  gap-2 
  ml-4 
  mr-6 
  shrink-0
`;

const LogoContainer = tw.div`
  flex 
  relative 
  w-8 
  h-8
`;

const LogoText = tw.div`
  flex 
  flex-col
`;

const LogoTitle = tw.span`
  font-bold 
  leading-tight
`;

const DesktopMenu = tw.ul`
  hidden 
  lg:flex 
  lg:flex-nowrap 
  menu 
  menu-horizontal 
  px-1 
  gap-2
`;

const NavbarEnd = tw.div`
  navbar-end 
  flex-grow 
  mr-4
`;

const MenuLink = tw(Link)<{ $isActive: boolean }>`
  ${p => (p.$isActive ? "bg-secondary shadow-md" : "")}
  hover:bg-secondary 
  hover:shadow-md 
  focus:!bg-secondary 
  active:!text-neutral 
  py-1.5 
  px-3 
  text-sm 
  rounded-full 
  gap-2 
  grid 
  grid-flow-col
`;

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Recent",
    href: "/recent",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <MenuLink href={href} passHref $isActive={isActive}>
              {icon}
              <span>{label}</span>
            </MenuLink>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <NavBar>
      <NavbarStart>
        <DropdownContainer ref={burgerMenuRef}>
          <BurgerMenuButton
            tabIndex={0}
            $isOpen={isDrawerOpen}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </BurgerMenuButton>
          {isDrawerOpen && (
            <DropdownMenu
              tabIndex={0}
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </DropdownMenu>
          )}
        </DropdownContainer>
        <LogoLink href="/" passHref>
          <LogoContainer>
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </LogoContainer>
          <LogoText>
            <LogoTitle>TruthBot</LogoTitle>
            {/*<span className="text-xs">Ethereum dev stack</span>*/}
          </LogoText>
        </LogoLink>
        <DesktopMenu>
          <HeaderMenuLinks />
        </DesktopMenu>
      </NavbarStart>
      <NavbarEnd>
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </NavbarEnd>
    </NavBar>
  );
};
