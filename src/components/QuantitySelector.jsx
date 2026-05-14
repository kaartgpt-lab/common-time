export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const inc = () => onChange(Math.min(max, value + 1));
  const dec = () => onChange(Math.max(min, value - 1));

  return (
    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        −
      </button>
      <span className="w-12 text-center font-medium">{value}</span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}
