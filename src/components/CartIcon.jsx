import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function CartIcon() {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <Link
      to="/cart"
      className="relative w-9 h-9 sm:w-10 sm:h-10 grid place-items-center text-gray-900 text-lg sm:text-xl border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
      title="Cart"
    >
      <FiShoppingBag />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-black text-white text-xs font-medium rounded-full px-1">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
