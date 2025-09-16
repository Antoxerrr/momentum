import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import { ThemeSwitch } from "@/components/navbar/theme-switch";
import clsx from "clsx";
import {FaUser} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import { useEffect } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import {useUserStore} from "@/store/user.js";


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
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <p className={`font-bold text-inherit hover:text-primary-500 transition-colors duration-200`}>MOMENTUM</p>
          </Link>
        </NavbarBrand>
        {isAuthenticated && <NavbarNavMenu/>}
      </NavbarContent>

      <NavbarContent
        className="flex basis-1/5"
        justify="end"
      >
        <NavbarItem className="flex items-center gap-3 text-default-500 h-6">
          <ThemeSwitch/>
          {isAuthenticated && <UserDropdown account={account} logoutFunc={performLogout}/>}
          <div id="navbar-portal"></div>
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
}


function UserDropdown({logoutFunc, account}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <div>
          <FaUser className={`cursor-pointer`}/>
        </div>
      </DropdownTrigger>
      <DropdownMenu
        className="p-1"
        disabledKeys={["user-info"]}
      >
        <DropdownItem key="user-info" isReadOnly className="opacity-100 text-default-500">
          <div><p>{account.username} • {account.timezone}</p></div>
        </DropdownItem>
        <DropdownItem key="profile" href="/profile">
          Профиль
        </DropdownItem>
        <DropdownItem key="logout" className="text-danger" color="danger" onPress={logoutFunc}>
          Выйти
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

function NavbarNavMenu() {
  return (
    <div className="flex gap-4 justify-start ml-2">
      {getMenuLinks().map(item => {
        return (
          <NavbarItem key={item.href}>
            <Link
              className={clsx(
                linkStyles({color: "foreground"}),
                "data-[active=true]:text-danger data-[active=true]:font-medium",
              )}
              color="foreground"
              href={item.href}
            >
              {item.title}
            </Link>
          </NavbarItem>
        )
      })}
    </div>
  )
}

function getMenuLinks() {
  return [
    {
      href: "/",
      title: "Главная"
    },
    // {
    //   href: "/statistics",
    //   title: "Статистика"
    // }
  ]
}
