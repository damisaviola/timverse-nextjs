"use client";

interface BreakingNewsTickerProps {
  headlines: string[];
}

export default function BreakingNewsTicker({ headlines }: BreakingNewsTickerProps) {
  if (!headlines || headlines.length === 0) return null;
  // Duplicate for seamless loop
  const items = [...headlines, ...headlines];

  return (
    <div
      className="w-full overflow-hidden bg-ticker-bg text-ticker-text"
      id="breaking-ticker"
    >
      <div className="mx-auto max-w-7xl flex items-center">
        {/* Badge */}
        <div className="flex-shrink-0 bg-red-500 text-white px-3 py-2 text-xs font-bold tracking-wider uppercase z-10">
          Breaking
        </div>

        {/* Ticker */}
        <div className="overflow-hidden flex-1">
          <div className="flex animate-ticker whitespace-nowrap">
            {items.map((headline, i) => (
              <span
                key={i}
                className="inline-block px-8 py-2 text-sm font-medium"
              >
                {headline}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
