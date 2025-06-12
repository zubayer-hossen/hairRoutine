import React from "react";

const History = ({ data }) => {
  const previous = data.filter(
    (item) => item.date !== new Date().toISOString().split("T")[0]
  );

  if (!previous.length) return null;

  return (
    <div className="mt-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-center text-gray-700 mb-4">
        📚 পুরনো দিনের হিসেব
      </h2>
      <div className="space-y-4">
        {previous.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-blue-600">📅 {item.date}</h3>
            <ul className="list-disc list-inside text-sm">
              <li>রেকার ট্যাবলেট: {item.recur_tablet ? "✔️" : "❌"}</li>
              <li>পানির পরিমাণ: {item.water_intake ? "✔️" : "❌"}</li>
              <li>মিনোক্সিডিল: {item.minoxidil ? "✔️" : "❌"}</li>
              <li>তেল ব্যবহার: {item.oil ? "✔️" : "❌"}</li>
              <li>শ্যাম্পু: {item.shampoo ? "✔️" : "❌"}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
