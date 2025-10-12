"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { MenuResponse, MenuItem } from "@/types/menu"; 

import UserIconContainer from "@/icon/user";
import { useSession } from "@/auth/session";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuData: MenuResponse[];
}

export default function Sidebar({ isOpen, onClose, menuData }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const session = useSession();
  

  const sortedMenuData = (menuData ?? [])
    .filter((item) => item.parent && item.parent.menuName)
    .sort((a: MenuResponse, b: MenuResponse) => (a.parent?.parentId || 0) - (b.parent?.parentId || 0)) 
    .map((item) => ({
      ...item,
      children: (item.children ?? []).sort(
        (a: MenuItem, b: MenuItem) => (a.childId || 0) - (b.childId || 0),
      ),
    }));

  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  return (
    <div
      className={`no-scrollbar fixed top-0 flex h-dvh max-w-full flex-col overflow-x-hidden bg-white-a700 shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "left-0" : "left-[-100%]"
      }`}
      style={{ width: "326px", zIndex: 1000 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 p-4 border-b border-gray-200">
        <h4 className="text-lg font-medium capitalize !leading-tight text-gray-900">
          {session.isLoggedin ? `Hello, ${session.user?.full_name}` : "Hello, Guest"}
        </h4>
        <UserIconContainer onLoggedOutClick={onClose} />
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        <ul className="space-y-4">
          {sortedMenuData.map((item) => (
            <li key={item.parent.slug}>
              <div>
                {item.children.length > 0 ? (
                  <button
                    className="flex w-full items-center justify-between pb-3 pr-3 pt-2 cursor-pointer"
                    onClick={() => toggleMenu(item.parent.menuName)}
                  >
                    <h4 className="text-base capitalize !leading-tight text-gray-900 font-semibold">
                      {item.parent.menuName}
                    </h4>
                    <ChevronDownIcon
                      className={`mt-0.5 h-3 w-3 transition-transform duration-300 ${
                        openMenu === item.parent.menuName ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <a
                    className="flex grow items-center justify-between pb-3 pr-3 pt-2"
                    href={`/${item.parent.slug}`}
                  >
                    <h4 className="text-base capitalize !leading-tight text-gray-900 font-semibold">
                      {item.parent.menuName}
                    </h4>
                  </a>
                )}

                {/* Sub Items */}
                {item.children.length > 0 && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openMenu === item.parent.menuName ? "h-auto" : "h-0"
                    }`}
                  >
                    <ul>
                      {item.children.map((child: MenuItem, index: number) => (
                        <li
                          key={child.slug}
                          className={
                            index < item.children.length - 1
                              ? "border-b-[0.5px] border-b-gray-300"
                              : ""
                          }
                        >
                          <a
                            className="w-full py-2.5 block"
                            href={`/${child.slug}`}
                          >
                            <p className="text-sm font-normal !leading-tight text-gray-900 capitalize">
                              {child.menuName}
                            </p>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="h-[0.5px] w-full bg-gray-300"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}