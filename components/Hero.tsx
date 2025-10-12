import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1632893037506-aac33bf18107"
          alt="E-commerce background"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.1]">
              Be the next
              <br />
              <span className="font-extralight">big thing</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-lg font-light">
              Dream big, build fast, and grow far on Koopi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/signup"
                className="px-8 py-4 text-base font-medium text-black bg-white rounded-full hover:bg-neutral-100 transition-all inline-block"
              >
                Start for free
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="hidden lg:block relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
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
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
