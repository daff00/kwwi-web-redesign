import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to KWWI',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        {/* Black 20% Tint Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Seamless Gradient Fade at the Bottom */}
        {/* Change from-[#866544] to from-white if your next section is actually white */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#866544] to-transparent z-0"></div>

        {/* Content (z-10 keeps it above the tint and gradient) */}
        <div className="relative z-10 text-center">
          <h1 className="text-white text-5xl font-bold drop-shadow-md">Home Hero Section</h1>
        </div>
      </section>
      
    </div>
  );
}