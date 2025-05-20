import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import { ThemeSwitch } from "@/components/theme-switch";
import clsx from "clsx";
import {useDispatch, useSelector} from "react-redux";
import {Divider} from "@heroui/divider";
import {IoLogOut} from "react-icons/io5";
import {logout} from "@/store/user.js";
import {useNavigate} from "react-router-dom";
import {getAPI} from "@/core/api.js";
import {getAccountData} from "@/core/local-storage.js";


export function Navbar() {
  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const performLogout = async () => {
    const api = getAPI();
    const accountData = getAccountData();
    if (accountData && accountData.refreshToken) {
      await api.users.logout(getAccountData().refreshToken);
    }
    dispatch(logout());
    navigate('/login');
    api.setAuthToken();
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <p className="font-bold text-inherit">MOMENTUM</p>
          </Link>
        </NavbarBrand>
        {userData.isAuthenticated && <NavbarNavMenu/>}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden flex items-center gap-2 text-default-500 h-6">
          <ThemeSwitch/>
          {userData.isAuthenticated && <UserBar username={userData.username} logoutFunc={performLogout}/>}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch/>
      </NavbarContent>
    </HeroUINavbar>
  );
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


function UserBar({logoutFunc, username}) {
  return (
    <>
      <Divider orientation="vertical" className="mx-2"/>
      <p className="font-bold text-foreground">{username}</p>
      <IoLogOut size="22" className="text-default-500 cursor-pointer hover:opacity-80 transition-opacity ms-1" onClick={logoutFunc}/>
    </>
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
