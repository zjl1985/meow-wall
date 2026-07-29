"use client";

import { useEffect } from "react";

import { useCopy } from "@/hooks/use-copy";

/** 彩蛋：切走标签页时把标题换成召唤语 */
export function AwayTitle() {
  const copy = useCopy();
  useEffect(() => {
    const original = document.title;
    const onVisibilityChange = () => {
      document.title = document.hidden ? copy.easterEgg.awayTitle : original;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.title = original;
    };
  }, [copy.easterEgg.awayTitle]);

  return null;
}
