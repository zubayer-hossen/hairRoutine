import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const tasksList = [
  "Recur Tablet",
  "Minoxidil",
  "Water Intake",
  "Oiling",
  "Shampoo",
];

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getInitialData = () => {
  const saved = localStorage.getItem("haircare_data");
  if (saved) return JSON.parse(saved);
  return {};
};

const routineData = [
  { day: "সোমবার", shampoo: "✅", oil: "❌", minoxidil: "✅" },
  { day: "মঙ্গলবার", shampoo: "❌", oil: "✅ (সকাল)", minoxidil: "✅ (রাত)" },
  { day: "বুধবার", shampoo: "✅", oil: "❌", minoxidil: "✅" },
  { day: "বৃহস্পতিবার", shampoo: "❌", oil: "✅", minoxidil: "✅" },
  { day: "শুক্রবার", shampoo: "✅", oil: "❌", minoxidil: "✅" },
  { day: "শনিবার", shampoo: "❌", oil: "✅", minoxidil: "✅" },
  { day: "রবিবার", shampoo: "✅", oil: "❌", minoxidil: "✅" },
];

const RoutineTable = () => (
  <div className="max-w-full overflow-x-auto bg-white p-4 rounded shadow mt-10">
    <h2 className="text-xl font-semibold mb-4 text-center text-indigo-600">
      সাপ্তাহিক রুটিন
    </h2>
    <table className="w-full border border-gray-300 text-center">
      <thead className="bg-indigo-100">
        <tr>
          <th className="border border-gray-300 px-3 py-2">দিন</th>
          <th className="border border-gray-300 px-3 py-2">শ্যাম্পু</th>
          <th className="border border-gray-300 px-3 py-2">তেল</th>
          <th className="border border-gray-300 px-3 py-2">Minoxidil</th>
        </tr>
      </thead>
      <tbody>
        {routineData.map(({ day, shampoo, oil, minoxidil }) => (
          <tr key={day} className="odd:bg-gray-50 even:bg-gray-100">
            <td className="border border-gray-300 px-3 py-2">{day}</td>
            <td className="border border-gray-300 px-3 py-2">{shampoo}</td>
            <td className="border border-gray-300 px-3 py-2">{oil}</td>
            <td className="border border-gray-300 px-3 py-2">{minoxidil}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const notifications = [
  { time: "08:00", message: "🌊 এখন পানি খাওয়ার সময়!" },
  { time: "14:00", message: "💧 Minoxidil ব্যবহার করতে ভুলিও না!" },
  { time: "19:00", message: "🛢️ তেল লাগানোর সময় এসেছে!" },
];

function requestNotificationPermission() {
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("HairCare Tracker", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    });
  }
}

const ProgressBar = ({ completed }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-6 mt-4 shadow-inner">
      <div
        className="bg-indigo-600 h-6 rounded-full transition-all duration-700 ease-in-out"
        style={{ width: `${completed}%` }}
      >
        <span className="text-white font-semibold ml-2">
          {completed.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

const HairCareApp = () => {
  const [data, setData] = useState(getInitialData());
  const today = getTodayDate();
  const [darkMode, setDarkMode] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    requestNotificationPermission();

    if (!data[today]) {
      const newDay = tasksList.reduce((acc, task) => {
        acc[task] = false;
        return acc;
      }, {});
      setData((prev) => {
        const updated = { ...prev, [today]: newDay };
        localStorage.setItem("haircare_data", JSON.stringify(updated));
        return updated;
      });
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      notifications.forEach(({ time, message }) => {
        if (time === currentTime) {
          showNotification(message);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [data, today]);

  const toggleTask = (date, task) => {
    const updated = {
      ...data,
      [date]: {
        ...data[date],
        [task]: !data[date][task],
      },
    };
    setData(updated);
    localStorage.setItem("haircare_data", JSON.stringify(updated));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("HairCare Tracker Report", 14, 22);

    const tableColumn = ["Date", "Task", "Done"];
    // data: [ [date, task, done], ... ]
    const tableRows = [];

    Object.entries(data).forEach(([date, tasks]) => {
      Object.entries(tasks).forEach(([task, done]) => {
        const row = [date, task, done ? "Yes" : "No"];
        tableRows.push(row);
      });
    });

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 12 },
    });

    doc.save("haircare-report.pdf");
  };

  const resetToday = () => {
    const resetTasks = tasksList.reduce((acc, task) => {
      acc[task] = false;
      return acc;
    }, {});
    const updated = { ...data, [today]: resetTasks };
    setData(updated);
    localStorage.setItem("haircare_data", JSON.stringify(updated));
  };

  const weeklySummary = () => {
    const dates = Object.keys(data).slice(-7);
    return tasksList.map((task) => {
      const count = dates.reduce(
        (sum, date) => sum + (data[date]?.[task] ? 1 : 0),
        0
      );
      return `${task}: ${count}/7 দিন`;
    });
  };

  const doneCount = Object.values(data[today] || {}).filter(Boolean).length;
  const completionPercent = (doneCount / tasksList.length) * 100;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour === 21) {
      const doneTasks = Object.values(data[today]).filter(Boolean).length;
      if (doneTasks < tasksList.length)
        alert("🔔 আজকের চেকলিস্ট এখনো সম্পূর্ণ হয়নি!");
    }
  }, [data, today]);

  const filteredDates = Object.keys(data).filter((date) => {
    if (!startDate || !endDate) return date === today;
    return date >= startDate && date <= endDate;
  });

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-white min-h-screen p-6"
          : "bg-gray-100 text-gray-900 min-h-screen p-6"
      }
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Panel: Checklist + Progress */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-indigo-600">
              চুলের যত্ন চেকলিস্ট ✨
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              title="Toggle Light/Dark Mode"
            >
              {darkMode ? "🌞 Light" : "🌙 Dark"}
            </button>
          </div>

          <p className="mb-4 text-center font-medium">
            তারিখ: <span className="text-indigo-600">{today}</span>
          </p>

          <div className="flex flex-col gap-3 max-w-md mx-auto">
            {filteredDates.map((date) => (
              <div
                key={date}
                className="border border-gray-300 rounded p-4 shadow-sm bg-indigo-50"
              >
                <h2 className="font-semibold mb-2 text-indigo-700 text-center">
                  📆 {date}
                </h2>
                <ul>
                  {tasksList.map((task) => (
                    <li
                      key={task}
                      className="flex justify-between items-center py-1 border-b border-indigo-200 last:border-b-0"
                    >
                      <span>{task}</span>
                      <input
                        type="checkbox"
                        checked={data[date]?.[task] || false}
                        onChange={() => toggleTask(date, task)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ProgressBar completed={completionPercent} />

          <div className="mt-4 flex justify-between max-w-md mx-auto">
            <button
              onClick={resetToday}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              আজকের ডাটা রিসেট করো
            </button>
            <button
              onClick={exportPDF}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              রিপোর্ট ডাউনলোড করো PDF আকারে
            </button>
          </div>

          <div className="mt-6 text-center text-indigo-700 font-semibold">
            সাপ্তাহিক সারসংক্ষেপ:
            <ul className="mt-2 space-y-1">
              {weeklySummary().map((summary, i) => (
                <li key={i}>{summary}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 max-w-md mx-auto">
            <label htmlFor="start" className="block font-semibold mb-1">
              শুরু তারিখ (Start Date)
            </label>
            <input
              type="date"
              id="start"
              className="w-full border rounded px-3 py-2 mb-3"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today}
            />
            <label htmlFor="end" className="block font-semibold mb-1">
              শেষ তারিখ (End Date)
            </label>
            <input
              type="date"
              id="end"
              className="w-full border rounded px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={today}
            />
          </div>
        </div>

        {/* Right Panel: Routine Table */}
        <div className="flex-1">
          <RoutineTable />
        </div>
      </div>
    </div>
  );
};

export default HairCareApp;
