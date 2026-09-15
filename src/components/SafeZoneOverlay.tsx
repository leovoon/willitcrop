import { SafeZoneElement } from '../types/presets';

interface SafeZoneOverlayProps {
  safeZones: SafeZoneElement[];
}

export function SafeZoneOverlay({ safeZones }: SafeZoneOverlayProps) {
  if (!safeZones || safeZones.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {safeZones.map((zone) => {
          const x = zone.left ?? (zone.right !== undefined ? 100 - (zone.width ?? 0) : 0);
          const y = zone.top ?? (zone.bottom !== undefined ? 100 - (zone.height ?? 0) : 0);
          const width = zone.width ?? 100;
          const height = zone.height ?? 100;

          return (
            <g key={zone.id} className="transition-opacity duration-200">
              {/* Pattern / Fill for blocked zone with Swiss Accent Hairline */}
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="color-mix(in oklab, var(--accent) 18%, transparent)"
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>

      {/* Typographic overlay labels positioned via percentage coordinates */}
      {safeZones.map((zone) => {
        const top = zone.top !== undefined ? `${zone.top}%` : undefined;
        const bottom = zone.bottom !== undefined ? `${zone.bottom}%` : undefined;
        const left = zone.left !== undefined ? `${zone.left}%` : undefined;
        const right = zone.right !== undefined ? `${zone.right}%` : undefined;

        return (
          <div
            key={`label-${zone.id}`}
            style={{ top, bottom, left, right }}
            className="absolute p-1 max-w-[85%]"
          >
            <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold bg-[var(--paper)] text-[var(--accent)] border border-[var(--accent)] shadow-none line-clamp-1">
              {zone.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
