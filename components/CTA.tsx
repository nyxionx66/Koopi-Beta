import Link from "next/link";

export function CTA() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-24 sm:px-16 sm:py-32">
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight">
              Ready to start
              <br />
              <span className="font-extralight">selling?</span>
            </h2>
            <p className="text-xl text-neutral-300 mb-12 font-light">
              Join thousands of entrepreneurs who trust Koopi to power their online stores.
              <br />
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/signup"
                className="px-10 py-4 text-base font-medium text-black bg-white rounded-full hover:bg-neutral-100 transition-all"
              >
                Start for free
              </Link>
              <Link
                href="#features"
                className="px-10 py-4 text-base font-light text-white border border-white/20 rounded-full hover:bg-white/5 transition-all"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
