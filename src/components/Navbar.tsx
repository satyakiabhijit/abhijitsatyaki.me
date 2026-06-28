import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    // Start paused (will be started by initialFX after loading)
    lenis.stop();
    // In case of Hot Module Replacement (HMR) during dev, initialFX won't run again.
    // If the main content is already active, we can start Lenis immediately.
    if (document.querySelector('.main-active')) {
      lenis.start();
    }

    // Handle smooth scroll animation frame
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle navigation links
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
              });
            }
          }
        }
      });
    });

    // Handle resize
    window.addEventListener("resize", () => {
      lenis?.resize();
    });

    return () => {
      lenis?.destroy();
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      if (document.querySelector('.main-active')) {
        lenis?.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="header">
        <div className="navbar-left">
          <a href="/#" className="navbar-title" data-cursor="disable">
            AS
          </a>
          <a
            href="mailto:abhijitsatyaki29@gmail.com"
            className="navbar-connect"
            data-cursor="disable"
          >
            abhijitsatyaki29@gmail.com
          </a>
        </div>

        <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li>
            <a data-href="#about" href="#about" onClick={() => setIsMenuOpen(false)}>
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#experience" href="#experience" onClick={() => setIsMenuOpen(false)}>
              <HoverLinks text="EXPERIENCE" />
            </a>
          </li>
          <li>
            <a data-href="#education" href="#education" onClick={() => setIsMenuOpen(false)}>
              <HoverLinks text="EDUCATION" />
            </a>
          </li>
          <li>
            <a data-href="#publications" href="#publications" onClick={() => setIsMenuOpen(false)}>
              <HoverLinks text="PUBLICATIONS" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work" onClick={() => setIsMenuOpen(false)}>
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#beyond-dev" href="#beyond-dev" onClick={() => setIsMenuOpen(false)}>
              <HoverLinks text="BEYOND DEV" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact" onClick={() => setIsMenuOpen(false)}>
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
