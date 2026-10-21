import { softwareData } from "../data/toolbox";
import { BentoCard } from "./BentoCard";

const featuredTitles = ["TypeScript", "React", "Next.js", "Python", "VS Code"];
const featuredTools = featuredTitles
  .map((title) => softwareData.find((s) => s.title === title))
  .filter(Boolean) as typeof softwareData;

const items = (featuredTools.length === 5 ? featuredTools : softwareData.slice(0, 5)).map(
  (item, index) => (
    <div key={item.title} className="group inline-block text-center">
      <div
        className={`rounded-[20px] border border-border-primary bg-bg-primary p-2 transition-all duration-500 group-hover:border-indigo-400 ${
          index === 2
            ? "delay-0 group-hover:-translate-y-3"
            : index === 1 || index === 3
              ? "delay-100 group-hover:-translate-y-3"
              : "delay-200 group-hover:-translate-y-3"
        }`}
        style={{
          width: index === 2 ? 130 : 110,
          height: index === 2 ? 130 : 110,
        }}
      >
        <div
          className="grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0]"
          style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
        >
          <img
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
            alt={item.title}
            src={item.imgSrc}
          />
        </div>
      </div>
    </div>
  )
);

export function ToolboxBento({ linkTo }: { linkTo?: string }) {
  return (
    <BentoCard linkTo={linkTo} height="md:h-[304px] lg:h-[300px]">
      <div className="group-hover:from-bg-white absolute inset-y-0 left-0 z-20 w-1/5 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none"></div>
      <div className="group-hover:from-bg-white absolute inset-y-0 right-0 z-20 w-1/5 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none"></div>
      <div className="z-20 text-center">
        <h2 className="text-base font-medium">Toolbox</h2>
        <p className="mt-1 text-text-secondary">
          Check out my favorite tools and technologies.
        </p>
      </div>
      <div className="mt-10 flex items-center justify-center gap-3 transition-all duration-500 ease-in-out md:mt-12">
        {items}
      </div>
    </BentoCard>
  );
}
