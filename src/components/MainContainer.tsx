import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Education from "./Education";
import Publications from "./Publications";
import BeyondDev from "./BeyondDev";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";
import { setAllTimeline } from "./utils/GsapScroll";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      // Initialize GSAP scroll triggers for HTML sections on mobile
      // (On desktop, this is handled after the 3D character model loads)
      setTimeout(() => {
        setAllTimeline();
      }, 500);
    }
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <TechStackNew />
        <CallToAction />
        <Career />
        <Education />
        <Publications />
        <Work />
        <BeyondDev />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
