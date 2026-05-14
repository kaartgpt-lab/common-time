import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#fafaf8] border-t border-gray-200 font-[Bai_Jamjuree] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Row 1: Brand & Nav */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-light  tracking-[0.2em] uppercase text-black">
              Common Time
            </h2>
            <span className="text-xs text-gray-400 uppercase tracking-widest hidden md:block">
              / New Delhi
            </span>
          </div>
          
          <nav className="flex gap-x-8">
            {['shop', 'terms', 'about'].map((item) => (
              <Link 
                key={item}
                to={item=='about'? `/coming-soon`:`/${item}`} 
                className="text-[18px] font-light uppercase tracking-tight text-black transition-all duration-300 hover:opacity-60 hover:scale-105"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Row 2: Credit & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 mt-4">
          <p className="text-xs font-light text-black uppercase tracking-wide">
            by <span className="font-light">Bhatia Hospitality Group</span>
          </p>
          
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            © {new Date().getFullYear()} • All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
}