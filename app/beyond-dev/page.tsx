import { Metadata } from "next";
import { GridWrapper } from "@/app/components/GridWrapper";
import { listBeyondDevItems } from "@/app/lib/db/admin";
import { BeyondDevView } from "./BeyondDevView";

export const metadata: Metadata = {
  title: "Beyond Dev | Abhijit Satyaki",
  description:
    "A curated collection of books, PDFs, drive links, and philosophical takeaways that inspire my work and life beyond development.",
};

export default async function BeyondDevPage() {
  const items = await listBeyondDevItems().catch(() => []);

  return (
    <div className="space-y-12 pb-20">
      {/* Page Header */}
      <div className="pt-14 md:pt-16">
        <GridWrapper>
          <div className="space-y-4 text-center">
            <span className="inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
              Beyond Dev
            </span>
            <h1 className="mx-auto max-w-2xl text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
              Beyond Code &amp; Engineering
            </h1>
            <p className="mx-auto max-w-xl text-base text-text-secondary sm:text-lg">
              Books, PDFs, research materials, and intellectual rabbit holes that
              shape my worldview, design philosophy, and life.
            </p>
          </div>
        </GridWrapper>
      </div>

      {/* Main Content Area */}
      <GridWrapper>
        <div className="mt-4">
          <BeyondDevView items={items} />
        </div>
      </GridWrapper>
    </div>
  );
}
