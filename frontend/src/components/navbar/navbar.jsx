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
import {useDispatch, useSelector} from "react-redux";
import {FaUser} from "react-icons/fa";
import {loadUserAccount, logout} from "@/store/user.js";
import {useNavigate} from "react-router-dom";
import {getAPI} from "@/core/api.js";
import { useEffect } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";


export function Navbar() {
  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.isAuthenticated) {
      return;
    }
    dispatch(loadUserAccount());
  }, []);

  const performLogout = async () => {
    dispatch(logout());
    navigate('/login');
    getAPI().setAuthToken();
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
        {userData.isAuthenticated && <NavbarNavMenu/>}
      </NavbarContent>

      <NavbarContent
        className="flex basis-1/5"
        justify="end"
      >
        <NavbarItem className="flex items-center gap-3 text-default-500 h-6">
          <ThemeSwitch/>
          {userData.isAuthenticated && <UserDropdown account={userData.account} logoutFunc={performLogout}/>}
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
    {
      href: "/statistics",
      title: "Статистика"
    }
  ]
}
