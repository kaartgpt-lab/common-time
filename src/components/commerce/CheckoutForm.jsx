export default function CheckoutForm({ form, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm uppercase tracking-wider font-medium text-gray-900 mb-4">
          Shipping Address
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={form.name}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone *"
            value={form.phone}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-400"
          />
          <input
            type="text"
            name="address_line1"
            placeholder="Address Line 1 *"
            value={form.address_line1}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-400"
          />
          <input
            type="text"
            name="address_line2"
            placeholder="Address Line 2 (optional)"
            value={form.address_line2}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-400"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={form.city}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-400"
            />
            <input
              type="text"
              name="state"
              placeholder="State *"
              value={form.state}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode *"
            value={form.pincode}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#6B5344] text-white text-sm uppercase tracking-wider font-medium hover:bg-[#5a4538] disabled:opacity-70 transition-colors"
      >
        {loading ? "Processing..." : "Continue to Payment"}
      </button>
    </form>
  );
}
