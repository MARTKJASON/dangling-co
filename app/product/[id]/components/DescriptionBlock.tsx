import React, { FC } from 'react';

interface DescriptionBlockProps {
  text: string;
}

/** Renders the merchant's description. Lines starting with "-", "•" or "*" become a list. */
export const DescriptionBlock: FC<DescriptionBlockProps> = ({ text }) => {
  const lines = (text ?? '').split('\n').filter((l) => l.trim() !== '');
  if (lines.length === 0) return null;

  const blocks: (string | string[])[] = [];
  lines.forEach((line) => {
    const isBullet = /^[-•*]\s+/.test(line.trim());
    if (isBullet) {
      const content = line.trim().replace(/^[-•*]\s+/, '');
      const last = blocks[blocks.length - 1];
      if (Array.isArray(last)) last.push(content);
      else blocks.push([content]);
    } else {
      blocks.push(line);
    }
  });

  return (
    <div className="flex flex-col gap-3 text-[16px] md:text-[17px] leading-relaxed text-ink-600">
      {blocks.map((block, i) =>
        Array.isArray(block) ? (
          <ul key={i} className="flex flex-col gap-1.5">
            {block.map((item, j) => (
              <li key={j} className="flex gap-3">
                <span className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-peri-300 shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>{block}</p>
        ),
      )}
    </div>
  );
};
