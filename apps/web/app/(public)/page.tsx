import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to KWWI',
};

export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}