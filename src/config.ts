export const config = {
    developer: {
        name: "Abhijit",
        fullName: "Abhijit Satyaki",
        title: "Full Stack Developer",
        description: "Full Stack Developer skilled in MERN stack, REST APIs, and responsive frontend development. Track record spanning 5 internships, 15+ deployed projects, and 3+ peer-reviewed publications (IEEE + SCOPUS)."
    },
    social: {
        github: "satyakiabhijit",
        email: "abhijitsatyaki29@gmail.com",
        location: "Jalpaiguri, India"
    },
    about: {
        title: "About Me",
        description: "I'm Abhijit Satyaki, a results-driven Full Stack Developer from India, skilled in the MERN stack, REST APIs, and responsive frontend development. My work spans web development, AI-assisted tools, and research-focused projects in IoMT security and data optimization. With 5 internships, 15+ deployed projects, and 3+ peer-reviewed publications (IEEE + SCOPUS), I build end-to-end solutions — from booking platforms and AI-powered tools to browser extensions with real users. Currently pursuing B.Tech in Information Technology at Jalpaiguri Government Engineering College."
    },
    experiences: [
        {
            position: "Founding Member & Software Developer",
            company: "EduLinkUp",
            period: "2025 - Present",
            location: "Remote",
            description: "Built full stack features with React.js, Node.js, and MongoDB. Led end-to-end testing and iterative releases with cross-functional teams.",
            responsibilities: [
                "Built full stack features using React.js, Node.js, and MongoDB",
                "Conducted end-to-end testing and iterative releases",
                "Collaborated with cross-functional teams on product delivery",
                "QA engineering and quality assurance processes"
            ],
            technologies: ["React.js", "Node.js", "MongoDB", "QA", "E2E Testing"]
        },
        {
            position: "Web Development Intern",
            company: "Pinnacle Labs",
            period: "Jul - Aug 2025",
            location: "Remote",
            description: "Developed and optimized web application components using modern frontend frameworks and best practices.",
            responsibilities: [
                "Developed responsive web application components",
                "Optimized frontend performance and user experience",
                "Applied modern frontend frameworks and best practices",
                "Built cross-browser compatible interfaces"
            ],
            technologies: ["React", "JavaScript", "CSS3", "UI/UX"]
        },
        {
            position: "Research Intern — Cybersecurity",
            company: "Haldia Institute of Technology",
            period: "Jun - Jul 2025",
            location: "Haldia, West Bengal",
            description: "Built POCT security framework (ZKP + MHT) for IoMT data protection. Contributed to accepted SCOPUS-indexed publication.",
            responsibilities: [
                "Built POCT security framework using ZKP and MHT",
                "Contributed to IoMT data protection research",
                "Co-authored SCOPUS-indexed publication",
                "Implemented privacy-preserving security mechanisms"
            ],
            technologies: ["Python", "Cryptography", "ZKP", "MHT", "IoMT"]
        },
        {
            position: "Web Development Intern",
            company: "Tech & Talent",
            period: "Sep - Oct 2024",
            location: "Remote",
            description: "Customized WordPress themes and plugins. Improved site performance and UX via frontend modifications.",
            responsibilities: [
                "Customized WordPress themes and plugins",
                "Improved website performance and user experience",
                "Implemented responsive design practices",
                "Provided technical support and maintenance"
            ],
            technologies: ["WordPress", "PHP", "MySQL", "CSS", "Frontend"]
        },
        {
            position: "Research Intern — IoMT Systems",
            company: "Haldia Institute of Technology",
            period: "Jun - Aug 2024",
            location: "Haldia, West Bengal",
            description: "Optimized IoMT data pipeline: 98%+ reliability, 8.9% energy reduction. Published in IEEE proceedings at IIT Rourkela.",
            responsibilities: [
                "Optimized IoMT data pipeline achieving 98%+ reliability",
                "Achieved 8.9% energy reduction through optimization",
                "Published research in IEEE proceedings at IIT Rourkela",
                "Implemented compressed sensing techniques"
            ],
            technologies: ["Python", "Data Science", "IoT", "IoMT", "Optimization"]
        }
    ],
    education: [
        {
            title: "B.Tech in Information Technology",
            institution: "Jalpaiguri Government Engineering College",
            period: "2023 - 2026",
            location: "Jalpaiguri, West Bengal",
            description: "Pursuing B.Tech in Information Technology with CGPA: 7.3. Building strong foundations in web technologies, data structures, algorithms, and machine learning."
        },
        {
            title: "Diploma in Civil Engineering",
            institution: "Rajganj Government Polytechnic",
            period: "2020 - 2022",
            location: "Jalpaiguri, West Bengal",
            description: "Completed Diploma in Civil Engineering with OGPA: 7.9. Developed analytical thinking and a strong engineering foundation."
        }
    ],
    publications: [
        {
            id: "ble-antenna",
            title: "Implementing Secure BLE Signal Transmission using Antenna Design",
            venue: "SCOPUS-indexed Book Chapter • Handbook of Security, Quantum Computing and IoT",
            year: "2025",
            description: "Accepted in a SCOPUS-indexed book chapter focused on secure Bluetooth Low Energy signal transmission using antenna design for improved robustness in IoT environments.",
            tags: ["Bluetooth LE", "Antenna Design", "Security", "IoT", "Quantum Computing"],
            link: "https://www.routledge.com/Handbook-of-Security-Quantum-Computing-and-Internet-of-Things-IoT/Jain-Sayal-Bijalwan/p/book/9781032947013",
            status: "Published"
        },
        {
            id: "iomt-optimization",
            title: "Optimizing Sensory Data Accumulation in IoMT Framework",
            venue: "IEEE Conference • IIT Rourkela, India",
            year: "2024",
            doi: "10.1109/ISED63599.2024.10957180",
            description: "Presented at IEEE conference held at IIT Rourkela, focusing on improving IoMT data collection efficiency through optimized sensory data accumulation and compressed sensing techniques.",
            tags: ["IoMT", "Healthcare", "Data Analytics", "Machine Learning", "IEEE"],
            link: "https://ieeexplore.ieee.org/document/10957180/",
            status: "Published"
        }
    ],
    projects: [
        {
            id: 1,
            title: "Kairo",
            category: "Browser Extension",
            technologies: "JavaScript, Chrome Extension API (MV3), Content Scripts, Service Workers",
            image: "/images/kairo.png",
            description: "Cross-browser extension (MV3) saving AI chat context as reusable Capsules via content scripts, service workers, and messaging.",
            github: "https://github.com/satyakiabhijit/Kairo"
        },
        {
            id: 2,
            title: "Resumelyze",
            category: "AI / Full Stack",
            technologies: "Next.js 14, TypeScript, Gemini AI, Supabase, TF-IDF",
            image: "/images/resumelyze.png",
            description: "Serverless ATS resume analyzer with TF-IDF, Gemini AI, and Hybrid modes for PDF/DOCX/TXT. Vercel cold-start cut from 5s to under 1s.",
            github: "https://github.com/satyakiabhijit/resumelyze",
            demo: "https://resumelyze-eta.vercel.app/"
        },
        {
            id: 3,
            title: "BookOnGo",
            category: "Full Stack",
            technologies: "React, Node.js, MongoDB, Express.js, JWT, Stripe",
            image: "/images/bookongo.png",
            description: "Full stack booking platform with JWT auth, payment integration, admin dashboard, and real-time availability via Express.js API and React.",
            github: "https://github.com/satyakiabhijit/bookongo",
            demo: "https://bookongo.dev"
        },
        {
            id: 4,
            title: "GameHub",
            category: "Web App",
            technologies: "React, TypeScript, Chakra UI, RAWG API",
            image: "/images/project-4.webp",
            description: "A polished gaming platform featuring 100+ free games with a lightweight, modern browsing experience and responsive design.",
            github: "https://github.com/satyakiabhijit/gamehub",
            demo: "https://game-hub-satyakiabhijit.vercel.app"
        },
        {
            id: 5,
            title: "Phishing Detection",
            category: "AI / ML",
            technologies: "Python, TensorFlow, Flask, Scikit-learn",
            image: "/images/project-5.webp",
            description: "ML-powered cybersecurity solution for detecting phishing websites with strong classification performance and a web interface for real-time detection.",
            github: "https://github.com/satyakiabhijit/Phishing-Website-Detection"
        },
        {
            id: 6,
            title: "Bong Pizza",
            category: "Web App",
            technologies: "TypeScript, React, Next.js, Tailwind CSS",
            image: "/images/placeholder.webp",
            description: "A streamlined pizza ordering experience with a clean UI, quick browsing flow, and modern frontend architecture.",
            github: "https://github.com/satyakiabhijit/bong-pizza"
        },
        {
            id: 7,
            title: "Sound Wave",
            category: "Web App",
            technologies: "JavaScript, Web Audio API, HTML5, CSS3",
            image: "/images/placeholder.webp",
            description: "Music streaming web application with playlist management, audio visualization, and an immersive playback experience.",
            github: "https://github.com/satyakiabhijit/Sound_Wave",
            demo: "https://sound-wave-iota.vercel.app"
        },
        {
            id: 8,
            title: "HyperMathix",
            category: "Education",
            technologies: "JavaScript, HTML5, CSS3",
            image: "/images/placeholder.webp",
            description: "Interactive math learning platform with engaging games and educational content designed to make learning fun.",
            github: "https://github.com/satyakiabhijit/HyperMathix",
            demo: "https://satyakiabhijit.github.io/HyperMathix/"
        }
    ],
    contact: {
        email: "abhijitsatyaki29@gmail.com",
        github: "https://github.com/satyakiabhijit",
        linkedin: "https://linkedin.com/in/abhijitsatyaki",
        facebook: "https://www.facebook.com/satyakiabhijit.29/",
        instagram: "https://www.instagram.com/satyaki_abhijit"
    },
    skills: {
        develop: {
            title: "FULL-STACK",
            description: "Building modern web applications & scalable backends",
            details: "Developing complete web applications using the MERN stack — React.js, Node.js, Express.js, and MongoDB. Building RESTful APIs, JWT authentication, admin dashboards, and real-time features. Experienced with MVC architecture and end-to-end project delivery.",
            tools: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT", "MVC", "TypeScript", "Next.js", "MySQL"]
        },
        design: {
            title: "FRONTEND",
            description: "Responsive design & polished user interfaces",
            details: "Crafting responsive, cross-browser compatible interfaces with modern CSS, Tailwind CSS, and Bootstrap. Building interactive UIs with clean component architecture, smooth animations, and attention to UX details.",
            tools: ["JavaScript (ES6+)", "HTML5", "CSS3", "React.js", "Tailwind CSS", "Bootstrap", "Responsive Design", "Git", "Docker", "Postman"]
        }
    }
};
