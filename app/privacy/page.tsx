import { StaticPageLayout } from "@/components/StaticPageLayout";

export default function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p className="text-lg">Last updated: October 13, 2025</p>
      <p>At Koopi, accessible from koopi.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Koopi and how we use it.</p>
      <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
      
      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Log Files</h2>
          <p>Koopi follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Cookies and Web Beacons</h2>
          <p>Like any other website, Koopi uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
        </div>
      </div>
    </StaticPageLayout>
  );
}