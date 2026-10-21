import { BentoCard } from "./BentoCard";

export function CurrentlyReadingBento() {
  return (
    <BentoCard height="h-full" className="group">
      <h2 className="mb-2 font-medium">Currently Reading</h2>
      <div className="relative h-full">
        <div className="absolute left-6 top-4 h-full origin-bottom-left transition-transform duration-300 ease-in-out group-hover:-rotate-3">
          <BookCover />
        </div>
      </div>
      {/* Subtle bottom fade to blend with card footer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
    </BentoCard>
  );
}

function BookCover() {
  return (
    <div className="relative aspect-[2/3] h-full w-80 overflow-hidden rounded-lg bg-zinc-950 shadow-2xl ring-1 ring-black/10">
      <div className="absolute left-4 top-0 z-10 h-full w-2 bg-slate-900/40 blur-sm"></div>
      <img
        src="/doomsday_manga_cover.jpg"
        alt="Doomsday: Doctor Doom - Marvel Manga"
        className="h-full w-full object-cover object-left-top"
      />
    </div>
  );
}
