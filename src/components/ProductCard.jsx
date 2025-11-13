import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-center text-zinc-100 p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-sm mb-2">{product.category}</p>
        <p className="text-lg font-bold mb-3">${product.price}</p>
        <Link
          to={`/merch/${product.id}`}
          className="bg-zinc-200 text-zinc-900 font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
