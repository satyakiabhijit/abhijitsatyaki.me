import React from "react";

interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  grade: string;
  description: string;
  courses: string[];
}

const educationData: EducationItem[] = [
  {
    degree: "B.Tech in Information Technology",
    institution: "Jalpaiguri Government Engineering College (JGEC)",
    period: "2023 - 2026",
    location: "Jalpaiguri, West Bengal",
    grade: "CGPA: 7.3",
    description:
      "Completed Bachelor of Technology in Information Technology. Built strong foundations in full-stack web development, data structures, cloud architectures, and machine learning, with active research publications in IoMT and antenna optimization.",
    courses: [
      "Data Structures & Algorithms",
      "Full-Stack Web Technologies",
      "Database Management Systems",
      "Computer Networks",
      "Machine Learning & AI",
      "Internet of Medical Things (IoMT)",
    ],
  },
  {
    degree: "Diploma in Civil Engineering",
    institution: "Rajganj Government Polytechnic",
    period: "2020 - 2022",
    location: "Jalpaiguri, West Bengal",
    grade: "OGPA: 7.9",
    description:
      "Completed three-year engineering diploma with distinction. Developed deep analytical thinking, quantitative problem-solving skills, and a rigorous engineering methodology.",
    courses: [
      "Engineering Mathematics",
      "Structural Analysis",
      "Computer-Aided Design",
      "Analytical Problem Solving",
      "Project Management",
    ],
  },
];

export function Education() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {educationData.map((item) => (
          <div
            key={item.degree}
            className="group relative flex flex-col justify-between rounded-2xl border border-border-primary/60 bg-bg-primary p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div>
              {/* Header: Period & Grade Badge */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  {item.period}
                </span>
                <span className="rounded-full border border-border-primary/70 bg-bg-secondary/40 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                  {item.grade}
                </span>
              </div>

              {/* Degree Title */}
              <h3 className="mb-1 text-xl font-semibold tracking-tight text-text-primary group-hover:text-indigo-600 transition-colors">
                {item.degree}
              </h3>

              {/* Institution & Location */}
              <div className="mb-4 flex items-center text-sm text-text-secondary">
                <svg
                  className="mr-1.5 h-4 w-4 shrink-0 text-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                  />
                </svg>
                <span>{item.institution}</span>
              </div>

              {/* Description */}
              <p className="mb-5 text-sm leading-6 text-text-secondary">
                {item.description}
              </p>
            </div>

            {/* Course tags */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary/70">
                Key Focus & Coursework
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.courses.map((course) => (
                  <span
                    key={course}
                    className="rounded-md border border-border-primary/50 bg-bg-secondary/20 px-2 py-0.5 text-xs text-text-secondary"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}