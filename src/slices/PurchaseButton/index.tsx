"use client";

import { FC, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import clsx from "clsx";
import { LuChevronRight, LuLoader } from "react-icons/lu";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { GradientTexture } from "@react-three/drei";

gsap.registerPlugin(useGSAP);

export type PurchaseButtonProps =
  SliceComponentProps<Content.PurchaseButtonSlice>;

const PurchaseButton: FC<PurchaseButtonProps> = ({ slice }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handlePurchaseClick = async () => {
    setIsPressed(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("✅ Added to Cart!\n\nYour product has been added to your cart.");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsPressed(false);
    }
  };

  useGSAP(() => {
    if (!buttonRef.current || !textRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!buttonRef.current || !textRef.current) return;
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const mouseX = event.clientX - buttonRect.left;
      const buttonWidth = buttonRect.width;
      const normalizedX = Math.max(0, Math.min(1, mouseX / buttonWidth));

      const newWdth = 120 - normalizedX * 70;
      const newWght = 700 + normalizedX * 300;

      gsap.to(textRef.current, {
        "--wdth": newWdth,
        "--wght": newWght,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      if (!textRef.current) return;
      gsap.to(textRef.current, {
        "--wdth": 85,
        "--wght": 850,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    buttonRef.current?.addEventListener("mousemove", handleMouseMove);
    buttonRef.current?.addEventListener("mouseleave", handleMouseLeave);

    gsap.set(textRef.current, { "--wdth": 85, "--wght": 850 });

    return () => {
      buttonRef.current?.removeEventListener("mousemove", handleMouseMove);
      buttonRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative overflow-hidden"
    >
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

      <Bounded>
        <FadeIn
          className="relative mx-auto max-w-4xl px-6 text-center text-white"
          targetChildren
        >
          {/* Eyebrow */}
          <p className="mb-4 text-lg font-medium text-white/80 md:text-xl">
            {slice.primary.eyebrow}
          </p>

          {/* Heading */}
          <h2
            id="buy-button"
            className="font-bold-slanted mb-8 scroll-pt-6 text-4xl uppercase md:text-6xl lg:text-7xl"
          >
            <PrismicText field={slice.primary.heading} />
          </h2>

          {/* Button */}
          <button
            ref={buttonRef}
            onClick={handlePurchaseClick}
            disabled={isPressed}
            className={clsx(
              "group relative inline-flex items-center justify-center rounded-full border-2 border-white/20 bg-black/60 px-10 py-5 md:px-16 md:py-7",
              "hover:bg-black/80 hover:shadow-[0_0_25px_rgba(129,191,237,0.5)] hover:scale-105",
              "active:scale-95 transition-all duration-300 ease-out",
              isPressed && "scale-95 cursor-not-allowed opacity-70"
            )}
          >
            <span
              ref={textRef}
              style={{ "--wdth": 85, "--wght": 850 } as React.CSSProperties}
              className="font-black-slanted text-2xl md:text-4xl tracking-wide text-white uppercase"
            >
              {isPressed ? (
                <span className="flex items-center gap-3 md:gap-4">
                  <LuLoader className="size-8 animate-spin text-white md:size-10" />
                  Loading...
                </span>
              ) : (
                slice.primary.buttontext
              )}
            </span>

            {!isPressed && (
              <LuChevronRight className="ml-4 size-8 text-white opacity-80 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300 md:size-10" />
            )}
          </button>

          {/* Body text */}
          <div className="mt-8 max-w-2xl mx-auto text-base text-white/70 md:text-lg">
            <PrismicRichText field={slice.primary.body} />
          </div>
        </FadeIn>
      </Bounded>
    </section>
  );
};

export default PurchaseButton;
