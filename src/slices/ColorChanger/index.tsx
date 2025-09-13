"use client";

import { FC, useCallback, useState } from "react";
import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import clsx from "clsx";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { GradientTexture } from "@react-three/drei";
import { Scene } from "./Scene";

export const KEYCAP_TEXTURES = [
  { id: "goodwell", name: "Goodwell", path: "/goodwell_uv.png", knobColor: "#E44E21" },
  { id: "dreamboard", name: "Dreamboard", path: "/dreamboard_uv.png", knobColor: "#E9759F" },
  { id: "cherrynavy", name: "Cherry Navy", path: "/cherrynavy_uv.png", knobColor: "#F06B7E" },
  { id: "kick", name: "Kick", path: "/kick_uv.png", knobColor: "#FD0A0A" },
  { id: "oldschool", name: "Old School", path: "/oldschool_uv.png", knobColor: "#B89D82" },
  { id: "candykeys", name: "Candy Keys", path: "/candykeys_uv.png", knobColor: "#F38785" },
];

type KeycapTexture = (typeof KEYCAP_TEXTURES)[number];

export type ColorChangerProps = SliceComponentProps<Content.ColorChangerSlice>;

const ColorChanger: FC<ColorChangerProps> = ({ slice }) => {
  const [selectedTextureId, setSelectedTextureId] = useState(KEYCAP_TEXTURES[0].id);
  const [backgroundText, setBackroundText] = useState(KEYCAP_TEXTURES[0].name);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleTextureSelect(texture: KeycapTexture) {
    if (texture.id === selectedTextureId || isAnimating) return;
    setIsAnimating(true);
    setSelectedTextureId(texture.id);
    setBackroundText(KEYCAP_TEXTURES.find((t) => t.id === texture.id)?.name || "");
  }

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="keycap-changer"
      className="relative flex h-[90vh] min-h-[1000px] flex-col overflow-hidden text-white"
    >
      {/* Gradient Background (Canvas) */}
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

{/* Background SVG Text */}
<svg
  className="pointer-events-none absolute top-0 left-0 h-auto w-full"
  viewBox="0 0 75 100"
>
  <text
    fontSize={7}
    textAnchor="middle"
    dominantBaseline="middle"
    x="50%"
    y="50%"
    className="font-black-slanted fill-white/8 uppercase"
  >
    {Array.from({ length: 20 }, (_, i) => (
      <tspan key={i} x={`${(i + 1) * 10}%`} dy={i === 0 ? -50 : 6}>
        {Array.from({ length: 10 }, () => backgroundText).join(" ")}
      </tspan>
    ))}
  </text>
</svg>




      {/* Canvas with Switch */}
      <Canvas
        camera={{ position: [0, 0.5, 0.5], fov: 45, zoom: 1.5 }}
        className="-mb-[10vh] grow"
      >
        <Scene
          selectedTextureId={selectedTextureId}
          onAnimationComplete={handleAnimationComplete}
        />
      </Canvas>

{/* Content */}
<Bounded className="relative shrink-0">
  <div className="grid gap-10 lg:grid-cols-2 items-center">
    {/* Heading & description */}
    <div className="max-w-md mx-auto text-center lg:text-left">
      <h2 className="font-black-slanted mb-4 text-4xl uppercase lg:text-6xl drop-shadow-lg">
        <PrismicText field={slice.primary.heading} />
      </h2>
      <div className="text-pretty lg:text-lg font-medium text-white/90">
        <PrismicRichText field={slice.primary.description} />
      </div>
    </div>

    {/* Keycap Options Grid (centered in a glass card) */}
    <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white/5 backdrop-blur-lg p-6 shadow-xl">
      <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-6">
        {KEYCAP_TEXTURES.map((texture) => (
          <li key={texture.id}>
            <button
              onClick={() => handleTextureSelect(texture)}
              disabled={isAnimating}
              className={clsx(
                "flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-300",
                selectedTextureId === texture.id
                  ? "border-[#81BFED] bg-[#112233]/60 shadow-[0_0_20px_#81BFED55] scale-105"
                  : "cursor-pointer border-white/20 hover:border-white/50 hover:bg-white/10",
                isAnimating && "cursor-not-allowed opacity-50"
              )}
            >
              <div className="mb-3 overflow-hidden rounded-lg border border-white/30 bg-black/40">
                <Image
                  src={texture.path}
                  alt={texture.name}
                  width={400}
                  height={255}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-center text-sm font-semibold uppercase tracking-wide">
                {texture.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
</Bounded>

    </section>
  );
};

export default ColorChanger;
