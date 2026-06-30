import { Link } from "react-router-dom";
import { POSTS } from "../../data/journal";

export default function BlogSection() {
  return (
    <section className="bg-[#F9F7F2] py-16 md:py-24 border-t border-black/5">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#8b7355] font-[Garet_Book] mb-3">
              from the journal
            </p>
            <h2 className="text-2xl md:text-3xl font-light font-[Bai_Jamjuree] text-[#1a1a1a] leading-tight">
              brew notes
            </h2>
          </div>
          <Link
            to="/journal"
            className="hidden md:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-[Garet_Book] text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors duration-300"
          >
            all posts
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {POSTS.map((post) => (
            <Link key={post.slug} to={`/journal/${post.slug}`} className="group flex flex-col">

              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3] mb-5">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355] font-[Garet_Book]">
                  {post.category}
                </span>
                <span className="w-px h-3 bg-black/15" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/35 font-[Garet_Book]">
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-[Bai_Jamjuree] font-light text-[#1a1a1a] text-lg leading-snug mb-3 group-hover:text-[#8b7355] transition-colors duration-300">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-[13px] font-[Garet_Book] text-[#1a1a1a]/55 leading-relaxed flex-1">
                {post.excerpt}
              </p>

              {/* Read more */}
              <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-[Garet_Book] text-[#1a1a1a]/40 group-hover:text-[#8b7355] transition-colors duration-300">
                read more
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

            </Link>
          ))}
        </div>

        {/* Mobile all posts link */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-[Garet_Book] text-[#1a1a1a]/50 border border-black/15 px-6 py-3"
          >
            all posts
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
