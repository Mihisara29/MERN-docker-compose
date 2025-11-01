import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  // ⚙️ Backend base URL (change this if needed)
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://13.61.147.171:5050";

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;

      setIsNew(false);
      try {
        const response = await fetch(`${BACKEND_URL}/record/${id}`);
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          console.error(message);
          return;
        }

        const record = await response.json();
        if (!record) {
          console.warn(`Record with id ${id} not found`);
          navigate("/");
          return;
        }

        setForm(record);
      } catch (error) {
        console.error("Error fetching record:", error);
      }
    }

    fetchData();
  }, [params.id, navigate]);

  // 🧩 Update form values
  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  // 💾 Submit form (create or update)
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };

    try {
      let response;

      if (isNew) {
        // Add a new record
        response = await fetch(`${BACKEND_URL}/record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        });
      } else {
        // Update an existing record
        response = await fetch(`${BACKEND_URL}/record/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred adding or updating a record: ", error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  // 🧱 UI form
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Employee Record</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly, so be careful what you
              share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            {/* Name field */}
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border border-slate-300 py-1.5 pl-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="First Last"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
            </div>

            {/* Position field */}
            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="position"
                  id="position"
                  className="block w-full rounded-md border border-slate-300 py-1.5 pl-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Developer Advocate"
                  value={form.position}
                  onChange={(e) => updateForm({ position: e.target.value })}
                />
              </div>
            </div>

            {/* Level radio buttons */}
            <div>
              <fieldset className="mt-4">
                <legend className="text-sm font-semibold text-slate-900 mb-2">
                  Level
                </legend>
                <div className="flex gap-6">
                  {["Intern", "Junior", "Senior"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 text-sm text-slate-900"
                    >
			  <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={form.level === level}
                        onChange={(e) =>
                          updateForm({ level: e.target.value })
                        }
                        className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center text-md font-medium border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-md px-4 py-2 mt-4 cursor-pointer transition-colors"
        />
      </form>
    </>
  );
}

