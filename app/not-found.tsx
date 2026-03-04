import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-300 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-amber-200 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">

        {/* Bouncing beads */}
        <div className="flex items-end justify-center gap-2 mb-6">
          {[
            { color: 'from-purple-400 to-pink-300', delay: '0s',    size: 'w-5 h-5' },
            { color: 'from-amber-400 to-orange-300', delay: '0.15s', size: 'w-7 h-7' },
            { color: 'from-blue-400 to-cyan-300',   delay: '0.3s',  size: 'w-4 h-4' },
            { color: 'from-rose-400 to-pink-400',   delay: '0.1s',  size: 'w-6 h-6' },
            { color: 'from-green-400 to-emerald-300',delay: '0.25s', size: 'w-3 h-3' },
          ].map((bead, i) => (
            <div
              key={i}
              className={`rounded-full bg-gradient-to-br ${bead.color} ${bead.size} shadow-md`}
              style={{ animation: 'bounce 1s ease-in-out infinite', animationDelay: bead.delay }}
            />
          ))}
        </div>

        {/* 404 */}
        <h1 className="text-[7rem] sm:text-[9rem] font-black leading-none bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent select-none">
          404
        </h1>

        {/* Bead string decoration under 404 */}
        <div className="flex items-center gap-1.5 my-3">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-purple-300" />
          {['bg-purple-400', 'bg-pink-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-400'].map((c, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${c} opacity-70`} />
          ))}
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-purple-300" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-2 mb-3">
          This bead rolled away 🧿
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to the collection!
        </p>

        {/* CTA */}
        <Link
          href="/store"
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          ✨ Back to Collection
        </Link>

        {/* Brand watermark */}
        <div className="flex items-center gap-2 mt-10 opacity-50">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-300" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-300" />
          </div>
          <span className="text-xs font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Dangling Co.
          </span>
        </div>
      </div>
    </div>
  );
}