type HardwareDataItem = {
  title: string;
  description: string;
  link: string;
};

type SoftwareDataItem = {
  title: string;
  imgSrc: string;
  link: string;
  category?: string;
};

const softwareData: SoftwareDataItem[] = [
  // Core Languages & Web Fundamentals (Row 1)
  {
    title: "JavaScript",
    imgSrc: "/tech/javascript.svg",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    category: "Languages",
  },
  {
    title: "Python",
    imgSrc: "/tech/python.svg",
    link: "https://www.python.org/",
    category: "Languages",
  },
  {
    title: "HTML5",
    imgSrc: "/tech/html5.svg",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    category: "Frontend",
  },
  {
    title: "CSS3",
    imgSrc: "/tech/css3.svg",
    link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    category: "Frontend",
  },
  {
    title: "C++",
    imgSrc: "/tech/cplusplus.svg",
    link: "https://isocpp.org/",
    category: "Languages",
  },
  {
    title: "React",
    imgSrc: "/tech/react.svg",
    link: "https://react.dev/",
    category: "Frontend",
  },
  {
    title: "Node.js",
    imgSrc: "/tech/nodejs.svg",
    link: "https://nodejs.org/",
    category: "Backend",
  },
  {
    title: "Express",
    imgSrc: "/tech/express.svg",
    link: "https://expressjs.com/",
    category: "Backend",
  },
  {
    title: "MongoDB",
    imgSrc: "/tech/mongodb.svg",
    link: "https://www.mongodb.com/",
    category: "Database",
  },
  {
    title: "MySQL",
    imgSrc: "/tech/mysql.svg",
    link: "https://www.mysql.com/",
    category: "Database",
  },

  // Frameworks, Libraries & DevOps (Row 2)
  {
    title: "TypeScript",
    imgSrc: "/tech/typescript.svg",
    link: "https://www.typescriptlang.org/",
    category: "Languages",
  },
  {
    title: "Next.js",
    imgSrc: "/tech/nextjs.svg",
    link: "https://nextjs.org/",
    category: "Full Stack",
  },
  {
    title: "Tailwind",
    imgSrc: "/tech/tailwind.svg",
    link: "https://tailwindcss.com/",
    category: "Frontend",
  },
  {
    title: "Bootstrap",
    imgSrc: "/tech/bootstrap.svg",
    link: "https://getbootstrap.com/",
    category: "Frontend",
  },
  {
    title: "Docker",
    imgSrc: "/tech/docker.svg",
    link: "https://www.docker.com/",
    category: "DevOps",
  },
  {
    title: "Git",
    imgSrc: "/tech/git.svg",
    link: "https://git-scm.com/",
    category: "Tools",
  },
  {
    title: "GitHub",
    imgSrc: "/tech/github.svg",
    link: "https://github.com/",
    category: "Tools",
  },
  {
    title: "Postman",
    imgSrc: "/tech/postman.svg",
    link: "https://www.postman.com/",
    category: "Tools",
  },

  // Cloud, Platforms & Editors (Row 3)
  {
    title: "Netlify",
    imgSrc: "/tech/netlify.svg",
    link: "https://www.netlify.com/",
    category: "Cloud",
  },
  {
    title: "Vercel",
    imgSrc: "/tech/vercel.svg",
    link: "https://vercel.com/",
    category: "Cloud",
  },
  {
    title: "VS Code",
    imgSrc: "/tech/vscode.svg",
    link: "https://code.visualstudio.com/",
    category: "Tools",
  },
  {
    title: "Figma",
    imgSrc: "/tech/figma.svg",
    link: "https://www.figma.com/",
    category: "Design",
  },
  {
    title: "Firebase",
    imgSrc: "/tech/firebase.svg",
    link: "https://firebase.google.com/",
    category: "Cloud",
  },
  {
    title: "Linux",
    imgSrc: "/tech/linux.svg",
    link: "https://www.linux.org/",
    category: "OS & Systems",
  },

  // Protocols & Back-office (Row 4)
  {
    title: "REST APIs",
    imgSrc: "/tech/rest-api.png",
    link: "https://restfulapi.net/",
    category: "Backend",
  },
  {
    title: "JWT",
    imgSrc: "/tech/jwt.svg",
    link: "https://jwt.io/",
    category: "Security",
  },
  {
    title: "WordPress",
    imgSrc: "/tech/wordpress.svg",
    link: "https://wordpress.org/",
    category: "CMS",
  },
  {
    title: "Bash",
    imgSrc: "/tech/bash.svg",
    link: "https://www.gnu.org/software/bash/",
    category: "OS & Systems",
  },

  // Specialized / IoT & Hardware (Row 5)
  {
    title: "IoMT",
    imgSrc: "/tech/iomt.png",
    link: "https://en.wikipedia.org/wiki/Internet_of_medical_things",
    category: "IoT / Medical",
  },
  {
    title: "BLE",
    imgSrc: "/tech/ble.png",
    link: "https://www.bluetooth.com/learn-about-bluetooth/tech-overview/",
    category: "Wireless & IoT",
  },
];

const hardwareData: HardwareDataItem[] = [
  {
    title: "ASUS ROG Strix G15 (2022)",
    description:
      "AMD Ryzen 7 6800HS (8 cores, 16 threads, up to 4.7 GHz boost, 6nm Zen 3+), NVIDIA GeForce RTX graphics with MUX Switch, dual-channel DDR5 RAM, PCIe 4.0 NVMe SSD, and ROG Intelligent Liquid Metal cooling. My primary machine for software engineering and multitasking.",
    link: "https://rog.asus.com/laptops/rog-strix/rog-strix-g15-2022-series/",
  },
  {
    title: "Acer Nitro 270Y (27\" Gaming Monitor)",
    description:
      "27-inch Full HD display with ZeroFrame ultra-thin bezels, up to 180Hz refresh rate, 1ms VRB response time, AMD FreeSync Premium, and 99% sRGB coverage. Perfect for code editing, reading documentation, and gaming.",
    link: "https://www.acer.com/us-en/monitors/gaming/nitro-vg0",
  },
  {
    title: "EvoFox Katana X2 Mechanical Keyboard",
    description:
      "Compact Tenkeyless (TKL) mechanical keyboard with hot-swappable Outemu mechanical switches (50M keystrokes), 100% Anti-Ghosting N-Key Rollover, 16 RGB backlight modes with side light bars, and a multi-functional hardware volume knob.",
    link: "https://www.amkette.com/products/evofox-katana-x2-mechanical-keyboard",
  },
  {
    title: "Ergonomic Gaming Chair",
    description:
      "Full ergonomic high-back support featuring high-density molded foam padding, multi-point lumbar support, headrest cushion, adjustable armrests, and 90-135 degree recline for healthy posture during marathon development sessions.",
    link: "https://www.amazon.in/gaming-chairs/b?node=9004149031",
  },
  {
    title: "Wireless Gaming Mouse",
    description:
      "High-precision optical gaming sensor with ultra-low latency wireless connectivity, customizable DPI sensitivity profiles, and lightweight ergonomic shape for fluid workflow navigation.",
    link: "https://www.logitechg.com/products/gaming-mice.html",
  },
  {
    title: "Noise-Cancelling Studio Headphones",
    description:
      "Over-ear wireless headphones with Active Noise Cancellation (ANC), high-fidelity audio drivers, and all-day battery life for uninterrupted deep focus coding sessions.",
    link: "https://www.sony.co.in/headphones",
  },
];

export { hardwareData, softwareData };
