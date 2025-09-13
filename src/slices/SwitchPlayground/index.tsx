"use client";

import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { SOUND_MAP, Switch } from "@/components/Switch";
import { Stage, GradientTexture } from "@react-three/drei";
import gsap from "gsap";
import { LuVolume2 } from "react-icons/lu";

export type SwitchPlaygroundProps =
  SliceComponentProps<Content.SwitchPlaygroundSlice>;

const SwitchPlayground: FC<SwitchPlaygroundProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative text-white"
      innerClassName="flex flex-col justify-center"
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

      <FadeIn>
        <h2
          id="switch-playground"
          className="font-bold-slanted scroll-pt-6 text-6xl uppercase md:text-8xl drop-shadow-lg"
        >
          <PrismicText field={slice.primary.heading} />
        </h2>

        <div className="mb-6 max-w-4xl text-xl text-pretty text-white/90">
          <PrismicRichText field={slice.primary.description} />
        </div>

        <FadeIn
          targetChildren
          className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2"
        >
          {slice.primary.switches.map((item) =>
            isFilled.contentRelationship(item.switch) ? (
              <SharedCanvas key={item.switch.id} color={item.switch} />
            ) : null
          )}
        </FadeIn>
      </FadeIn>
    </Bounded>
  );
};

export default SwitchPlayground;

type SharedCanvasProps = {
  color: Content.SwitchPlaygroundSliceDefaultPrimarySwitchesItem["switch"];
};

const SharedCanvas = ({ color }: SharedCanvasProps) => {
  if (!isFilled.contentRelationship(color) || !color.data) return null;

  const colorName = color.uid as "red" | "brown" | "blue" | "black";
  const { color: hexColor, name } = color.data;

  const handleSound = () => {
    const selectedSound = gsap.utils.random(SOUND_MAP[colorName]);
    const audio = new Audio(selectedSound);
    audio.volume = 0.6;
    audio.play();
  };

  return (
    <div className="group relative min-h-96 overflow-hidden rounded-3xl select-none">
      {/* Text button */}
      <button
        onClick={handleSound}
        className="font-display absolute bottom-0 left-0 z-10 flex items-center gap-3 
                   px-6 py-3 text-2xl md:text-3xl uppercase text-white border border-white/50 
                   rounded-xl backdrop-blur-sm transition-all duration-300
                   hover:bg-white/10 hover:border-white hover:shadow-lg hover:shadow-white/20"
      >
        {name} <LuVolume2 className="size-6" />
      </button>

      {/* Canvas */}
      <Canvas camera={{ position: [1.5, 2, 0], fov: 7 }}>
        <Stage adjustCamera intensity={0.5} shadows="contact" environment="city">
          <Switch
            rotation={[0, Math.PI / 4, 0]}
            color={colorName}
            hexColor={hexColor || ""}
          />
        </Stage>
      </Canvas>

      {/* Overlay background effect */}
      <div
        className={clsx(
          "font-black-slanted absolute inset-0 -z-10 grid place-items-center"
        )}
      >
        <svg className="pointer-events-none h-auto w-full" viewBox="0 0 75 100">
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={18}
            className="font-display fill-white/10 uppercase mix-blend-overlay 
                       group-hover:fill-white/40 transition-all duration-700"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <tspan key={i} x={`${(i + 1) * 10}%`} dy={i === 0 ? -40 : 14}>
                {colorName}
                {colorName}
                {colorName}
              </tspan>
            ))}
          </text>
        </svg>
      </div>
    </div>
  );
};
