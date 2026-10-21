import { ResumeData } from "../lib/resume/types";
import { Timeline } from "./Timeline";

const resumeData: ResumeData = {
  experiences: [
    {
      company: "EduLinkUp",
      period: "2025 - Present",
      positions: [
        {
          title: "Founding Member & Software Developer",
          description: [
            "Built full-stack features using React.js, Node.js, and MongoDB for an ed-tech platform connecting students and educators.",
            "Led end-to-end testing and iterative releases working closely with cross-functional teams.",
          ],
        },
      ],
    },
    {
      company: "Pinnacle Labs",
      period: "Jul - Aug 2025",
      positions: [
        {
          title: "Web Development Intern",
          description: [
            "Developed and optimized responsive web application components using modern frontend frameworks.",
            "Applied best practices in performance, cross-browser compatibility, and user experience.",
          ],
        },
      ],
    },
    {
      company: "Haldia Institute of Technology",
      period: "Jun - Jul 2025",
      positions: [
        {
          title: "Research Intern - Cybersecurity",
          description: [
            "Built a POCT security framework using Zero-Knowledge Proofs (ZKP) and Merkle Hash Trees (MHT) for IoMT data protection.",
            "Contributed to a co-authored SCOPUS-indexed publication on privacy-preserving security mechanisms.",
          ],
        },
      ],
    },
    {
      company: "Tech & Talent",
      period: "Sep - Oct 2024",
      positions: [
        {
          title: "Web Development Intern",
          description: [
            "Customized WordPress themes and plugins, improving site performance and UX.",
            "Implemented responsive design practices and provided technical maintenance support.",
          ],
        },
      ],
    },
    {
      company: "Haldia Institute of Technology",
      period: "Jun - Aug 2024",
      positions: [
        {
          title: "Research Intern - IoMT Systems",
          description: [
            "Optimized IoMT data pipeline achieving 98%+ reliability and 8.9% energy reduction using compressed sensing.",
            "Published findings in IEEE proceedings presented at IIT Rourkela (DOI: 10.1109/ISED63599.2024.10957180).",
          ],
        },
      ],
    },
  ],
  avatarUrl: "/static/Abhijit.png",
};

export function Resume() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative">
          <div className="divide-y divide-gray-100">
            {resumeData.experiences.map((experience, expIdx) => (
              <div
                key={`${experience.company}-${experience.period}-${expIdx}`}
                className="grid grid-cols-[1fr,5fr] gap-6 py-12 first:pt-0 last:pb-0 md:grid-cols-[2fr,1fr,4fr]"
              >
                <div className="hidden md:block">
                  <h3 className="text-xl font-bold">{experience.company}</h3>
                  <p className="text-sm text-gray-600">{experience.period}</p>
                </div>

                <div />

                <div className="space-y-6">
                  {experience.positions.map((position, index) => (
                    <div
                      key={`${experience.company}-${index}`}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-semibold">
                        {position.title}
                      </h4>
                      <div className="space-y-3">
                        {position.description.map((desc, i) => (
                          <p key={i} className="text-gray-600">
                            {desc}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-0 h-full w-8 md:left-[calc(28%_-_1rem)]">
            <Timeline avatarUrl={resumeData.avatarUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
