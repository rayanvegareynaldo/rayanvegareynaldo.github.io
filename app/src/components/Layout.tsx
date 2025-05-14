import { Link, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  generateDots,
  initCanvas,
  drawScene,
  getPointerPosition,
  Dot,
  PointerPosition,
} from "@/utils/spider-effect";

export default function Layout() {
  const appRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const pointerPosRef = useRef<PointerPosition | null>(null);
  const dotsRef = useRef<Dot[]>([]);

  useEffect(() => {
    if (!appRef.current || !canvasRef.current) return;

    const app = appRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Initialize
    const dimensions = initCanvas(canvas, app);
    dotsRef.current = generateDots(
      dimensions.width,
      dimensions.height,
      window.innerWidth < 768 ? 80 : 120
    );

    // Animation loop
    const animate = () => {
      drawScene(ctx, dotsRef.current, pointerPosRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Event handlers
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      pointerPosRef.current = getPointerPosition(e, app);
    };

    const handlePointerEnd = () => {
      pointerPosRef.current = null;
    };

    const handleResize = () => {
      const newDimensions = initCanvas(canvas, app);
      dotsRef.current = generateDots(
        newDimensions.width,
        newDimensions.height,
        window.innerWidth < 768 ? 80 : 120
      );
    };

    // Add event listeners
    app.addEventListener("mousemove", handlePointerMove);
    app.addEventListener("touchmove", handlePointerMove as EventListener, {
      passive: true,
    });
    app.addEventListener("mouseout", handlePointerEnd);
    app.addEventListener("touchend", handlePointerEnd);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(app);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      app.removeEventListener("mousemove", handlePointerMove);
      app.removeEventListener("touchmove", handlePointerMove as EventListener);
      app.removeEventListener("mouseout", handlePointerEnd);
      app.removeEventListener("touchend", handlePointerEnd);
      resizeObserver.disconnect();
    };
  }, []);

  type Link = {
    label: string;
    href: string;
  };

  const links: Link[] = [
    { label: "About", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <main className="overflow-hidden h-screen">
      <header className="h-20 bg-white/40 backdrop-blur-xl w-full z-50 sticky top-0 shadow">
        <div className="container mx-auto flex items-center h-full px-4 justify-between">
          <h2 className="flex items-end relative">
            <img
              src="https://reynaldorayan.dev/storage/logo.png"
              className="filter grayscale brightness-0 invert-0 opacity-50 -rotate-2"
              alt="R"
            />
          </h2>

          <nav>
            <ul className="flex flex-row space-x-10 uppercase tracking-wide font-medium">
              {links.map((link) => (
                <li>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div
        ref={appRef}
        className="h-screen w-full relative touch-none"
        style={{ touchAction: "none" }}
      >
        <Outlet />

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30"
        />
      </div>
    </main>
  );
}
