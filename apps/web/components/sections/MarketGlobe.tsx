"use client";

import { useEffect, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-client";

const HIGHLIGHTED: Record<string, { name: string; role: string }> = {
  "360": { name: "Indonesia", role: "Local Market & Manufacturing Base" },
  "392": { name: "Japan", role: "Primary Export Market" },
  "410": { name: "South Korea", role: "Primary Export Market" },
};

export default function MarketMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<{
    name: string;
    role: string;
    x: number;
    y: number;
  } | null>(null);

  const width = 900;
  const height = 560;

  const projection = geoMercator()
    .center([128, 20])
    .scale(500)
    .translate([width / 2, height / 2]);

  const path = geoPath().projection(projection);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topology: Topology) => {
        const geo = feature(topology, topology.objects.countries as GeometryCollection);
        setCountries((geo as any).features);
      });
  }, []);

  const handleMouseMove = (e: React.MouseEvent, info: { name: string; role: string }) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const TOOLTIP_W = 200;
    const TOOLTIP_H = 56;
    const OFFSET = 12;

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top - OFFSET;

    // Clamp horizontally
    if (x + TOOLTIP_W / 2 > rect.width) x = rect.width - TOOLTIP_W / 2;
    if (x - TOOLTIP_W / 2 < 0) x = TOOLTIP_W / 2;

    // Flip below if too close to top
    if (y - TOOLTIP_H < 0) y = e.clientY - rect.top + OFFSET + TOOLTIP_H;

    setTooltip({ ...info, x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-[#EDE8E0] border border-[#CA9C60]/20"
    >
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-white border border-[#CA9C60]/30 rounded-xl px-4 py-2.5 shadow-lg pointer-events-none w-[200px] text-center"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="text-[#5C3D1E] font-bold text-sm">{tooltip.name}</p>
          <p className="text-[#7A5C3A] text-xs">{tooltip.role}</p>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        style={{ height: 560 }}
      >

        {/* Countries */}
        {countries.map((geo, i) => {
          const id = String(geo.id);
          const isHighlighted = id in HIGHLIGHTED;
          const info = HIGHLIGHTED[id];
          return (
            <path
              key={`country-${id}-${i}`}
              d={path(geo) ?? ""}
              fill={isHighlighted ? "#CA9C60" : "#C8C0B4"}
              stroke="#FAF6F0"
              strokeWidth={0.5}
              style={{ cursor: isHighlighted ? "pointer" : "default" }}
              onMouseMove={isHighlighted ? (e) => handleMouseMove(e, info) : undefined}
              onMouseLeave={isHighlighted ? () => setTooltip(null) : undefined}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur rounded-xl px-4 py-3 border border-[#CA9C60]/20 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#CA9C60]" />
          <span className="text-[#5C3D1E] text-xs font-medium">Key Markets</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#C8C0B4]" />
          <span className="text-[#7A5C3A] text-xs">Other Regions</span>
        </div>
      </div>
    </div>
  );
}