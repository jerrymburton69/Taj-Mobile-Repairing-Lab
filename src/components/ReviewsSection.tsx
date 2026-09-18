import React from 'react';
import { ReviewItem } from '../types';
import { Star, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <section id="reviews" className="w-full py-20 lg:py-28 bg-[#0b0c10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-amber-400 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>VERIFIED CLIENT REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Trusted by Power Users & Professionals
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Real feedback from customers who brought their flagship smartphones to our Gulberg III lab.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#111218] rounded-2xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-zinc-500">{rev.date}</span>
                </div>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {rev.author}
                    {rev.verified && (
                      <span title="Verified Customer" className="inline-flex">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    {rev.device} • <span className="text-sky-400">{rev.service}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
