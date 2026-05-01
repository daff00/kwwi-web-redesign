import { Factory, BadgeCheck, Globe2 } from "lucide-react";

export const statCards = [
  {
    number: "01",
    icon: Factory,
    title: "Heritage in Manufacturing",
    description:
      "Established in 1998, our 25+ years of experience reflect a sustained commitment to precision, reliability, and mastery in FJLB production.",
    footer: "Since 1998 | 25+ Years",
  },
  {
    number: "02",
    icon: BadgeCheck,
    title: "Verified Legal Sourcing",
    description:
      "Fully certified under SVLK/TLAS (VLHH-36-12-0008), ensuring all materials are responsibly sourced in compliance with international legality standards.",
    footer: "SVLK/TLAS | VLHH-36-12-0008",
  },
  {
    number: "03",
    icon: Globe2,
    title: "Export-Caliber Excellence",
    description:
      "Manufactured under rigorous quality control protocols, consistently meeting the exacting standards of markets such as Japan and South Korea.",
    footer: "Japan | South Korea | Indonesia",
  },
];

export const processCards = [
  { number: "01", title: "Band Saw", description: "Precision cutting of raw timber into workable strips and blanks for further processing.", image: "/bandsaw-img.webp" },
  { number: "02", title: "Kiln Dry", description: "Controlled drying chamber maintaining MC < 12% for dimensional stability and export compliance.", image: "/kiln-dry-img.webp" },
  { number: "03", title: "Sawn Timber", description: "Initial breakdown of log sections into uniform timber pieces ready for grading and sorting.", image: "/sawn-timber-img.webp" },
  { number: "04", title: "Double Planner & Multirip", description: "Simultaneous two-face planing and multi-blade ripping for consistent thickness and width.", image: "/dbl-planner-multirip-img.webp" },
  { number: "05", title: "Quality Sorting", description: "Grade classification of strips by surface quality, color uniformity, and defect inspection per grade standard.", image: "/quality-sorting.webp" },
  { number: "06", title: "Finger-Joint Machine", description: "High-speed automated profiling and joining of timber strips into continuous finger-jointed blanks.", image: "/finger-joined-machine.webp" },
  { number: "07", title: "High Frequency Laminating Machine", description: "HF-powered press ensuring rapid, uniform glue curing and warp-free board output with stable MC.", image: "/hf-laminating-img.webp" },
  { number: "08", title: "Sanding Machine", description: "Wide-belt sanding for precise thickness calibration and smooth surface finish meeting export grade requirements.", image: "/sanding-mchn-img.webp" },
];