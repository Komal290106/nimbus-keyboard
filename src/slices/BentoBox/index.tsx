"use client";

import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import { FadeIn } from "@/components/FadeIn";
import { GradientTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

/**
 * Props for `BentoBox`.
 */
export type BentoBoxProps = SliceComponentProps<Content.BentoBoxSlice>;

/**
 * Just the gradient mesh — no Canvas here.
 */
function GradientBackground() {
  return (
    <mesh scale={[50, 50, 1]} position={[0, 0, -10]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial>
        <GradientTexture
          stops={[0, 1]} // top → bottom
          colors={["#0a0f2d", "#00111a"]} // dark blue shades
          size={1024}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

const BentoBox: FC<BentoBoxProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative py-20 md:py-32 text-white"
    >
      {/* Background Canvas (only once) */}
      <div className="absolute inset-0 -z-10">
        <Canvas orthographic camera={{ zoom: 80, position: [0, 0, 5] }}>
          <GradientBackground />
        </Canvas>
      </div>

      <Bounded>
        <FadeIn>
          <h2
            id="features"
            className="mb-12 scroll-pt-6 font-display text-5xl font-extrabold uppercase drop-shadow-lg md:text-7xl"
          >
            <PrismicText field={slice.primary.heading} />
          </h2>
        </FadeIn>

        <FadeIn
          targetChildren
          className="grid grid-cols-1 gap-6 md:grid-cols-6"
        >
          {slice.primary.items.map((item) => (
            <BentoBoxItem key={asText(item.text)} item={item} />
          ))}
        </FadeIn>
      </Bounded>
    </section>
  );
};

export default BentoBox;

type BentoBoxItemProps = {
  item: Content.BentoBoxSliceDefaultPrimaryItemsItem;
};

function BentoBoxItem({ item }: BentoBoxItemProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl shadow-lg shadow-black/0",
        item.size === "Small" && "md:col-span-2",
        item.size === "Medium" && "md:col-span-3",
        item.size === "Large" && "md:col-span-4"
      )}
    >
      <PrismicNextImage
        field={item.image}
        className="h-full w-full object-cover"
        quality={96}
        width={700}
      />

      {/* darker gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000814]/90 via-[#001540]/40 to-transparent" />

      {/* text overlay */}
      <div className="absolute bottom-0 left-0 max-w-xl p-6 text-lg md:text-xl text-white font-medium leading-snug drop-shadow-md">
        <PrismicRichText field={item.text} />
      </div>
    </div>
  );
}
