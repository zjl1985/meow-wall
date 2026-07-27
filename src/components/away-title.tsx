"use client";

import { useEffect } from "react";

import { copy } from "@/lib/copy";

/** 彩蛋：切走标签页时把标题换成召唤语 */
export function AwayTitle() {
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
  }, []);

  return null;
}
