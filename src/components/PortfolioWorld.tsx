import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { config } from "../config";
import "./PortfolioWorld.css";

type Destination = { id: string; label: string; title: string; description: string; x: number; z: number; color: string; details: string[]; links?: { label: string; href: string }[] };

function makeDestinations(): Destination[] {
  return [
    { id: "about", label: "01 / INTRO", title: "About Abhijit", description: config.about.description, x: 0, z: -8, color: "#c2a4ff", details: [config.developer.title, config.social.location, "Full-stack development · Research · AI-assisted tools"] },
    { id: "projects", label: "02 / WORKSHOP", title: "Selected Projects", description: "A few things I have built. Open a project link to explore the real repository or live demo.", x: 8, z: -1, color: "#a7d8c9", details: config.projects.slice(0, 5).map((p) => p.title + " — " + p.technologies), links: config.projects.slice(0, 6).map((p) => ({ label: p.title + " ↗", href: p.demo || p.github })).filter((l) => !!l.href) },
    { id: "skills", label: "03 / TOOL SHED", title: "Skills & Tools", description: "The tools and areas I work with, based on my existing portfolio.", x: -8, z: 0, color: "#e9c98d", details: [...config.skills.develop.tools, ...config.skills.design.tools].filter((v, i, a) => a.indexOf(v) === i).slice(0, 14) },
    { id: "experience", label: "04 / MILESTONES", title: "Experience", description: "Professional and research experience from my portfolio.", x: 8, z: 8, color: "#f2a6a0", details: config.experiences.map((e) => e.position + " · " + e.company + " (" + e.period + ")") },
    { id: "publications", label: "05 / RESEARCH LAB", title: "Research & Publications", description: "Publication status is shown as currently listed in the portfolio; submitted work is not presented as published.", x: -8, z: 8, color: "#a9c4f5", details: config.publications.map((p) => p.status + " · " + p.title + " — " + p.venue) },
    { id: "education", label: "06 / CAMPUS", title: "Education", description: "Academic background from my portfolio.", x: -1, z: 13, color: "#d7b3ef", details: config.education.map((e) => e.title + " · " + e.institution + " (" + e.period + ")") },
    { id: "contact", label: "07 / SIGNAL STATION", title: "Let's connect", description: "Find me online or send me an email.", x: 1, z: -15, color: "#e9c98d", details: [config.social.email, config.social.location], links: [{ label: "Email ↗", href: "mailto:" + config.social.email }, { label: "GitHub ↗", href: "https://github.com/" + config.social.github }, { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/abhijitsatyaki/" }] }
  ];
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}><mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.12, 0.18, 1.6, 5]} /><meshStandardMaterial color="#6d584a" /></mesh><mesh position={[0, 1.7, 0]} castShadow><coneGeometry args={[0.8, 1.6, 5]} /><meshStandardMaterial color="#587b68" flatShading /></mesh><mesh position={[0, 2.25, 0]} castShadow><coneGeometry args={[0.55, 1.2, 5]} /><meshStandardMaterial color="#769b79" flatShading /></mesh></group>;
}

function Car({ move }: { move: { forward: number; turn: number } }) {
  const ref = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const d = Math.min(delta, 0.04);
    velocity.current = THREE.MathUtils.damp(velocity.current, move.forward, 2.8, d);
    ref.current.rotation.y -= move.turn * d * (0.65 + Math.abs(velocity.current) * 0.6);
    const direction = new THREE.Vector3(Math.sin(ref.current.rotation.y), 0, Math.cos(ref.current.rotation.y));
    ref.current.position.addScaledVector(direction, velocity.current * d * 7);
    ref.current.position.x = THREE.MathUtils.clamp(ref.current.position.x, -17, 17);
    ref.current.position.z = THREE.MathUtils.clamp(ref.current.position.z, -19, 17);
  });
  return <group ref={ref} position={[0, 0.3, 3]}><mesh castShadow position={[0, 0.28, 0]}><boxGeometry args={[1.25, 0.45, 2.1]} /><meshStandardMaterial color="#c2a4ff" metalness={0.15} roughness={0.42} /></mesh><mesh castShadow position={[0, 0.62, -0.12]}><boxGeometry args={[0.86, 0.42, 0.95]} /><meshStandardMaterial color="#dfe7f2" metalness={0.2} roughness={0.22} /></mesh>{[-0.68, 0.68].map(x => [-0.62, 0.62].map(z => <mesh key={x + ":" + z} position={[x, 0.1, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.22, 0.22, 0.13, 12]} /><meshStandardMaterial color="#24222b" /></mesh>))}</group>;
}

