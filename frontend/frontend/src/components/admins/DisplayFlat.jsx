import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DisplayFlat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchFlat() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/admin/displayFlats/${id}`
        );

        setData(res.data.flats);
      } catch (error) {
        console.log("Error:", error.response?.data || error);
      }
    }

    fetchFlat();
  }, [id]);

  function Details(flat_id) {
   navigate(`/ownerDetails/${flat_id}`);;
  }

  async function Delete(flat_id) {
    const res = await axios.delete(`http://localhost:3000/api/admin/deleteFlat/${flat_id}`)
    alert("Flat Deleted Sucessfully ");
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-black">
      <h1 className="text-3xl font-bold mb-6">Flats</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {data.map((flat) => (
          <div
            key={flat._id}
            className="bg-blue-500 shadow-md rounded-xl p-5 border"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Flat No: {flat.flat_number}
              </h2>
              <p className="text-gray-600">Wing: {flat.wing}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => Details(flat._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Owner
              </button>

              <button
                onClick={() => Delete(flat._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayFlat;