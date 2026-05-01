import { Card } from "@/components/ui/card";

const grades = [
  {
    name: "GRADE AA",
    type: "two-sided", // face + back separately
    face: ["Reasonably uniform color", "Clear surface"],
    back: ["Un-uniform color", "Clear surface"],
    notAllowed: "Pin Hole, Dead Knots, Bluestain, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Pinkish-reddish, Delamination, Undersize.",
    cols: 3,
  },
  {
    name: "GRADE A1",
    type: "two-sided",
    face: ["Reasonably uniform color", "Clear surface"],
    back: ["Un-uniform color", "Pinkish-reddish"],
    notAllowed: "Pin Hole, Dead Knots, Bluestain, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    cols: 3,
  },
  {
    name: "GRADE AP",
    type: "one-sided", // face & back same
    faceBack: ["Un-uniform color", "Pinkish-reddish"],
    notAllowed: "Pin Hole, Dead Knots, Bluestain, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    cols: 3,
  },
  {
    name: "GRADE BS",
    type: "one-sided",
    faceBack: ["Un-uniform color", "Bluestain", "Pinkish-reddish"],
    notAllowed: "Pin Hole, Dead Knots, Heart/Pulur, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    cols: 4,
  },
  {
    name: "GRADE C",
    type: "two-sided",
    face: ["Un-uniform color", "Bluestain", "Pinkish-reddish", "Minority Heart/Pulur"],
    back: [],
    notAllowed: "Pin Hole, Dead Knots, Rotten, Mold, Fungus, Resin, Split, Delamination, Undersize.",
    cols: 4,
  },
  {
    name: "GRADE CD",
    type: "one-sided",
    faceBack: ["Un-uniform color", "Bluestain", "Heart/Pulur", "Small Knots", "Pinhole max 6 spot"],
    notAllowed: "Rotten, Mold, Fungus, Split, Delamination, Undersize.",
    cols: 4,
  },
  {
    name: "GRADE D",
    type: "one-sided",
    faceBack: ["Heavy Bluestain", "Heart/Pulur", "Knots max dia 30mm", "Pinhole 7–10 spot", "Small crack"],
    notAllowed: "Rotten, Mold, Fungus, Split, Delamination, Undersize.",
    cols: 4,
  },
];

export default function GradeClassification() {
  const row1 = grades.filter((g) => g.cols === 3);
  const row2 = grades.filter((g) => g.cols === 4);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[#5C3D1E] text-2xl font-bold mb-2">FJLB Grade Classification</h2>
        <div className="bg-[#866544] h-1 w-10 mb-10" />

        {/* Row 1 — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {row1.map((grade) => (
            <GradeCard key={grade.name} grade={grade} />
          ))}
        </div>

        {/* Row 2 — 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
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
    <Card className="overflow-hidden rounded-2xl border border-[#C8B89A]/40 shadow-sm bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#5C3D1E] text-white text-center text-xs font-bold tracking-widest py-3 px-4">
        {grade.name}
      </div>

      {/* Wood texture placeholder */}
      <div className="w-full h-20 bg-gradient-to-b from-[#C4A882] to-[#8B6F4E]" />

      {/* Face / Back labels */}
      <div className="flex border-t border-b border-[#C8B89A]/40 bg-[#3D2B1F] text-white text-[10px] font-bold tracking-widest">
        {grade.type === "two-sided" ? (
          <>
            <div className="flex-1 text-center py-2 border-r border-[#C8B89A]/30">FACE</div>
            <div className="flex-1 text-center py-2">BACK</div>
          </>
        ) : (
          <div className="flex-1 text-center py-2">FACE &amp; BACK</div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 py-4 flex-1 bg-[#F5F2EE]">
        {grade.type === "two-sided" ? (
          <>
            <div>
              <p className="text-[#3D2B1F] font-semibold text-xs mb-1">Face</p>
              <ul className="text-[#5C4033] text-xs space-y-0.5">
                {(grade.face ?? []).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            {(grade.back ?? []).length > 0 && (
              <div>
                <p className="text-[#3D2B1F] font-semibold text-xs mb-1">Back</p>
                <ul className="text-[#5C4033] text-xs space-y-0.5">
                  {(grade.back ?? []).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <ul className="text-[#5C4033] text-xs space-y-0.5">
            {(grade.faceBack ?? []).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        )}

        {/* Not Allowed */}
        <div className="mt-auto pt-2">
          <p className="text-[#A0341E] font-bold text-xs mb-1">Not allowed</p>
          <p className="text-[#5C4033] text-xs leading-relaxed">{grade.notAllowed}</p>
        </div>
      </div>
    </Card>
  );
}