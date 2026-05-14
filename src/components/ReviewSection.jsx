export default function ReviewSection({ reviews }) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl mt-10">
      <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>
      {reviews.map((r, idx) => (
        <div key={idx} className="mb-4 border-b border-gray-700 pb-3">
          <p className="font-bold">{r.user}</p>
          <p className="text-yellow-400">{"⭐".repeat(Math.round(r.rating))}</p>
          <p className="text-gray-300 mt-1">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
