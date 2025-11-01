import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">{props.record.name}</td>
    <td className="p-4 align-middle">{props.record.position}</td>
    <td className="p-4 align-middle">{props.record.level}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          type="button"
          onClick={() => props.deleteRecord(props.record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  // Replace localhost with your EC2 public IP
  const API_URL = "http://13.61.147.171:5050/record";

  // Fetch all records
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          console.error(`An error occurred: ${response.statusText}`);
          return;
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    }
    getRecords();
  }, []);

  // Delete a record
  async function deleteRecord(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  }

  // Display records
  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={deleteRecord}
        key={record._id}
      />
    ));
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left font-medium">Name</th>
                <th className="h-12 px-4 text-left font-medium">Position</th>
                <th className="h-12 px-4 text-left font-medium">Level</th>
                <th className="h-12 px-4 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>{recordList()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

