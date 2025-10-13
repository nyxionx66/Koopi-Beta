import { StaticPageLayout } from "@/components/StaticPageLayout";
import { LifeBuoy, BookOpen, Users, BarChart } from 'lucide-react';

export default function HelpPage() {
  return (
    <StaticPageLayout title="Help Center">
      <p className="text-xl">Welcome to the Koopi Help Center. Here you can find answers to your questions and get the support you need.</p>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <LifeBuoy className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Getting Started</h3>
            <p>Find out how to set up your store, add products, and start selling.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Documentation</h3>
            <p>Explore our detailed documentation to learn about all of Koopi's features.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p>Join our community to connect with other sellers and get advice.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <BarChart className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Status</h3>
            <p>Check the status of our services and get updates on any issues.</p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}