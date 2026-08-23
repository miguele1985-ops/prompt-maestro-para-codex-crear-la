"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/types/content";

const ScreenshotGallery = dynamic(
  () => import("@/components/Interactive").then((module) => module.ScreenshotGallery),
  {
    ssr: false,
    loading: () => <div className="gallery-deferred-placeholder" aria-hidden="true" />,
  },
);

export function DeferredScreenshotGallery({ assets }: { assets: MediaAsset[] }) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "650px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {ready ? <ScreenshotGallery assets={assets} /> : <div className="gallery-deferred-placeholder" aria-hidden="true" />}
    </div>
  );
}
