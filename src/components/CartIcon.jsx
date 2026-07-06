import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function CartIcon() {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <Link
      to="/cart"
      className="relative flex items-center justify-center text-[#1A1A1A] hover:opacity-70 transition-opacity"
      title="Cart"
    >
      <FiShoppingBag size={18} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center bg-[#8b7355] text-white text-[8px] font-medium rounded-full px-0.5 font-[Inter]">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
