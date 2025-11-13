import { useParams, Link } from "react-router-dom";
import { merchItems } from "../data/merchData";
import FAQSection from "../components/FAQSection";
import ReviewSection from "../components/ReviewSection";

export default function ProductPage() {
  const { id } = useParams();
  const product = merchItems.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="text-black p-10 text-center">Product not found.</div>
    );
  }

  const related = merchItems.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="bg-white text-black min-h-screen py-16 px-4 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Product Hero Section */}
        <section className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[450px] object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              {product.description}
            </p>

            <p className="text-3xl font-semibold mb-8">${product.price}</p>

            <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-900 transition">
              Add to Cart
            </button>

            {/* Product Details */}
            <div className="mt-10 space-y-2 text-gray-600 text-sm leading-relaxed">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              {product.flavorNotes && (
                <p>
                  <span className="font-semibold">Flavor Notes:</span>{" "}
                  {product.flavorNotes.join(", ")}
                </p>
              )}
              {product.ingredients && (
                <p>
                  <span className="font-semibold">Ingredients:</span>{" "}
                  {product.ingredients.join(", ")}
                </p>
              )}
              {product.process && (
                <p>
                  <span className="font-semibold">Process:</span>{" "}
                  {product.process}
                </p>
              )}
              <p>
                <span className="font-semibold">Quality:</span>{" "}
                {product.quality}
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-16" />

        {/* Reviews */}
        <ReviewSection reviews={product.reviews} />

        {/* FAQs */}
        <FAQSection />

        {/* Divider */}
        <div className="h-px bg-gray-200 my-16" />

        {/* Related Products */}
        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-8 text-center">
            You Might Also Like
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/merch/${item.id}`}
                className="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-lg font-semibold group-hover:underline">
                    {item.name}
                  </p>
                  <p className="text-gray-500 mt-1">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
