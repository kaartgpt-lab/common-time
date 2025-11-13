const faqs = [
  {
    q: "How long does shipping take?",
    a: "Orders are typically processed within 2–3 business days and delivered within 5–7 days.",
  },
  {
    q: "Are the coffee beans freshly roasted?",
    a: "Yes, all our coffee beans are roasted and packed within 24 hours before dispatch.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, we ship across India and plan to expand globally soon!",
  },
];

export default function FAQSection() {
  return (
    <section className="mt-10">
      <h3 className="text-2xl font-semibold mb-6">FAQs</h3>
      <div className="space-y-4">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="bg-gray-50 p-4 rounded-lg cursor-pointer open:bg-gray-50"
          >
            <summary className="font-semibold">{item.q}</summary>
            <p className="mt-2 text-gray-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
