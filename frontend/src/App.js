
import React, { useEffect, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const API_URL = "http://localhost:8000/events";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", date: "", time: "", organizer: "" });
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dark, setDark] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
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
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add event");
      setForm({ name: "", description: "", date: "", time: "", organizer: "" });
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
    setAdding(false);
  };

  // Filter events by search
  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.organizer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={classNames("min-h-screen py-8 px-4 transition-colors", dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900")}> 
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">FOCES Events</h1>
        <button type="button" onClick={() => setDark(d => !d)} className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow">
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className={classNames("max-w-xl mx-auto mb-8 p-6 rounded shadow", dark ? "bg-gray-800" : "bg-white")}> 
        <h2 className="text-xl font-semibold mb-4">Add Event</h2>
        <div className="grid grid-cols-1 gap-4">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="border p-2 rounded" />
          <input name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="border p-2 rounded" />
          <input name="date" value={form.date} onChange={handleChange} required placeholder="Date (YYYY-MM-DD)" className="border p-2 rounded" />
          <input name="time" value={form.time} onChange={handleChange} required placeholder="Time (HH:MM)" className="border p-2 rounded" />
          <input name="organizer" value={form.organizer} onChange={handleChange} required placeholder="Organizer" className="border p-2 rounded" />
        </div>
        <button type="submit" disabled={adding} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {adding ? "Adding..." : "Add Event"}
        </button>
      </form>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full border p-2 rounded"
        />
      </div>

      {loading && <div className="text-center text-gray-500">Loading events...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      {!loading && !error && filteredEvents.length === 0 && <div className="text-center text-gray-500">No events found.</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {filteredEvents.map((event) => (
          <button
            type="button"
            key={`${event.name}-${event.date}-${event.time}`}
            className={classNames("rounded shadow p-6 flex flex-col cursor-pointer transition text-left", dark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100")}
            onClick={() => setSelectedEvent(event)}
          >
            <h3 className="text-lg font-bold mb-2">{event.name}</h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300">{event.description}</p>
            <div className="flex-1" />
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Date: {event.date}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Time: {event.time}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Organizer: {event.organizer}</div>
          </button>
        ))}
      </div>

      {/* Modal for event details */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
          <div className={classNames("bg-white dark:bg-gray-900 rounded shadow-lg p-8 max-w-md w-full relative", dark ? "text-white" : "text-gray-900")} onClick={e => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white" onClick={() => setSelectedEvent(null)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.name}</h2>
            <p className="mb-2">{selectedEvent.description}</p>
            <div className="mb-2">Date: {selectedEvent.date}</div>
            <div className="mb-2">Time: {selectedEvent.time}</div>
            <div className="mb-2">Organizer: {selectedEvent.organizer}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
