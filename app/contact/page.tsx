import { StaticPageLayout } from "@/components/StaticPageLayout";

import { Mail, MessageCircle, Twitter } from 'lucide-react';

export default function ContactPage() {
  return (
    <StaticPageLayout title="Contact Us">
      <p className="text-xl">Have a question or need help? We'd love to hear from you. Here are the best ways to reach us.</p>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Email</h3>
          <p>The best way to get in touch is by email. We'll do our best to get back to you as soon as possible.</p>
          <a href="mailto:support@koopi.com" className="text-blue-600 font-medium hover:underline">support@koopi.com</a>
        </div>
        <div className="text-center">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Live Chat</h3>
          <p>For quick questions, you can use the live chat feature on our website. We're available during business hours.</p>
        </div>
        <div className="text-center">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <Twitter className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Social Media</h3>
          <p>You can also reach out to us on our social media channels. We're active on Twitter, Facebook, and Instagram.</p>
        </div>
      </div>
    </StaticPageLayout>
  );
}