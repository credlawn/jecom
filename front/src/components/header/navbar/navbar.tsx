"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { MenuResponse } from "@/types/menu";
import { useAppSelector } from "@/redux/store";
import { useResetOnNavigation } from "@/redux/useResetOnNavigation";
import { Logo, LogoMobile } from "@/components/header/logo/logo";
import SearchBox from "@/components/header/searchbox/searchBox";
import UserIconContainer from "@/icon/user";
import { selectWishlistItems } from "@/redux/features/wishlist-slice";
import { selectCartItems } from "@/redux/features/cart-slice";
import { HeartIcon, MenuIcon, SearchIcon, ChevronDown, ShoppingCart} from "lucide-react";
import Sidebar from "@/components/header/sidebar/sidebar";

interface NavbarProps {
  menuData: MenuResponse[];
}

export default function Navbar({ menuData }: NavbarProps) {
  const settings = useAppSelector((state) => state.settingsReducer);
  const wishlistItems = useAppSelector(selectWishlistItems);
  const cartItems = useAppSelector(selectCartItems);
  const wishlistCount = wishlistItems.length;
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const searchTriggerRef = useRef<HTMLDivElement>(null); // Ref for the desktop search box wrapper
  const mobileSearchOverlayRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarButtonRef = useRef<HTMLButtonElement>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);
  useResetOnNavigation(closeSearch);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        searchTriggerRef.current &&
        !searchTriggerRef.current.contains(event.target as Node) &&
        (!mobileSearchOverlayRef.current ||
          !mobileSearchOverlayRef.current.contains(event.target as Node))
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutsideSidebar = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !sidebarButtonRef.current?.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
    };
  }, []);

  return (
    <header className="relative">
      <div className="container-main flex items-center border-b-[0.5px] border-solid border-gray-300_01 bg-white h-13 px-4">
        {/* ==================== Desktop View ==================== */}
        <div className="hidden lg:flex items-center w-full h-8">
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="cursor-pointer">
                <Logo logoUrl={settings.logoUrl} />
              </span>
            </Link>
          </div>

          {/* Gap after logo */}
          <div className="ml-8"></div>

          {/* Menu (shrinks/hides when search is open) */}
          <nav className={`flex items-center gap-4 transition-all duration-300 ${isSearchOpen ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
            <ul className="flex items-center gap-4">
              {menuData.map((menuItem) => (
                <li key={menuItem.parent.slug} className="relative">
                  <div
                    onMouseEnter={() => menuItem.children.length > 0 && setOpenMenu(menuItem.parent.slug)}
                    onMouseLeave={() => menuItem.children.length > 0 && setOpenMenu(null)}
                  >
                    <Link href={`/${menuItem.parent.slug}`}>
                      <span className="cursor-pointer hover:text-red-500 flex items-center">
                        {menuItem.parent.menuName}
                        {menuItem.children.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                      </span>
                    </Link>
                    {menuItem.children.length > 0 && openMenu === menuItem.parent.slug && (
                      <div
                        className="absolute left-0 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                        style={{ top: "100%", paddingTop: "10px" }}
                      >
                        <ul className="block">
                          {menuItem.children.map((child) => (
                            <li key={child.slug}>
                              <Link href={`/${child.slug}`}>
                                <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  {child.menuName}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Spacer to push search and icons to right */}
          <div className="flex-grow"></div>

          {/* Search Box (expands when open) */}
          <div ref={searchTriggerRef} className={`transition-all duration-300 ${isSearchOpen ? 'flex-grow mr-4' : 'w-80 mr-4'}`}>
            <SearchBox className={`${isSearchOpen ? 'w-full' : 'w-80'}`} onFocus={() => setIsSearchOpen(true)} autoFocus={isSearchOpen} isParentSearchOpen={isSearchOpen} />
          </div>

          {/* Icons (fixed right) */}
          <div className={`flex items-center gap-4 flex-shrink-0 transition-opacity duration-300`}>
            <Link href="/wishlist" className="relative hover:text-red-500 transition-colors cursor-pointer">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <UserIconContainer />
            <Link href="/cart" className="relative hover:text-red-500 transition-colors cursor-pointer">
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ==================== Mobile View ==================== */}
        <div className="flex lg:hidden items-center justify-between w-full h-6 relative">
          <div className="flex-shrink-0">
            <button
              ref={sidebarButtonRef}
              className="flex items-center justify-center"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Menu"
            >
              <MenuIcon />
            </button>
          </div>

          <div className="flex justify-center flex-1">
            {settings.showMobileLogo === 1 && (
              <Link href="/">
                <span className="cursor-pointer">
                  <LogoMobile logoUrl={settings.logoUrl} />
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              className="flex items-center justify-center"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <Link href="/wishlist" className="relative hover:text-red-500 transition-colors cursor-pointer">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative hover:text-red-500 transition-colors cursor-pointer">
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== Mobile Search Overlay (Desktop overlay removed) ==================== */}
      {isSearchOpen && (
        <div
          ref={mobileSearchOverlayRef}
          className="lg:hidden absolute top-0 left-0 right-0 bg-white z-50 shadow-lg animate-in slide-in-from-top-2 duration-300"
        >
          <div className="container-main h-13 px-4 flex items-center">
            <SearchBox
              className="w-full"
              autoFocus={true}
              isParentSearchOpen={isSearchOpen}
            />
          </div>
        </div>
      )}

      <div ref={sidebarRef}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          menuData={menuData}
        />
      </div>
    </header>
  );
}
