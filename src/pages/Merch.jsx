import { merchItems } from "../data/merchData";
import ProductCard from "../components/ProductCard";

export default function Merch() {
  return (
    <main className="bg-white min-h-screen py-20 px-8 text-black">
      <h1 className="text-4xl font-bold text-center mb-10">CommonTime Merch</h1>
      <p className="text-center max-w-2xl mx-auto text-gray-800 mb-16">
        Explore our curated collection of coffee essentials, apparel, and
        accessories — crafted for those who live and breathe coffee culture.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {merchItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
