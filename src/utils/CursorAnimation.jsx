import React, { useEffect } from "react";
import { m, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSize = useMotionValue(32);
  const cursorOpacity = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);
  const size = useSpring(cursorSize, springConfig);
  const opacity = useSpring(cursorOpacity, springConfig);

  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      cursorX.set(clientX);
      cursorY.set(clientY);
      cursorOpacity.set(1);
    };

    const handleMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    // Initialize visibility
    cursorOpacity.set(1);

    const handleMouseOverText = () => {
      cursorSize.set(80);
    };

    const handleMouseLeaveText = () => {
      cursorSize.set(32);
    };

    // Use event delegation on the document for better performance
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.matches("p, h1, h2, h3, h4, h5, h6, span, a, button")) {
        handleMouseOverText();
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.matches("p, h1, h2, h3, h4, h5, h6, span, a, button")) {
        handleMouseLeaveText();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <m.div
      className="fixed bg-white rounded-full pointer-events-none mix-blend-difference z-50 top-0 left-0"
      style={{
        width: size,
        height: size,
        x: x,
        y: y,
        opacity: opacity,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}
