import { formatPrice } from "../../utils/formatters";

export default function OrderSummary({ items, total }) {
  return (
    <div className="bg-[#f7f5f2] p-6 md:p-8">
      <h3 className="text-sm uppercase tracking-wider font-medium text-gray-900 mb-6">
        Order Summary
      </h3>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.product_id} className="flex gap-3">
            <img
              src={item.product?.image_url || "/newshero.jpg"}
              alt={item.product?.name}
              className="w-16 h-16 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.product?.name}
              </p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity} x {formatPrice(item.product?.price || 0)}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatPrice((item.product?.price || 0) * item.quantity)}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Shipping</span>
          <span>Calculated at next step</span>
        </div>
        <div className="flex justify-between font-medium text-gray-900 mt-4 text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
