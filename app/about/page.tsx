import { StaticPageLayout } from "@/components/StaticPageLayout";

import { Zap, Target, Eye } from 'lucide-react';

export default function AboutPage() {
  return (
    <StaticPageLayout title="About Koopi">
      <p className="text-xl">Koopi is a modern e-commerce platform designed to help you build and launch your online store in minutes. We provide beautiful themes, easy management, and powerful features to help you succeed.</p>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our Mission</h3>
          <p>To empower entrepreneurs and small businesses to create their own online presence and reach a global audience.</p>
        </div>
        <div className="text-center">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our Vision</h3>
          <p>We believe that everyone should have the opportunity to turn their passion into a thriving business, and we're here to help you every step of the way.</p>
        </div>
        <div className="text-center">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <Eye className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our Focus</h3>
          <p>We are focused on providing a simple, beautiful, and powerful platform that is accessible to everyone, regardless of technical skill.</p>
        </div>
      </div>
    </StaticPageLayout>
  );
}