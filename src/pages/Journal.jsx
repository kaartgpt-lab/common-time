import { Link } from "react-router-dom";
import { POSTS } from "../data/journal";

export default function Journal() {
  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 pt-14 pb-10 border-b border-black/5">
        <p className="text-[9px] uppercase tracking-[0.45em] text-[#8b7355] font-[Garet_Book] mb-3">
          from the journal
        </p>
        <h1 className="font-[Bai_Jamjuree] font-light text-[#1a1a1a] text-3xl md:text-4xl">
          brew notes
        </h1>
      </div>

      {/* Featured post (first) */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 pt-10 pb-4">
        <Link to={`/journal/${POSTS[0].slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="overflow-hidden aspect-[4/3] md:aspect-auto">
            <img
              src={POSTS[0].image}
              alt={POSTS[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355] font-[Garet_Book]">
                {POSTS[0].category}
              </span>
              <span className="w-px h-3 bg-black/15" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/35 font-[Garet_Book]">
                {POSTS[0].readTime}
              </span>
            </div>
            <h2 className="font-[Bai_Jamjuree] font-light text-[#1a1a1a] text-2xl md:text-3xl leading-tight mb-4 group-hover:text-[#8b7355] transition-colors duration-300">
              {POSTS[0].title}
            </h2>
            <p className="font-[Garet_Book] text-[14px] text-[#1a1a1a]/55 leading-relaxed mb-6">
              {POSTS[0].excerpt}
            </p>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-[Garet_Book] text-[#8b7355]">
              read more
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 my-10">
        <div className="h-px bg-black/5" />
      </div>

      {/* Rest of posts */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {POSTS.slice(1).map((post) => (
            <Link key={post.slug} to={`/journal/${post.slug}`} className="group flex flex-col">
              <div className="overflow-hidden aspect-[4/3] mb-5">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355] font-[Garet_Book]">
                  {post.category}
                </span>
                <span className="w-px h-3 bg-black/15" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/35 font-[Garet_Book]">
                  {post.readTime}
                </span>
              </div>
              <h3 className="font-[Bai_Jamjuree] font-light text-[#1a1a1a] text-lg md:text-xl leading-snug mb-3 group-hover:text-[#8b7355] transition-colors duration-300">
                {post.title}
              </h3>
              <p className="font-[Garet_Book] text-[13px] text-[#1a1a1a]/55 leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
