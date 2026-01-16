import { Link } from '@heroui/react';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';

import { useUserStore } from '@/store/user.js';
import UserAvatar from '@/components/user-avatar';
import {getUserTimeZone} from "@/core/utils.js";
import {getMenuLinks} from "@/core/navigation.js";

export function Navbar() {
  const { logout, isAuthenticated, account, loadUserAccount } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    loadUserAccount();
  }, []);

  const performLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="hidden md:flex">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <p
              className={`font-bold text-inherit hover:text-primary-500 transition-colors duration-200`}
            >
              MOMENTUM
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="center" className="hidden md:flex">
        {isAuthenticated && <NavbarNavMenu/>}
      </NavbarContent>

      <NavbarContent className="flex basis-1/5" justify="end">
        <NavbarItem className="flex items-center gap-3 text-default-500 h-6">
          {isAuthenticated && (
            <UserDropdown account={account} logoutFunc={performLogout} />
          )}
          <div id="navbar-portal" />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
}

function UserDropdown({ logoutFunc, account }) {
  return (
    <Dropdown shouldBlockScroll={false}>
      <DropdownTrigger>
        <div>
          <UserAvatar className="cursor-pointer" username={account.username} />
        </div>
      </DropdownTrigger>
      <DropdownMenu className="p-1" disabledKeys={['user-info']}>
        <DropdownItem
          key="user-info"
          isReadOnly
          className="opacity-100 text-default-500"
        >
          <div>
            <p>
              {account.username} • {getUserTimeZone()}
            </p>
          </div>
        </DropdownItem>
        <DropdownItem key="profile" href="/profile">
          Профиль
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onPress={logoutFunc}
        >
          Выйти
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function NavbarNavMenu() {
  return (
    <div className="flex gap-4 justify-start ml-2">
      {getMenuLinks().map((item) => {
        return (
          <NavbarItem
            key={item.href}
            className="data-[active=true]:underline"
            isActive={location.pathname.startsWith(item.href)}
          >
            <Link
              className="font-medium text-[0.95rem] text-foreground tracking-tight"
              href={item.href}
              style={{
                textDecorationLine: 'inherit',
                textUnderlineOffset: '10px',
              }}
            >
              {item.title}
            </Link>
          </NavbarItem>
        );
      })}
    </div>
  );
}
