import Link from "next/link";

export function Footer() {
  return (
    <footer id="about" className="border-t border-gray-200/50 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gray-900 mb-4 inline-block">
              Koopi
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Building the future of e-commerce, one store at a time.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="#integrations" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2025 Koopi. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Terms & Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
