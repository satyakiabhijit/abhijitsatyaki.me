import { Suspense, lazy, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./PortfolioPlayButton.css";

const PortfolioWorld = lazy(() => import("./PortfolioWorld"));

export default function PortfolioPlayButton() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const exit = useCallback(() => { setOpen(false); }, []);

  useEffect(() => { if (location.pathname === "/admin" || location.pathname === "/play") setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (location.pathname === "/admin" || location.pathname === "/play") return null;
  return <>
    <button className="portfolio-play-trigger" onClick={() => { setOpen(true); }} aria-label="Play interactive 3D portfolio">
      <span className="portfolio-play-icon" aria-hidden="true">▶</span><span className="portfolio-play-label">PLAY PORTFOLIO</span><span className="portfolio-play-hint">Explore my world in 3D</span>
    </button>
    {open && <Suspense fallback={<div className="portfolio-play-loading" role="status"><span className="portfolio-loading-mark">✳</span><strong>Building a little world…</strong><span>Loading the interactive portfolio</span><button onClick={exit}>Cancel</button></div>}>
      <PortfolioWorld onExit={exit} />
    </Suspense>}
  </>;
}
