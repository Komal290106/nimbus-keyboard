"use client";

import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader } from "@/components/Loader";
import { useProgress } from "@react-three/drei";
import clsx from "clsx";
import { LuChevronRight } from "react-icons/lu";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

function LoaderWrapper() {
  const { active } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (active) {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div
      className={clsx(
        "motion-safe:transition-opacity motion-safe:duration-700",
        isLoading ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Loader />
    </div>
  );
}

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero: FC<HeroProps> = ({ slice }) => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(".hero-heading", {
        type: "chars,lines",
        mask: "lines",
        linesClass: "line++",
      });

      const tl = gsap.timeline({ delay: 4.2 });

      tl.from(split.chars, {
        opacity: 0,
        y: -120,
        ease: "back",
        duration: 0.4,
        stagger: 0.07,
      }).to(".hero-body", { opacity: 1, duration: 0.6, ease: "power2.out" });

      gsap.fromTo(
        ".hero-scene",
        {
          background:
            "linear-gradient(to bottom, #000000, #0f172a, #062f4a, #7fa0b9)",
        },
        {
          background:
            "linear-gradient(to bottom, #ffffff, #ffffff, #ffffff, #ffffff)",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "50% bottom",
            scrub: 1,
          },
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".hero-heading, .hero-body", { opacity: 1 });
    });
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero relative h-dvh text-white motion-safe:h-[300vh]"
    >
      {/* Background Scene */}
      <div className="hero-scene pointer-events-none sticky top-0 h-dvh w-full">
        <Canvas shadows="soft">
          <Scene />
        </Canvas>
      </div>

      <LoaderWrapper />

      {/* Content */}
      <div className="hero-content absolute inset-x-0 top-0 h-dvh">
        <Bounded
          fullWidth
          className="absolute inset-x-0 top-18 md:top-24 md:left-[8vw]"
        >
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading1: ({ children }) => (
                <h1 className="hero-heading font-black-slanted text-6xl leading-[0.8] uppercase sm:text-7xl lg:text-8xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  {children}
                </h1>
              ),
            }}
          />
        </Bounded>

        <Bounded
          fullWidth
          className="hero-body absolute inset-x-0 bottom-0 opacity-0 md:right-[8vw] md:left-auto"
          innerClassName="flex flex-col gap-3"
        >
          <div className="max-w-md">
            <PrismicRichText
              field={slice.primary.body}
              components={{
                heading2: ({ children }) => (
                  <h2 className="font-bold-slanted mb-1 text-4xl uppercase lg:mb-2 lg:text-6xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {children}
                  </h2>
                ),
              }}
            />
          </div>

          {/* Premium Dark Buy Button */}
          <button className="mt-4 font-bold-slanted group flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/70 px-6 py-3 text-lg uppercase text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-black hover:shadow-[0_0_20px_rgba(129,191,237,0.5)] active:scale-95">
            BUY VAPOR75
            <LuChevronRight className="text-white opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </button>
        </Bounded>
      </div>
    </section>
  );
};

export default Hero;
