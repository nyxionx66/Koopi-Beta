import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#f5f5f7]">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Be the next big thing
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
              Dream big, build fast, and grow far on Koopi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/signup"
                className="px-8 py-4 text-base font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all inline-block shadow-lg active:scale-95"
              >
                Start for free
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="hidden lg:block relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1643208589858-444e42c4c95e"
                alt="Entrepreneur working"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-gray-400/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gray-500/50 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
