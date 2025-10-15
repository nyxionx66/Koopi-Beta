'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileText, Scale, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-gray-500/10 border border-gray-500/20 rounded-full px-4 py-2 mb-6">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-600">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 15, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/70 rounded-[24px] border border-white/30 shadow-xl p-8 sm:p-12">
            
            {/* Important Notice */}
            <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Important Notice</h3>
                  <p className="text-sm text-gray-700">
                    By accessing and using Koopi, you accept and agree to be bound by these Terms and Conditions. Please read them carefully before using our platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              {/* Section 1 */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">1. Agreement to Terms</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  These Terms and Conditions constitute a legally binding agreement between you and Koopi ("Company", "we", "us", or "our") concerning your access to and use of the Koopi platform, including our website and services.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By creating an account or using our services, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Platform</h2>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Permitted Use</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may use Koopi to create and manage your online store, sell products, and interact with customers. You agree to use the platform only for lawful purposes and in accordance with these Terms.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">2.2 Prohibited Activities</h3>
                <p className="text-gray-700 leading-relaxed mb-3">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Sell illegal, counterfeit, or prohibited items</li>
                  <li>Engage in fraudulent activities or scams</li>
                  <li>Violate intellectual property rights</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to access unauthorized areas of the platform</li>
                  <li>Use the platform to distribute malware or viruses</li>
                  <li>Impersonate other users or entities</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Responsibilities</h2>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms or engage in suspicious activities.
                </p>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">4. Intellectual Property</h2>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Our Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  All content on the Koopi platform, including text, graphics, logos, icons, images, audio clips, and software, is the property of Koopi and is protected by international copyright laws.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">4.2 Your Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of all content you upload to your store. By uploading content, you grant Koopi a non-exclusive, worldwide, royalty-free license to use, reproduce, and display your content solely for the purpose of operating and improving our services.
                </p>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pricing and Payments</h2>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 Free Services</h3>
                <p className="text-gray-700 leading-relaxed">
                  Koopi currently offers its core services for free, including unlimited products and basic features. We reserve the right to introduce paid plans in the future with advance notice to users.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">5.2 Transaction Fees</h3>
                <p className="text-gray-700 leading-relaxed">
                  Standard payment processing fees apply when using integrated payment gateways. These fees are set by third-party payment processors.
                </p>
              </div>

              {/* Section 6 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  To the maximum extent permitted by law, Koopi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the platform.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We do not guarantee uninterrupted or error-free operation of the platform and are not responsible for any loss of data or business interruption.
                </p>
              </div>

              {/* Section 7 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your use of Koopi is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using our platform, you consent to our data practices as described in the Privacy Policy.
                </p>
              </div>

              {/* Section 8 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your access to Koopi at any time, with or without cause or notice, including for violation of these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You may terminate your account at any time by contacting our support team. Upon termination, your right to use the platform will immediately cease.
                </p>
              </div>

              {/* Section 9 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on our platform and updating the "Last updated" date.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Your continued use of Koopi after such modifications constitutes your acceptance of the updated Terms.
                </p>
              </div>

              {/* Section 10 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
                </p>
              </div>

              {/* Section 11 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                  <p className="text-gray-700"><strong>Email:</strong> legal@koopi.lk</p>
                  <p className="text-gray-700 mt-2"><strong>Support:</strong> support@koopi.lk</p>
                </div>
              </div>

              {/* Acceptance */}
              <div className="mt-12 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Acceptance of Terms</h3>
                <p className="text-sm text-gray-700">
                  By clicking "I agree" during signup or by using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
