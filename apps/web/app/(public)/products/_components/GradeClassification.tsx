import { Card } from "@/components/ui/card";
import Image from "next/image";

const grades = [
  {
    name: "GRADE AA",
    type: "two-sided",
    face: ["Reasonably uniform color", "Clear surface"],
    back: ["Un-uniform color", "Clear surface"],
    notAllowed:
      "Pin Hole, Dead Knots, Bluestain, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Pinkish-reddish, Delamination, Undersize.",
    image: "/Grade-AA.webp",
  },
  {
    name: "GRADE A1",
    type: "two-sided",
    face: ["Reasonably uniform color", "Clear surface"],
    back: ["Un-uniform color", "Pinkish-reddish"],
    notAllowed:
      "Pin Hole, Dead Knots, Bluestain, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    image: "/Grade-A1.webp",
  },
  {
    name: "GRADE AP",
    type: "one-sided",
    face: ["Un-uniform color", "Pinkish-reddish"],
    back: [],
    notAllowed:
      "Pin Hole, Dead Knots, Bluestain, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    image: null,
  },
  {
    name: "GRADE BS",
    type: "one-sided",
    face: ["Un-uniform color", "Bluestain", "Pinkish-reddish"],
    back: [],
    notAllowed:
      "Pin Hole, Dead Knots, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    image: null,
  },
  {
    name: "GRADE C",
    type: "two-sided",
    face: [
      "Un-uniform color",
      "Bluestain",
      "Pinkish-reddish",
      "Minority Heart/Pulur",
    ],
    back: [],
    notAllowed:
      "Pin Hole, Dead Knots, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    image: null,
  },
  {
    name: "GRADE CD",
    type: "one-sided",
    face: [
      "Un-uniform color",
      "Bluestain",
      "Heart/Pulur",
      "Small Knots",
      "Pinhole max 6 spot",
    ],
    back: [],
    notAllowed: "Rotten, Mold, Fungus, Split, Delamination, Undersize.",
    image: null,
  },
  {
    name: "GRADE D",
    type: "one-sided",
    face: [
      "Heavy Bluestain",
      "Heart/Pulur",
      "Knots max dia 30mm",
      "Pinhole 7–10 spot",
      "Small crack",
    ],
    back: [],
    notAllowed: "Rotten, Mold, Fungus, Split, Delamination, Undersize.",
    image: null,
  },
];

export default function GradeClassification() {
  const row1 = grades.slice(0, 3);
  const row2 = grades.slice(3);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1 — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {row1.map((grade) => (
            <GradeCard key={grade.name} grade={grade} />
          ))}
        </div>

        {/* Row 2 — 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {row2.map((grade) => (
            <GradeCard key={grade.name} grade={grade} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GradeCard({ grade }: { grade: (typeof grades)[0] }) {
  return (
    <Card className="relative overflow-hidden bg-[#FAF6F0] border border-[#866544]/20 shadow-sm text-center flex flex-col items-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#CA9C60]/60 hover:bg-[#F5EDE0] group cursor-pointer h-full">
      {/* Top gold strip */}
      <div className="absolute top-0 left-0 w-full h-4 bg-[#CA9C60]" />

      {/* Grade name */}
      <div className="w-full bg-[#CA9C60] text-white text-sm font-bold tracking-widest pt--1 pb-4 text-center mb-[-17]">
        {grade.name}
      </div>

      {/* Image area */}
      <div className="relative w-full h-72 bg-[#A0845C] mb-[-17] overflow-hidden">
        {grade.image ? (
          <Image
            src={grade.image}
            alt={grade.name}
            fill
            className="object-cover"
            style={{
              objectPosition: "center center",
              transform: "scale(1.1)", // zoom in — increase for more zoom
              transformOrigin: "63% center",
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#C4A882] to-[#8B6F4E] flex items-center justify-center">
            <span className="text-white/50 text-xs">Product Image</span>
          </div>
        )}
      </div>

      {/* Face | Back label bar — always shown, all cards */}
      <div className="w-full flex bg-[#7A5230] text-white text-[14px] font-bold tracking-widest">
        <div className="flex-1 text-center py-3 border-r border-white/20">
          FACE
        </div>
        <div className="flex-1 text-center py-3">BACK</div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-5 py-5 flex-1 w-full text-left">
        {/* Face */}
        <div className="min-h-[80px]">
          <p className="text-[#5C3D1E] font-semibold text-[14px] mb-1.5">Face</p>
          <ul className="text-[#7A5C3A] text-xs space-y-1">
            {grade.face.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Thin divider */}
        <div className="w-full h-px bg-[#CA9C60]/20" />

        {/* Back */}
        <div className="min-h-[60px]">
          <p className="text-[#5C3D1E] font-semibold text-[14px] mb-1.5">Back</p>
          <ul className="text-[#7A5C3A] text-xs space-y-1">
            {grade.back.length > 0 ? (
              grade.back.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li className="text-[#CA9C60]/50 italic">Same as face</li>
            )}
          </ul>
        </div>

        {/* Bottom divider + Not Allowed */}
        <div className="mt-auto pt-2 border-t border-[#CA9C60]/20 w-full">
          <p className="text-[#A0341E] font-bold text-[14px] mb-1">Not allowed</p>
          <p className="text-[#7A5C3A] text-xs leading-relaxed">
            {grade.notAllowed}
          </p>
        </div>
      </div>
    </Card>
  );
}
