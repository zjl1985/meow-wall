"use client";

import Image from "next/image";

import { useCopy } from "@/hooks/use-copy";
import { HUMBLE_ANIMALS } from "@/lib/humble-animals";

export default function HomePage() {
  const copy = useCopy();

  return (
    <div className="paper-page">
      <header className="paper-header paper-fade">
        <p className="paper-eyebrow">{copy.humble.eyebrow}</p>
        <h1 className="paper-title">{copy.humble.title}</h1>
        <p className="paper-subtitle">{copy.humble.subtitle}</p>
      </header>

      <ol className="paper-grid" aria-label={copy.humble.title}>
        {HUMBLE_ANIMALS.map((animal, index) => (
          <li
            key={animal.id}
            className="paper-sheet paper-fade"
            style={{ animationDelay: `${260 + index * 180}ms` }}
          >
            <figure>
              <Image
                src={animal.src}
                width={animal.width}
                height={animal.height}
                alt={copy.humble.animals[animal.id]}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                className="paper-art"
                priority={index < 3}
              />
              <figcaption className="paper-caption">
                <span className="paper-index">{String(index + 1).padStart(2, "0")}</span>
                <span>{copy.humble.animals[animal.id]}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>

      <footer className="paper-colophon paper-fade" style={{ animationDelay: "1400ms" }}>
        <span>{copy.humble.note}</span>
        <span>{copy.humble.count(HUMBLE_ANIMALS.length)}</span>
      </footer>
    </div>
  );
}
