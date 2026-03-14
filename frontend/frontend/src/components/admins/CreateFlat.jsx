import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateFlat = () => {
  const { id, name } = useParams();

  const [flats, setFlats] = useState([
    {
      flat_number: "",
      wing: "",
      owner_name: "",
      owner_phone: "",
    },
  ]);

  function addFlat() {
    setFlats([
      ...flats,
      {
        flat_number: "",
        wing: "",
        owner_name: "",
        owner_phone: "",
      },
    ]);
  }

  function addDetails(e, index) {
    const updated = [...flats];
    updated[index][e.target.name] = e.target.value;
    setFlats(updated);
  }

  async function createFlats(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:3000/api/admin/createFlats/${id}`,
        { flats }
      );

      console.log(res.data);
      alert("Flats created successfully!");
    } catch (error) {
      console.log(error.response?.data || error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Flats - {name}
      </h1>

      <form onSubmit={createFlats} className="flex flex-col gap-6">
        {flats.map((flat, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 bg-blue-500 shadow-md rounded-xl p-5 border"
          >
            <h2 className="font-semibold text-lg">
              Flat #{i + 1}
            </h2>

            <input
              className="border p-2 rounded"
              type="text"
              name="flat_number"
              value={flat.flat_number}
              onChange={(e) => addDetails(e, i)}
              placeholder="Flat Number"
            />

            <input
              className="border p-2 rounded"
              type="text"
              name="wing"
              value={flat.wing}
              onChange={(e) => addDetails(e, i)}
              placeholder="Wing"
            />

            <input
              className="border p-2 rounded"
              type="text"
              name="owner_name"
              value={flat.owner_name}
              onChange={(e) => addDetails(e, i)}
              placeholder="Owner Name"
            />

            <input
              className="border p-2 rounded"
              type="text"
              name="owner_phone"
              value={flat.owner_phone}
              onChange={(e) => addDetails(e, i)}
              placeholder="Owner Phone"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addFlat}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Flat
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Submit Flats
        </button>
      </form>
    </div>
  );
};

export default CreateFlat;