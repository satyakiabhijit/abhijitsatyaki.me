import { BgGradient } from "./components/BgGradient";
import { StatsBento } from "./components/StatsBento";
import { SpeakingBento } from "./components/SpeakingBento";
import { CommunityWallBento } from "./components/CommunityWallBento";
import { CalendarBento } from "./components/CalendarBento";
import { ToolboxBento } from "./components/ToolboxBento";
import { ConnectionsBento } from "./components/ConnectionsBento";
import { AnimatedProfilePicture } from "./components/AnimatedProfilePicture";
import { AnimatedText } from "./components/AnimatedText";
import { PhotoGallery } from "./components/PhotoGallery";
import { AboutMeBento } from "./components/AboutMeBento";
import { AnimatedMobilePhotos } from "./components/AnimatedMobilePhotos";
import { GridWrapper } from "./components/GridWrapper";
import { ProjectMiniCard } from "./components/ProjectMiniCard";


const homeFeaturedProjects = [
  {
    title: "Resumelyze",
    category: "AI & Full Stack",
    summary:
      "Serverless ATS resume analyzer with Google Gemini AI, TF-IDF keyword parsing, and sub-second cold starts.",
    image: "/projects/resumelyze.png",
    link: "https://resumelyze-eta.vercel.app/",
    github: "https://github.com/satyakiabhijit/resumelyze",
    technologies: ["Next.js 14", "Gemini AI", "TypeScript", "TF-IDF"],
  },
  {
    title: "Kairo",
    category: "Browser Extension",
    summary:
      "Cross-browser extension (MV3) capturing AI chat context into reusable Capsules across multiple LLM interfaces.",
    image: "/projects/kairo.png",
    link: "https://github.com/satyakiabhijit/Kairo",
    github: "https://github.com/satyakiabhijit/Kairo",
    technologies: ["JavaScript", "Chrome MV3", "Service Workers", "LLM Context"],
  },
  {
    title: "BookOnGo",
    category: "Full Stack",
    summary:
      "Complete booking platform with JWT authentication, Stripe payments, real-time availability, and admin dashboard.",
    image: "/projects/bookongo.png",
    link: "https://bookongo.dev",
    github: "https://github.com/satyakiabhijit/bookongo",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
  },
];

export default async function Home() {
  const PROFILE_DELAY = 0;
  const HEADING_DELAY = PROFILE_DELAY + 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;
  const PHOTOS_DELAY = PARAGRAPH_DELAY + 0.1;

  return (
    <section>
      <AnimatedProfilePicture delay={PROFILE_DELAY} />
      <div className="mt-6 space-y-10 md:mt-0 md:space-y-16">
        <section>
          <div className="relative text-balance">
            <GridWrapper>
              <AnimatedText
                as="h1"
                delay={HEADING_DELAY}
                className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]"
              >
                Hey, I&apos;m Abhijit! <br /> Welcome to my corner of the
                internet!
              </AnimatedText>
            </GridWrapper>
            <GridWrapper>
              <div className="mt-4 text-center md:mt-8">
                <AnimatedText
                  as="p"
                  delay={PARAGRAPH_DELAY}
                  className="leading-8 text-text-secondary"
                >
                  I&apos;m a full-stack developer with a passion for research,
                  open-source, and building things that matter. This site is my
                  playground - where I share projects, publications, and
                  experiments!
                </AnimatedText>
              </div>
            </GridWrapper>

            {/* Resume & Contact CTAs */}
            <GridWrapper>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-8">
                <a
                  href="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg
                    className="h-4 w-4 transition-transform group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  <span>View Resume</span>
                  <svg
                    className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-5 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-indigo-400 hover:bg-bg-secondary hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Get in touch</span>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                </a>
              </div>
            </GridWrapper>
          </div>
          <div>
            {/* Desktop Photos */}
            <div className="relative hidden h-fit w-full items-center justify-center lg:flex">
              <PhotoGallery animationDelay={PHOTOS_DELAY} />
            </div>

            {/* Mobile Photos */}
            <AnimatedMobilePhotos delay={PHOTOS_DELAY} />
          </div>
        </section>

        {/* About Section */}
        <section className="relative space-y-10 md:space-y-16">
          <div className="space-y-4">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>About</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="mx-auto max-w-lg text-balance text-center text-3xl font-medium leading-10 tracking-tight text-text-primary md:text-4xl">
                Here&apos;s what sets me apart and makes me unique
              </h2>
            </GridWrapper>
          </div>

          <GridWrapper>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12 lg:grid-rows-[14]">
              <div className="col-span-1 md:col-span-5 lg:col-span-5 lg:row-span-6">
                <AboutMeBento linkTo="/about" />
              </div>

              <div className="md:col-span-12 lg:col-span-7 lg:row-span-8">
                <ConnectionsBento linkTo="/connections" />
              </div>

              <div className="md:col-span-7 md:row-start-1 lg:col-span-5 lg:row-span-7">
                <ToolboxBento linkTo="/toolbox" />
              </div>

              <div className="md:col-span-12 lg:col-span-7 lg:row-span-5">
                <CalendarBento />
              </div>
            </div>
          </GridWrapper>
        </section>

        {/* Projects & Research Section */}
        <section className="relative space-y-10 md:space-y-16">
          <div className="relative space-y-4 text-balance">
            <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
              <BgGradient />
            </span>
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>Projects</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="mx-auto max-w-lg text-center text-3xl font-medium leading-10 tracking-tighter text-text-primary md:text-4xl">
                Building things at the intersection of code &amp; research
              </h2>
            </GridWrapper>
          </div>

          <div className="z-10">
            <GridWrapper>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {homeFeaturedProjects.map((project) => (
                  <ProjectMiniCard
                    key={project.title}
                    title={project.title}
                    category={project.category}
                    summary={project.summary}
                    image={project.image}
                    link={project.link}
                    github={project.github}
                    technologies={project.technologies}
                  />
                ))}
              </div>
            </GridWrapper>
          </div>

          <div className="z-10">
            <GridWrapper>
              <div className="text-center">
                <a
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-6 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-indigo-400 hover:text-text-primary hover:shadow-md"
                >
                  <span>View all projects</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>
              </div>
            </GridWrapper>
          </div>
        </section>

        {/* My Site Section */}
        <section className="relative space-y-10 md:space-y-16">
          <div className="space-y-4 text-balance">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>Explore</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="text-center text-3xl font-medium leading-10 tracking-tighter text-text-primary md:mx-auto md:max-w-lg md:text-4xl">
                My site is a playful sandbox. Explore, experiment, &amp; say hello
              </h2>
            </GridWrapper>
          </div>

          <GridWrapper>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              <span className="col-span-1 h-[276px] sm:block md:hidden lg:block">
                <StatsBento />
              </span>
              <SpeakingBento />
              <CommunityWallBento />
            </div>
          </GridWrapper>
        </section>
      </div>
    </section>
  );
}
