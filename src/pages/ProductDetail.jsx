import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { formatPrice, slugify } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../components/QuantitySelector";
import ProductGrid from "../components/commerce/ProductGrid";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;

      setLoading(true);

      const isUuid = /^[0-9a-f-]{36}$/i.test(slug);
      let data = null;

      if (isUuid) {
        const res = await supabase
          .from("products")
          .select(`
            *,
            product_images (*)
          `)
          .eq("id", slug)
          .eq("is_active", true)
          .single();

        data = res.data;
      } else {
        const res = await supabase
          .from("products")
          .select(`
            *,
            product_images (*)
          `)
          .eq("slug", slug)
          .eq("is_active", true)
          .single();

        if (res.data) {
          data = res.data;
        } else {
          const allRes = await supabase
            .from("products")
            .select(`
              *,
              product_images (*)
            `)
            .eq("is_active", true);

          const match = (allRes.data || []).find(
            (p) => slugify(p.name) === slug
          );

          data = match || null;
        }
      }

      if (!data) {
        setProduct(null);
        setRelated([]);
      } else {
        setProduct(data);

        const { data: rel } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);

        setRelated(rel || []);
      }

      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product.id, quantity);
    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <main className="min-h-screen py-20 flex justify-center">
        <div className="w-full max-w-5xl aspect-[16/10] bg-gray-100 animate-pulse" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen py-20 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-gray-900 underline">
          Back to Shop
        </Link>
      </main>
    );
  }

  const notes = product.tasting_notes || product.notes || product.flavor_notes;
  const notesText = Array.isArray(notes) ? notes.join(", ") : notes || "";

  const images =
    product.product_images?.length > 0
      ? [...product.product_images].sort((a, b) => a.position - b.position)
      : product.image_url
      ? [{ image_url: product.image_url }]
      : [];

  return (
    <main className="min-h-screen py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          {" / "}
          <Link to="/shop" className="hover:text-gray-900">Shop</Link>
          {" / "}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">

          {/* Product Images */}

          <div>
            {images.length > 0 && (
              <>
                <img
                  src={images[activeImage]?.image_url}
                  alt={product.name}
                  className="w-full aspect-[4/5] object-cover mb-4"
                />

                {images.length > 1 && (
                  <div className="flex gap-3">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`border ${
                          activeImage === index
                            ? "border-black"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={img.image_url}
                          alt=""
                          className="w-20 h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Product Info */}

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
              {product.category}
            </p>

            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6 tracking-tight">
              {product.name}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {product.origin && (
              <p className="text-sm text-gray-500 mb-4">
                {product.origin}
              </p>
            )}

            {notesText && (
              <p className="text-sm text-gray-600 mb-6">
                <span className="uppercase tracking-wider text-gray-500">
                  Notes:
                </span>{" "}
                {notesText}
              </p>
            )}

            <p className="text-xl font-normal text-gray-900 mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="flex items-center gap-6 mb-8">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock_quantity || 99}
              />

              <button
                onClick={handleAddToCart}
                className="px-10 py-3 bg-[#6B5344] text-white text-sm uppercase tracking-wider font-medium hover:bg-[#5a4538] transition-colors"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              You May Also Like
            </h2>

            <ProductGrid products={related} columns={3} />
          </section>
        )}

      </div>
    </main>
  );
}