import { StaticPageLayout } from "@/components/StaticPageLayout";

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms and Conditions">
      <p className="text-lg">Last updated: October 13, 2025</p>
      <p>Welcome to Koopi! These terms and conditions outline the rules and regulations for the use of Koopi's Website, located at koopi.com.</p>
      <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Koopi if you do not agree to take all of the terms and conditions stated on this page.</p>
      
      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Cookies</h2>
          <p>We employ the use of cookies. By accessing Koopi, you agreed to use cookies in agreement with the Koopi's Privacy Policy.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">License</h2>
          <p>Unless otherwise stated, Koopi and/or its licensors own the intellectual property rights for all material on Koopi. All intellectual property rights are reserved. You may access this from Koopi for your own personal use subjected to restrictions set in these terms and conditions.</p>
          <p>You must not:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Republish material from Koopi</li>
            <li>Sell, rent or sub-license material from Koopi</li>
            <li>Reproduce, duplicate or copy material from Koopi</li>
            <li>Redistribute content from Koopi</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">User Comments</h2>
          <p>This Agreement shall begin on the date hereof.</p>
          <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Koopi does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Koopi,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.</p>
        </div>
      </div>
    </StaticPageLayout>
  );
}