"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Bounded } from "./Bounded";
import { Canvas } from "@react-three/fiber";
import { GradientTexture } from "@react-three/drei";


export function Footer() {
  return (
    <footer className="relative text-gray-400">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas orthographic camera={{ zoom: 80, position: [0, 0, 5] }}>
          <mesh scale={[50, 50, 1]} position={[0, 0, -10]}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial>
              <GradientTexture
                stops={[0, 1]}
                colors={["#0a0f2d", "#00111a"]}
                size={1024}
              />
            </meshBasicMaterial>
          </mesh>
        </Canvas>
      </div>

      {/* Content */}
      <Bounded as="section" className="relative border-t border-white/10 py-10">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="shrink-0 hover:opacity-90 transition">
              <Logo className="h-8 w-auto" />
              <span className="sr-only">Nimbus home</span>
            </Link>
            <p className="mt-4 text-center text-xs text-gray-500 md:text-left">
              © {new Date().getFullYear()} Nimbus Keyboards. All rights reserved.
            </p>
          </div>

          {/* Right Section */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-end">
            <FooterLink href="#">Products</FooterLink>
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Support</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </nav>
        </div>
      </Bounded>
    </footer>
  );
}

type FooterLinkProps = {
  href: string;
  children: ReactNode;
};

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm uppercase tracking-wide text-gray-400 transition-all hover:text-white hover:drop-shadow-[0_0_10px_rgba(129,191,237,0.6)] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-black rounded-md px-1"
    >
      {children}
    </Link>
  );
}
