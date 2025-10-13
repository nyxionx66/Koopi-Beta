import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Users, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
  return (
    <StaticPageLayout title="Community">
      <p className="text-xl">Join our community to connect with other sellers, share your experiences, and get advice from the Koopi team.</p>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Community Forum</h3>
            <p>Ask questions, share your store, and get feedback from other Koopi users.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Live Events</h3>
            <p>Join us for live Q&A sessions, workshops, and other events.</p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}