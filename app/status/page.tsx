import { StaticPageLayout } from "@/components/StaticPageLayout";
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function StatusPage() {
  return (
    <StaticPageLayout title="System Status">
      <p className="text-xl">Check the status of our services and get updates on any issues. All systems are currently operational.</p>
      
      <div className="mt-12 space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-medium">Website and Storefronts</span>
          </div>
          <span className="text-green-600 font-semibold">Operational</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-medium">Dashboard and API</span>
          </div>
          <span className="text-green-600 font-semibold">Operational</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-medium">Email Notifications</span>
          </div>
          <span className="text-green-600 font-semibold">Operational</span>
        </div>
      </div>
    </StaticPageLayout>
  );
}