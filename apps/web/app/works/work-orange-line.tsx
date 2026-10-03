"use client";

import { useEffect, useState } from "react";

export function WorkOrangeLine() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const syncFromBody = () => {
      setIsVideoModalOpen(document.body.getAttribute("data-work-video-modal-open") === "true");
    };

    syncFromBody();

    const observer = new MutationObserver(syncFromBody);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-work-video-modal-open"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-work-orange-line="true"
      className={`pointer-events-none fixed inset-x-0 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVideoModalOpen ? "opacity-0" : "opacity-100"
      }`}
      style={{ top: "var(--about-fixed-line-top, 20vh)", zIndex: 85 }}
      aria-hidden
    >
      <div
        className="w-full bg-[#FF5800]"
        style={{ height: "1px", transform: "scaleY(0.5)", transformOrigin: "center" }}
      />
    </div>
  );
}
