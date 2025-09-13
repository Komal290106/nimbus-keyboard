"use client";

import { useRef, useState, createContext, useContext, useEffect } from "react";
import Link from "next/link";
import { LuChevronRight, LuMenu, LuX } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Logo } from "./Logo";
import clsx from "clsx";
import { gsap } from "gsap";

const DialogContext = createContext<
  [open: boolean, setOpen: (open: boolean) => void]
>([false, () => {}]);

export function Navbar() {
  const button = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const state = useState(false);
  const [open, setOpen] = state;
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    if (button.current) button.current.disabled = true;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("✅ Added to Cart!\n\nYour product has been added to your cart.");
    } finally {
      setIsLoading(false);
      if (button.current) button.current.disabled = false;
    }
  }

  useEffect(() => {
    if (!navbarRef.current) return;

    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        gsap.to(navbarRef.current, {
          y: -100,
          duration: 0.3,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(navbarRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={navbarRef}
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between p-3 md:p-6
      bg-transparent"
    >
      {/* Logo */}
      <Link
        href="/"
        className="shrink-0 hover:scale-110 transition-transform duration-300"
      >
        <Logo className="h-6 w-auto md:h-8" />
      </Link>

      <div className="flex gap-3 md:gap-4">
       {/* Buy Button - Premium Dark Style */}
<button
  ref={button}
  onClick={handleCheckout}
  disabled={isLoading}
  className={clsx(
    "font-bold-slanted group flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/70 px-6 py-3 text-lg uppercase text-white shadow-lg backdrop-blur-sm",
    "transition-all duration-300 hover:scale-105 hover:bg-black hover:shadow-[0_0_20px_rgba(129,191,237,0.5)] active:scale-95",
    isLoading ? "cursor-not-allowed opacity-80" : "cursor-pointer"
  )}
>
  {isLoading ? (
    <>
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Adding...
    </>
  ) : (
    <>
      Buy
      <LuChevronRight className="size-5 text-white opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </>
  )}
</button>


        {/* Menu */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105 transition-all border border-white/20">
            <LuMenu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <DialogContent className="fixed inset-y-0 right-0 z-50 h-full w-3/4 bg-[#0a0f2d]/95 backdrop-blur-xl p-6 shadow-2xl border-l border-white/10 sm:max-w-sm">
              {/* Invisible but accessible title */}
              <VisuallyHidden>
                <DialogTitle>Navigation Menu</DialogTitle>
              </VisuallyHidden>

              <DialogClose className="ml-auto flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <LuX className="size-5" />
                <span className="sr-only">Close menu</span>
              </DialogClose>
              <DialogContext.Provider value={state}>
                <nav className="mt-8">
                  <ul className="space-y-3">
                    <NavbarLink href="#features" title="Features" description="Learn more about our features" />
                    <NavbarLink href="#switch-playground" title="Switch Playground" description="Choose your perfect switch" />
                    <NavbarLink href="#keycap-changer" title="Keycaps" description="Choose your perfect keycap set" />
                    <NavbarLink href="#buy-button" title="Purchase" description="Order your Vapor75 now!" />
                  </ul>
                </nav>
              </DialogContext.Provider>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </header>
  );
}

type NavbarLinkProps = {
  href: string;
  title: string;
  description: string;
};

function NavbarLink({ href, title, description }: NavbarLinkProps) {
  const [, setOpen] = useContext(DialogContext);

  return (
    <li>
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className="group flex items-center rounded-xl p-4 border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
      >
        <div className="flex grow flex-col gap-1">
          <span className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
            {title}
          </span>
          <span className="text-sm text-gray-400 group-hover:text-gray-200 transition">
            {description}
          </span>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-white/5 text-gray-400 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all shadow-md">
          <LuChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </li>
  );
}