function Landmark({ destination, onSelect }: { destination: Destination; onSelect: (d: Destination) => void }) {
  const isBuilding = ["projects", "publications", "education"].includes(destination.id);
  return <group position={[destination.x, 0, destination.z]} onClick={(e) => { e.stopPropagation(); onSelect(destination); }}>
    <mesh position={[0, 0.13, 0]} receiveShadow><cylinderGeometry args={[1.65, 1.9, 0.25, 7]} /><meshStandardMaterial color="#d6d0c8" /></mesh>
    {isBuilding ? <><mesh castShadow position={[0, 1.15, 0]}><boxGeometry args={[1.7, 1.8, 1.5]} /><meshStandardMaterial color={destination.color} flatShading /></mesh><mesh castShadow position={[0, 2.25, 0]}><coneGeometry args={[1.25, 0.8, 4]} /><meshStandardMaterial color="#50475f" flatShading /></mesh><mesh position={[0, 0.9, 0.77]}><boxGeometry args={[0.45, 0.8, 0.05]} /><meshStandardMaterial color="#252332" /></mesh></> : <><mesh castShadow position={[0, 0.75, 0]}><cylinderGeometry args={[0.18, 0.24, 1.25, 7]} /><meshStandardMaterial color={destination.color} /></mesh><mesh castShadow position={[0, 1.65, 0]}><icosahedronGeometry args={[0.72, 0]} /><meshStandardMaterial color={destination.color} flatShading emissive={destination.color} emissiveIntensity={0.14} /></mesh></>}
    <Html position={[0, 2.85, 0]} center distanceFactor={13} style={{ pointerEvents: "none" }}><div className="world-label">{destination.label}</div></Html>
    <mesh position={[0, 1.4, 0]} visible={false}><sphereGeometry args={[2, 8, 8]} /><meshBasicMaterial transparent opacity={0} /></mesh>
  </group>;
}

function WorldScene({ onSelect, move }: { onSelect: (d: Destination) => void; move: { forward: number; turn: number } }) {
  const destinations = useMemo(makeDestinations, []);
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [15, 17, 23], fov: 42 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.setClearColor("#b9c7c5"); }} >
    <fog attach="fog" args={["#b9c7c5", 26, 58]} />
    <ambientLight intensity={1.25} /><directionalLight castShadow position={[8, 14, 7]} intensity={2.1} shadow-mapSize={[1024, 1024]} />
    <Environment preset="park" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.14, 0]}><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#a8bba8" /></mesh>
    <mesh receiveShadow position={[0, 0, 0]}><cylinderGeometry args={[22, 24, 0.55, 12]} /><meshStandardMaterial color="#a5c3b0" flatShading /></mesh>
    <mesh receiveShadow position={[0, 0.02, 0]}><cylinderGeometry args={[18.7, 20, 0.14, 12]} /><meshStandardMaterial color="#d7d2c8" flatShading /></mesh>
    <mesh receiveShadow position={[0, 0.11, 0]}><cylinderGeometry args={[16.6, 17.5, 0.12, 12]} /><meshStandardMaterial color="#a9c7b0" flatShading /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.19, 0]}><ringGeometry args={[3.7, 5.4, 12]} /><meshStandardMaterial color="#8b8d91" /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}><circleGeometry args={[3.65, 12]} /><meshStandardMaterial color="#d8cbb3" /></mesh>
    {Array.from({ length: 42 }, (_, i) => { const angle = i * 2.399; const radius = 12 + (i % 5) * 1.1; return <Tree key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]} scale={0.55 + (i % 4) * 0.15} />; })}
    {destinations.map((d) => <Landmark key={d.id} destination={d} onSelect={onSelect} />)}
    <Car move={move} />
    <ContactShadows position={[0, -0.08, 0]} opacity={0.25} scale={45} blur={2} far={10} />
  </Canvas>;
}

