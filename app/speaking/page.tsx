import { GridWrapper } from "@/app/components/GridWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research | Abhijit Satyaki",
  description: "Peer-reviewed research publications by Abhijit Satyaki in IoMT, antenna design, and AI/ML.",
};

interface Publication {
  title: string;
  venue: string;
  year: string;
  status: "Published" | "Submitted";
  description: string;
  tags: string[];
  link?: string;
  doi?: string;
}

const publications: Publication[] = [
  {
    title: "Implementing Secure BLE Signal Transmission through Antenna Design Techniques in Wearable IoT Devices",
    venue: "CRC Press (Taylor & Francis Group)",
    year: "2026",
    status: "Published",
    description: "Co-authored research presented at the 12th International Conference on Microelectronics, Circuits and Systems (Micro2025) at JGEC. Presents a cross-layer approach to enhancing BLE security in wearable IoT devices using antenna design techniques.",
    tags: ["Bluetooth LE", "Antenna Design", "Wearable IoT", "Security"],
    link: "https://www.taylorfrancis.com/chapters/edit/10.1201/9781003581673-9/implementing-secure-ble-signal-transmission-antenna-design-techniques-wearable-iot-devices-aditya-kumar-samanta-sagnik-chakraborty-abhijit-satyaki-rajesh-dey-monika-singh",
  },
  {
    title: "Optimizing Sensory Data Accumulation in IoMT Framework Using Energy-Efficient Compressed Sensing Techniques",
    venue: "IEEE",
    year: "2025",
    status: "Published",
    description: "Proposes an energy-efficient data accumulation method for IoMT networks using compressed sensing and threshold-based cloud transmission. Achieved over 98% data reconstruction reliability and up to 8.91% lower energy usage. Presented at IIT Rourkela.",
    tags: ["IoMT", "Healthcare", "Compressed Sensing", "Energy Efficiency"],
    doi: "10.1109/ISED63599.2024.10957180",
    link: "https://ieeexplore.ieee.org/abstract/document/10957180",
  },
  {
    title: "A High-Performance, Ultra-Wideband Microstrip Patch Antenna with Near-Ideal Impedance Matching for 5G Ka-Band Applications Operating at 26 GHz",
    venue: "Under Review",
    year: "2025",
    status: "Submitted",
    description: "Presents a compact microstrip patch antenna for 5G Ka-band applications at 26 GHz using patch slotting, inset feeding, and Rogers 92 mL substrate. CST Studio Suite 2024 simulations achieved ~-39.1 dB return loss, VSWR of 1.02, and 5.731 GHz bandwidth.",
    tags: ["5G", "Ka-Band", "Microstrip Antenna", "26 GHz", "CST"],
  },
  {
    title: "Explainable Machine Learning-Based Prediction of S11 for Slotted Patch Antenna Optimization Using Extra Trees Regressor",
    venue: "Under Review",
    year: "2025",
    status: "Submitted",
    description: "Proposes an explainable ML framework for predicting S11 in slotted patch antennas. Using 1,266 samples and engineered features, the Extra Trees Regressor achieved R² = 0.9967, RMSE = 0.1696, with SHAP identifying dominant design features.",
    tags: ["Machine Learning", "XAI", "Antenna Design", "S11", "SHAP"],
  },
  {
    title: "Foundation of Quantum Computing and Edge AI in Healthcare",
    venue: "Under Review",
    year: "2025",
    status: "Submitted",
    description: "Examines quantum computing and AI in healthcare - quantum machine learning for drug discovery, genomics, diagnostic imaging, and quantum cryptography for patient-data security.",
    tags: ["Quantum Computing", "Edge AI", "Healthcare", "Quantum ML"],
  },
];

export default function ResearchPage() {
  return (
    <div className="relative space-y-16 pb-16">
      <GridWrapper>
        <h1 className="mx-auto mt-16 max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
          Research &amp; Publications
        </h1>
      </GridWrapper>

      <GridWrapper>
        <p className="mx-auto max-w-xl text-center leading-8 text-text-secondary">
          Peer-reviewed work spanning IoMT security, antenna design, and AI/ML. IEEE + SCOPUS indexed.
        </p>
      </GridWrapper>

      <GridWrapper>
        <div className="space-y-4">
          {publications.map((pub) => (
            <div key={pub.title} className="rounded-2xl border border-border-primary/50 bg-bg-primary p-6 transition hover:border-border-primary">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pub.venue.includes("IEEE") ? "bg-blue-600/10 text-blue-500" : pub.venue.includes("CRC") || pub.venue.includes("Taylor") ? "bg-emerald-600/10 text-emerald-500" : "bg-amber-600/10 text-amber-500"}`}>
                  {pub.venue}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${pub.status === "Published" ? "bg-green-600/10 text-green-500" : "bg-amber-600/10 text-amber-500"}`}>
                  {pub.status}
                </span>
                <span className="text-xs text-text-secondary">{pub.year}</span>
              </div>
              <h2 className="mb-2 text-base font-semibold leading-6 tracking-tight text-text-primary">
                {pub.title}
              </h2>
              <p className="mb-4 text-sm leading-6 text-text-secondary">
                {pub.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  {pub.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-border-primary px-2 py-0.5 text-xs text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
                {pub.link && (
                  <a href={pub.link} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    Read paper ↗
                  </a>
                )}
                {pub.doi && (
                  <span className="text-xs text-text-secondary">DOI: {pub.doi}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </GridWrapper>
    </div>
  );
}
