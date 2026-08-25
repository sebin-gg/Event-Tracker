import React, { useEffect, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/events";
const STORAGE_KEY = "foces_events_data";

const DEFAULT_EVENTS = [
  {
    name: "FOCES Annual Tech Symposium 2026",
    description: "Flagship annual technology symposium featuring keynotes, research presentations, and tech exhibits.",
    date: "2026-09-15",
    time: "09:30",
    organizer: "FOCES Executive Committee",
  },
  {
    name: "AI & Cloud Architecture Workshop",
    description: "Hands-on workshop exploring cloud infrastructure, serverless APIs, and AI integration for modern web apps.",
    date: "2026-09-22",
    time: "14:00",
    organizer: "FOCES Technical Wing",
  },
  {
    name: "FOCES 24-Hour Hackathon",
    description: "Collaborative coding marathon to build open-source solutions for campus and community problems.",
    date: "2026-10-05",
    time: "10:00",
    organizer: "FOCES Coding Club",
  },
];

function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_EVENTS;
}

function saveStoredEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", date: "", time: "", organizer: "" });
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
        saveStoredEvents(data);
        setIsDemoMode(false);
      } else {
        const stored = getStoredEvents();
        setEvents(stored);
        setIsDemoMode(true);
      }
    } catch {
      // Fall back seamlessly to localStorage/demo data
      const stored = getStoredEvents();
      setEvents(stored);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    const newEvent = { ...form };

    if (!isDemoMode) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent),
        });
        if (!res.ok) throw new Error("Backend post failed");
        setForm({ name: "", description: "", date: "", time: "", organizer: "" });
        await fetchEvents();
        setAdding(false);
        return;
      } catch {
        setIsDemoMode(true);
      }
    }

    // Save locally
    const updated = [newEvent, ...events];
    setEvents(updated);
    saveStoredEvents(updated);
    setForm({ name: "", description: "", date: "", time: "", organizer: "" });
    setAdding(false);
  };

  const handleDelete = (eventToDelete) => {
    const updated = events.filter(
      (e) => !(e.name === eventToDelete.name && e.date === eventToDelete.date && e.time === eventToDelete.time)
    );
    setEvents(updated);
    saveStoredEvents(updated);
    if (selectedEvent?.name === eventToDelete.name) {
      setSelectedEvent(null);
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={classNames("min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200", dark ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-900")}>
      <div className="max-w-5xl mx-auto">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📅</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                FOCES Events
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Event Tracker & Schedule Management System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={classNames(
              "text-xs px-2.5 py-1 rounded-full font-medium border",
              isDemoMode
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
            )}>
              {isDemoMode ? "⚡ Local / Offline Mode" : "🟢 Backend Connected"}
            </span>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm"
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        {/* Add Event Form */}
        <section className={classNames(
          "mb-8 p-6 sm:p-8 rounded-2xl border shadow-sm transition-all",
          dark ? "bg-gray-900 border-gray-800 shadow-gray-950/50" : "bg-white border-gray-200 shadow-slate-200/50"
        )}>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span>✨</span> Create New Event
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Event Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. FOCES Annual Coding Bootcamp"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Brief description of objectives, schedule, and prerequisites..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Organizer / Host
                </label>
                <input
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  required
                  placeholder="e.g. FOCES Core Team / Dept of CSE"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={adding}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                {adding ? "Saving Event..." : "+ Add Event"}
              </button>
            </div>
          </form>
        </section>

        {/* Search & Filter Bar */}
        <section className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search events by title, description, or organizer..."
              className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-3.5 text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Events Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Upcoming Events ({filteredEvents.length})
            </h2>
          </div>

          {loading && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <div className="inline-block animate-spin text-3xl mb-2">⏳</div>
              <p>Loading events...</p>
            </div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className={classNames(
              "text-center py-16 px-4 rounded-2xl border border-dashed",
              dark ? "border-gray-800 bg-gray-900/50" : "border-gray-300 bg-white/50"
            )}>
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {search ? `No events matching "${search}"` : "No events scheduled yet."}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear search filter
                </button>
              )}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={`${event.name}-${event.date}-${event.time}`}
                className={classNames(
                  "rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer text-left group",
                  dark
                    ? "bg-gray-900 border-gray-800 hover:border-gray-700"
                    : "bg-white border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedEvent(event)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {event.organizer || "FOCES"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition p-1 text-xs"
                      title="Remove event"
                    >
                      🗑️
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span>🗓️</span> {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>⏰</span> {event.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal for event details */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className={classNames(
                "rounded-2xl border shadow-2xl p-6 sm:p-8 max-w-lg w-full relative transition-all",
                dark ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl font-bold p-1 leading-none"
                onClick={() => setSelectedEvent(null)}
              >
                &times;
              </button>

              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">
                Event Details
              </span>

              <h2 className="text-2xl font-extrabold mb-3 leading-snug">
                {selectedEvent.name}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="space-y-2.5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">📅 Date:</span>
                  <span className="font-semibold">{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">⏰ Time:</span>
                  <span className="font-semibold">{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">👤 Organizer:</span>
                  <span className="font-semibold">{selectedEvent.organizer}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedEvent)}
                  className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                >
                  Delete Event
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
