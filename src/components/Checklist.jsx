import React from "react";

const Checklist = ({ item, index, toggleField }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center mb-2 text-blue-700">
        📅 তারিখ: {item.date}
      </h2>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.recur_tablet}
            onChange={() => toggleField(index, "recur_tablet")}
          />
          রেকার ট্যাবলেট
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.water_intake}
            onChange={() => toggleField(index, "water_intake")}
          />
          পানির পরিমাণ ঠিক রাখছো
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.minoxidil}
            onChange={() => toggleField(index, "minoxidil")}
          />
          মিনোক্সিডিল ইউজ
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.oil}
            onChange={() => toggleField(index, "oil")}
          />
          তেল ব্যবহার
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.shampoo}
            onChange={() => toggleField(index, "shampoo")}
          />
          শ্যাম্পু
        </label>
      </div>
    </div>
  );
};

export default Checklist;
