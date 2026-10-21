import { GridWrapper } from "@/app/components/GridWrapper";
import { Resume } from "@/app/components/Resume";
import { Education } from "@/app/components/Education";
import { ShadowBox } from "@/app/components/ShadowBox";
import { ConnectionsBento } from "@/app/components/ConnectionsBento";
import { StatsBento } from "@/app/components/StatsBento";
import { CurrentlyReadingBento } from "@/app/components/CurrentlyReadingBento";
import { ScrapbookBento } from "@/app/components/ScrapbookBento";
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { CurrentlyPlayingBento } from "@/app/components/CurrentlyPlayingBento";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Abhijit Satyaki",
  description: "Learn more about Abhijit Satyaki - full-stack developer, researcher, and open-source builder from India.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      <div>
        <div className="space-y-4">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>About</span>
            </div>
          </GridWrapper>
          <GridWrapper>
            <h1 className="mx-auto max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
              A little bit about me
            </h1>
          </GridWrapper>
        </div>

        <GridWrapper>
          <div className="mt-12 space-y-24">

            {/* Section 1 - Getting Started */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-8 lg:pl-12">
              <div className="flex flex-col items-center text-left lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <img
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[5deg] rounded-lg object-cover shadow"
                      src="/Abhijit.png"
                      alt="Abhijit Satyaki"
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  The Beginning
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I&apos;m Abhijit Satyaki, a results-driven Full Stack Developer from Jalpaiguri, West Bengal, India. My journey started with a Diploma in Civil Engineering - yes, a completely different field! But the pull of technology and problem-solving was irresistible.
                </p>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I discovered programming and immediately knew this was my path. Self-taught through nights and weekends, I fell in love with the web - the ability to build something from nothing and ship it to the world is endlessly exciting to me.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <img
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[5deg] rounded-lg object-cover shadow"
                    src="/Abhijit.png"
                    alt="Abhijit Satyaki"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 - Research & Development */}
            <div className="grid grid-cols-1 gap-8 pr-12 lg:grid-cols-2 lg:items-center lg:justify-between">
              <div className="flex flex-col items-center text-left lg:order-2 lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <img
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-5deg] rounded-lg object-cover shadow"
                      src="/abhijit_photo_2.jpg"
                      alt="Research work"
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Code Meets Research
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  What makes my path unique is the intersection of software development and academic research. I&apos;ve had the privilege of interning at Haldia Institute of Technology twice - once on IoMT data optimization (published in IEEE, presented at IIT Rourkela) and once on cybersecurity frameworks for IoMT.
                </p>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  With 3+ peer-reviewed publications (IEEE + SCOPUS-indexed) and ongoing research in antenna design and explainable ML, I bring a research mindset to every product I build. Rigor, curiosity, and shipping - that&apos;s my combination.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <img
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-5deg] rounded-lg object-cover shadow"
                    src="/abhijit_photo_2.jpg"
                    alt="Research work"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 - Projects & Open Source */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-8 lg:pl-12">
              <div className="flex flex-col items-center text-left lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <img
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                      src="/abhijit_photo_3.jpg"
                      alt="Building projects"
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Building Real Things
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I believe in shipping. With 15+ deployed projects and 5 internships under my belt, I&apos;ve built everything from Kairo (a cross-browser AI context extension) to Resumelyze (an AI-powered ATS resume analyzer) to BookOnGo (a full-stack booking platform).
                </p>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  Completed my B.Tech in Information Technology at Jalpaiguri Government Engineering College and co-founded EduLinkUp - an ed-tech platform connecting students with opportunities.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <img
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                    src="/abhijit_photo_3.jpg"
                    alt="Building projects"
                  />
                </div>
              </div>
            </div>

          </div>
        </GridWrapper>
      </div>

      {/* Experience Section */}
      <div className="relative space-y-8 text-center">
        <div className="space-y-4">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Experience</span>
            </div>
          </GridWrapper>
          <GridWrapper>
            <h2 className="mx-auto max-w-lg text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
              My work history and achievements timeline.
            </h2>
          </GridWrapper>
        </div>
      </div>
      <div className="space-y-16">
        <GridWrapper>
          <Resume />
        </GridWrapper>
      </div>

      {/* Education Section */}
      <div className="relative space-y-8 text-center pt-10">
        <div className="space-y-4">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Education</span>
            </div>
          </GridWrapper>
          <GridWrapper>
            <h2 className="mx-auto max-w-lg text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
              Academic background & qualifications.
            </h2>
          </GridWrapper>
        </div>
      </div>
      <div className="space-y-16">
        <GridWrapper>
          <Education />
        </GridWrapper>
      </div>

      {/* More Section */}
      <section className="relative space-y-16">
        <div className="space-y-4">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>More</span>
            </div>
          </GridWrapper>
          <GridWrapper>
            <h2 className="mx-auto max-w-lg text-balance text-center text-3xl font-medium leading-10 tracking-tight text-text-primary">
              Here&apos;s what sets me apart and makes me unique
            </h2>
          </GridWrapper>
        </div>

        <GridWrapper>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
            <div className="lg:col-span-3 lg:row-span-6">
              <CurrentlyPlayingBento />
            </div>
            <div className="hidden lg:col-span-7 lg:row-span-5 lg:block">
              <ScrapbookBento />
            </div>
            <div className="hidden lg:col-span-2 lg:col-start-11 lg:row-span-10 lg:block lg:min-h-[50px]">
              <CurrentlyReadingBento />
            </div>
            <div className="lg:col-span-7 lg:row-span-8">
              <ConnectionsBento linkTo="/connections" />
            </div>
            <div className="lg:col-span-3 lg:row-span-4">
              <StatsBento />
            </div>
          </div>
        </GridWrapper>
      </section>

      <NewsletterSignUp />
    </div>
  );
}
