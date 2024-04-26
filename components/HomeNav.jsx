"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession, getSession } from "next-auth/react";

const HomeNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  let homeLink;

  if (pathname.startsWith("/Home")) {
    homeLink = "/Home";
  } else {
    homeLink === "/";
  }

  const handleLogout = () => {
    router.push("/api/auth/signout");
  };

  return (
    <div className="mb-5 w-screen h-16">
      <Navbar shouldHideOnScroll isBordered maxWidth="full">
        <NavbarContent>
          <NavbarBrand>
            <Link
              color="foreground"
              className="text-xl text-bold"
              href={homeLink}
            >
              <Image
                src="/brotrition_assets/png/pear.png"
                width={60}
                height={60}
                alt="Description of your image"
              />
              <p className="font-bold text-inherit text-4xl green_gradient">
                BroTrition
              </p>
            </Link>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="lg:flex gap-16" justify="end">
          <NavbarItem className="lg:flex">
            <Button
              onClick={handleLogout}
              className="border-2 border-red-700 bg-transparent text-2xl text-bold"
            >
              Log Out
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
};

export default HomeNav;
