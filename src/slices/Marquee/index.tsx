import { FC, Fragment } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { LogoMark } from "@/components/LogoMark";
import clsx from "clsx";

/**
 * Props for `Marquee`.
 */
export type MarqueeProps = SliceComponentProps<Content.MarqueeSlice>;

/**
 * Component for "Marquee" Slices.
 */
const Marquee: FC<MarqueeProps> = ({ slice }) => {
  const MarqueeContent = () => (
    <div className="flex items-center bg-neutral-900 py-10 whitespace-nowrap">
  {slice.primary.phrases.map((item, i) => (
    <Fragment key={i}>
      <div className="font-bold-slanted px-14 text-[180px] leading-none uppercase text-neutral-600 [text-box:trim-both_cap_alphabetic] md:text-[260px]">
        {item.text}
      </div>
      <LogoMark className="size-36 flex-shrink-0 text-neutral-500" />
    </Fragment>
  ))}
</div>

  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative border-y border-white/20 bg-gradient-to-b from-[#0a0f2d] to-[#00111a]"
    >
      <div
        className="relative flex w-full items-center overflow-hidden select-none"
        aria-hidden="true"
        role="presentation"
      >
        <div className="relative flex items-center whitespace-nowrap">
          <div
            className={clsx(
              "marquee-track animate-marquee flex",
              slice.primary.direction === "Right" &&
                "[animation-direction:reverse]"
            )}
          >
            {/* Content to duplicate */}
            <MarqueeContent />
            <MarqueeContent />
            <MarqueeContent />
            <MarqueeContent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
