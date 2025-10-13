import { ReactNode } from 'react';
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type StaticPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function StaticPageLayout({ title, children }: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] relative">
      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <div className="relative z-10">
        <Header />
        <main className="py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8 sm:p-12">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">{title}</h1>
              </div>
              <div className="mt-12 prose prose-lg lg:prose-xl text-gray-700 max-w-3xl prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500">
                {children}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}