export default function PortfolioWorld({ onExit }: { onExit: () => void }) {
  const destinations = useMemo(makeDestinations, []);
  const [selected, setSelected] = useState<Destination | null>(null);
  const [move, setMove] = useState({ forward: 0, turn: 0 });
  const pressed = useRef(new Set<string>());
  const updateMove = () => {
    const keys = pressed.current;
    setMove({ forward: (keys.has("w") || keys.has("arrowup") ? 1 : 0) - (keys.has("s") || keys.has("arrowdown") ? 1 : 0), turn: (keys.has("a") || keys.has("arrowleft") ? 1 : 0) - (keys.has("d") || keys.has("arrowright") ? 1 : 0) });
  };
  useEffect(() => {
    const down = (e: KeyboardEvent) => { const k = e.key.toLowerCase(); if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k)) { e.preventDefault(); pressed.current.add(k); updateMove(); } if (k === "escape") { if (selected) setSelected(null); else onExit(); } };
    const up = (e: KeyboardEvent) => { pressed.current.delete(e.key.toLowerCase()); updateMove(); };
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); pressed.current.clear(); };
  }, [selected, onExit]);
  const touch = (key: string, active: boolean) => { if (active) pressed.current.add(key); else pressed.current.delete(key); updateMove(); };
  return <div className="portfolio-world">
    <WorldScene onSelect={setSelected} move={move} />
    <header className="world-topbar"><div><span className="world-kicker">ABHIJIT SATYAKI / INTERACTIVE PORTFOLIO</span><strong>Take the scenic route.</strong></div><button className="world-exit" onClick={onExit} aria-label="Exit 3D portfolio">× <span>Exit experience</span></button></header>
    <div className="world-controls"><span className="world-dot" /> <b>DRIVE</b><span>WASD / ARROWS</span><i>Click any landmark to explore</i></div>
    <div className="world-destinations" aria-label="Explore portfolio destinations">{destinations.map(d => <button key={d.id} onClick={() => setSelected(d)}>{d.label.split(" / ")[1]}</button>)}</div>
    <div className="world-touch" aria-label="Touch vehicle controls"><button onPointerDown={() => touch("arrowup", true)} onPointerUp={() => touch("arrowup", false)} onPointerLeave={() => touch("arrowup", false)} aria-label="Drive forward">↑</button><div><button onPointerDown={() => touch("arrowleft", true)} onPointerUp={() => touch("arrowleft", false)} onPointerLeave={() => touch("arrowleft", false)} aria-label="Turn left">←</button><button onPointerDown={() => touch("arrowdown", true)} onPointerUp={() => touch("arrowdown", false)} onPointerLeave={() => touch("arrowdown", false)} aria-label="Reverse">↓</button><button onPointerDown={() => touch("arrowright", true)} onPointerUp={() => touch("arrowright", false)} onPointerLeave={() => touch("arrowright", false)} aria-label="Turn right">→</button></div></div>
    {selected && <div className="world-panel-backdrop" onClick={() => setSelected(null)}><section className="world-panel" role="dialog" aria-modal="true" aria-labelledby="world-panel-title" onClick={e => e.stopPropagation()}><span className="world-panel-kicker">{selected.label}</span><button className="world-panel-close" onClick={() => setSelected(null)} aria-label="Close panel">×</button><h2 id="world-panel-title">{selected.title}</h2><p>{selected.description}</p><ul>{selected.details.map((detail, i) => <li key={i}>{detail}</li>)}</ul>{selected.links && <div className="world-panel-links">{selected.links.map(link => <a key={link.label} href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">{link.label}</a>)}</div>}</section></div>}
    <div className="world-bottom-note">A SMALL WORLD BUILT FROM A REAL PORTFOLIO <span>·</span> ESC TO CLOSE</div>
  </div>;
}
