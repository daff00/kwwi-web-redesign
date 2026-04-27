import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContactForm from '@/components/sections/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          <CardDescription>
            Fill out the form below and we will get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}