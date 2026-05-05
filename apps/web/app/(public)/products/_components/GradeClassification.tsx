import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  gradeClassificationsSchema,
  type GradeClassificationRow,
} from "@kwwi/shared";
import Image from "next/image";

export default async function GradeClassification() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grade_classifications")
    .select("id, name, type, face, back, not_allowed, image, sort_order")
    .order("sort_order", { ascending: true });

  const parsed = gradeClassificationsSchema.safeParse(data ?? []);

  if (error || !parsed.success) {
    return (
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#866544]">
            Unable to load grade classifications right now.
          </p>
        </div>
      </section>
    );
  }

  const grades = parsed.data;
  const row1 = grades.slice(0, 3);
  const row2 = grades.slice(3);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {row1.map((grade) => (
            <GradeCard key={grade.id} grade={grade} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {row2.map((grade) => (
            <GradeCard key={grade.id} grade={grade} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GradeCard({ grade }: { grade: GradeClassificationRow }) {
  return (
    <Card className="relative overflow-hidden bg-[#FAF6F0] border border-[#866544]/20 shadow-sm text-center flex flex-col items-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#CA9C60]/60 hover:bg-[#F5EDE0] group cursor-pointer h-full">
      <div className="absolute top-0 left-0 w-full h-4 bg-[#CA9C60]" />

      <div className="w-full bg-[#CA9C60] text-white text-sm font-bold tracking-widest pt-1 pb-4 text-center mb-[-17px]">
        {grade.name}
      </div>

      <div className="relative w-full h-72 bg-[#A0845C] mb-[-17px] overflow-hidden">
        <Image
          src={grade.image}
          alt={grade.name}
          fill
          className="object-cover"
          style={{
            objectPosition: "center center",
            transform: "scale(1.1)",
            transformOrigin: "63% center",
          }}
        />
      </div>

      <div className="w-full flex bg-[#7A5230] text-white text-[14px] font-bold tracking-widest">
        <div className="flex-1 text-center py-3 border-r border-white/20">
          FACE
        </div>
        <div className="flex-1 text-center py-3">BACK</div>
      </div>

      <div className="flex flex-col gap-3 px-5 py-5 flex-1 w-full text-left">
        <div className="min-h-[80px]">
          <p className="text-[#5C3D1E] font-semibold text-[14px] mb-1.5">
            Face
          </p>
          <ul className="text-[#7A5C3A] text-xs space-y-1">
            {grade.face.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <div className="w-full h-px bg-[#CA9C60]/20" />

        <div className="min-h-[60px]">
          <p className="text-[#5C3D1E] font-semibold text-[14px] mb-1.5">
            Back
          </p>
          <ul className="text-[#7A5C3A] text-xs space-y-1">
            {grade.back.length > 0 ? (
              grade.back.map((item) => <li key={item}>- {item}</li>)
            ) : (
              <li className="text-[#CA9C60]/50 italic">Same as face</li>
            )}
          </ul>
        </div>

        <div className="mt-auto pt-2 border-t border-[#CA9C60]/20 w-full">
          <p className="text-[#A0341E] font-bold text-[14px] mb-1">
            Not allowed
          </p>
          <p className="text-[#7A5C3A] text-xs leading-relaxed">
            {grade.not_allowed}
          </p>
        </div>
      </div>
    </Card>
  );
}