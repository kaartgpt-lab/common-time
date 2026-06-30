import { useParams, Link, Navigate } from "react-router-dom";
import { getPost, POSTS } from "../data/journal";

function renderBlock(block, i) {
  if (block.type === "h2") {
    return (
      <h2 key={i} className="font-[Bai_Jamjuree] font-light text-xl md:text-2xl text-[#1a1a1a] mt-10 mb-4 leading-snug">
        {block.text}
      </h2>
    );
  }
  return (
    <p key={i} className="font-[Garet_Book] text-[15px] md:text-base text-[#1a1a1a]/70 leading-relaxed mb-5">
      {block.text}
    </p>
  );
}

export default function JournalPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <Navigate to="/journal" replace />;

  const related = POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero image */}
      <div className="w-full" style={{ height: "clamp(280px, 55vw, 560px)" }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article */}
      <div className="max-w-[680px] mx-auto px-5 md:px-6 py-12 md:py-16">

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/journal"
            className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355] font-[Garet_Book] hover:opacity-70 transition-opacity"
          >
            ← journal
          </Link>
          <span className="w-px h-3 bg-black/15" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/35 font-[Garet_Book]">
            {post.category}
          </span>
          <span className="w-px h-3 bg-black/15" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/35 font-[Garet_Book]">
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-[Bai_Jamjuree] font-light text-[#1a1a1a] text-2xl md:text-4xl leading-tight mb-3">
          {post.title}
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#1a1a1a]/30 font-[Garet_Book] mb-10">
          {post.date}
        </p>

        {/* Divider */}
        <div className="w-10 h-px bg-[#8b7355]/40 mb-10" />

        {/* Body */}
        <div>
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* End mark */}
        <div className="flex items-center gap-4 mt-12 pt-10 border-t border-black/8">
          <div className="w-6 h-px bg-[#8b7355]/50" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355]/60 font-[Garet_Book]">
            common time
          </span>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-[#F9F7F2] py-14 md:py-20 border-t border-black/5">
          <div className="max-w-[1200px] mx-auto px-5 md:px-6">
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#8b7355] font-[Garet_Book] mb-8">
              more from the journal
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((p) => (
                <Link key={p.slug} to={`/journal/${p.slug}`} className="group flex gap-5 items-start">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.35em] text-[#8b7355] font-[Garet_Book] mb-2">
                      {p.category}
                    </p>
                    <h3 className="font-[Bai_Jamjuree] font-light text-[#1a1a1a] text-base leading-snug group-hover:text-[#8b7355] transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-[#1a1a1a]/40 font-[Garet_Book] mt-1">{p.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
