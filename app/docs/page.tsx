import { StaticPageLayout } from "@/components/StaticPageLayout";
import { BookOpen, Search } from 'lucide-react';

export default function DocsPage() {
  return (
    <StaticPageLayout title="Documentation">
      <p className="text-xl">Explore our detailed documentation to learn about all of Koopi's features and how to get the most out of our platform.</p>
      
      <div className="mt-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full text-lg"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}