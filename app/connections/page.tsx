import type { Metadata } from "next";
import { HorizontalLine } from "@/app/components/HorizontalLine";
import { GridWrapper } from "@/app/components/GridWrapper";

type Connection = {
  name: string;
  profile_picture: string;
  socialLink: string;
  isConnected: boolean;
  connectedDate?: Date;
  role?: string;
};

export const metadata: Metadata = {
  title: "Connections | Abhijit Satyaki",
  description: "An evolving list of people I've met and those I wish to meet across the Indian and global developer community.",
};

const connections: Connection[] = [
  // Current just met (least popular / peer devs from college & research)
  // Popular Indian developers to connect with
  {
    name: "Harkirat Singh",
    role: "Founder, 100xDevs",
    profile_picture: "https://github.com/hkirat.png",
    socialLink: "https://x.com/kirat_tw",
    isConnected: false,
  },
  {
    name: "Hitesh Choudhary",
    role: "Chai aur Code",
    profile_picture: "https://github.com/hiteshchoudhary.png",
    socialLink: "https://x.com/Hiteshdotcom",
    isConnected: false,
  },
  {
    name: "Akshay Saini",
    role: "Namaste JavaScript",
    profile_picture: "https://github.com/akshaymarch7.png",
    socialLink: "https://x.com/akshaymarch7",
    isConnected: false,
  },
  {
    name: "Piyush Garg",
    role: "Full Stack Creator",
    profile_picture: "https://github.com/piyushgarg-dev.png",
    socialLink: "https://x.com/piyushgarg_dev",
    isConnected: false,
  },
  {
    name: "Raj Vikramaditya",
    role: "takeUforward (Striver)",
    profile_picture: "https://github.com/striver7.png",
    socialLink: "https://x.com/takeUforward_",
    isConnected: false,
  },
  {
    name: "Kunal Kushwaha",
    role: "WeMakeDevs",
    profile_picture: "https://github.com/kunal-kushwaha.png",
    socialLink: "https://x.com/kunalstwt",
    isConnected: false,
  },
  {
    name: "Tanay Pratap",
    role: "Founder, Invact",
    profile_picture: "https://github.com/tanaypratap.png",
    socialLink: "https://x.com/tanaypratap",
    isConnected: false,
  },
  {
    name: "Sanket Singh",
    role: "Staff Engineer & Educator",
    profile_picture: "https://github.com/singhsanket143.png",
    socialLink: "https://x.com/sanket_singh21",
    isConnected: false,
  },
  {
    name: "Anurag Hazra",
    role: "Open Source Creator",
    profile_picture: "https://github.com/anuraghazra.png",
    socialLink: "https://x.com/anuraghazru",
    isConnected: false,
  },
  {
    name: "Swapnil Agarwal",
    role: "Open Source Builder",
    profile_picture: "https://github.com/swapagarwal.png",
    socialLink: "https://x.com/swapagarwal",
    isConnected: false,
  },
  {
    name: "Tapas Adhikary",
    role: "Tech Educator",
    profile_picture: "https://github.com/tapasadhikary.png",
    socialLink: "https://x.com/tapasadhikary",
    isConnected: false,
  },
  {
    name: "Prateek Narang",
    role: "Coding Minutes",
    profile_picture: "https://github.com/prateekiiest.png",
    socialLink: "https://x.com/prateekiiest",
    isConnected: false,
  },
  {
    name: "Siddharth Kshetrapal",
    role: "Design Systems",
    profile_picture: "https://github.com/siddharthkp.png",
    socialLink: "https://x.com/siddharthkp",
    isConnected: false,
  },
  {
    name: "Aniket Sinha",
    role: "Dev Educator",
    profile_picture: "https://github.com/AniketSinha24.png",
    socialLink: "https://x.com/AniketSinha_",
    isConnected: false,
  },
];

export default function ConnectionsPage() {
  const sortedConnections = [...connections].sort((a, b) => {
    if (a.isConnected !== b.isConnected) {
      return a.isConnected ? -1 : 1;
    }
    if (a.isConnected && b.isConnected && a.connectedDate && b.connectedDate) {
      return b.connectedDate.getTime() - a.connectedDate.getTime();
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="relative space-y-16 pb-20">
      <GridWrapper>
        <h1 className="mx-auto mt-16 max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
          An evolving list of people I&apos;ve met and those I wish to meet.
        </h1>
      </GridWrapper>

      <div className="relative">
        <div className="relative mb-12 grid auto-rows-auto grid-cols-2 place-items-center justify-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          <span className="absolute top-0">
            <HorizontalLine />
          </span>
          {sortedConnections.map((person) => (
            <a
              key={person.name}
              href={person.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group no-underline transition-all duration-500"
            >
              <div className="group inline-block text-center">
                <div
                  className={`relative h-28 w-28 rounded-[20px] border border-border-primary bg-bg-primary p-2 transition-all duration-300 ${
                    person.isConnected
                      ? "border-indigo-400 group-hover:-translate-y-3 group-hover:shadow-lg group-hover:shadow-indigo-500/10"
                      : "group-hover:-translate-y-2 group-hover:border-border-secondary"
                  }`}
                >
                  {person.isConnected && person.connectedDate ? (
                    <div className="absolute -bottom-2 left-1/2 w-full -translate-x-1/2 text-nowrap rounded-full bg-indigo-500 px-1.5 py-0.5 text-center text-[10px] font-medium text-white shadow">
                      <span>
                        Met on{" "}
                        <time>
                          {person.connectedDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })}
                        </time>
                      </span>
                    </div>
                  ) : null}
                  <div
                    className="grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0]"
                    style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
                  >
                    <img
                      className={`h-14 w-14 rounded-full object-cover transition-all duration-300 ${
                        !person.isConnected
                          ? "grayscale group-hover:grayscale-0"
                          : ""
                      }`}
                      alt={person.name}
                      src={person.profile_picture}
                      loading="lazy"
                    />
                  </div>
                </div>
                {person.name && (
                  <div className="mt-3 max-w-[120px]">
                    <p className="truncate text-xs font-medium text-text-primary group-hover:text-indigo-600">
                      {person.name}
                    </p>
                    {person.role && (
                      <p className="truncate text-[10px] text-text-secondary">
                        {person.role}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </a>
          ))}
          <span className="absolute bottom-0">
            <HorizontalLine />
          </span>
        </div>
      </div>
    </div>
  );
}