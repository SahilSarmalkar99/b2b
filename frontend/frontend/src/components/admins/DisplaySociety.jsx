import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DisplaySociety = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchSocieties() {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/admin/displaySociety"
        );
        console.log(res.data)
        console.log(res.data.socities._id)
        setData(res.data.socities);
      } catch (error) {
        console.log(error.response?.data || error);
      }
    }

    fetchSocieties();
  }, []);

  function handleClick(id) {
    navigate(`/displayflats/${id}`);
  }

  async function DeleteSociety(id){
    const res = await axios.delete(`http://localhost:3000/api/admin/deleteSociety/${id}`);
    console.log(res.data);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black">

      <h1 className="text-3xl font-bold mb-6">Societies</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {data.map((society) => (
          <div
            key={society.id}
            className="bg-blue-500 shadow-md rounded-xl p-6 border"
          >
            <h2 className="text-xl font-semibold mb-2">{society.name}</h2>

            <p className="text-gray-600">Society ID: {society.SocietyId}</p>
            <p className="text-gray-600">Address: {society.address}</p>
            <p className="text-gray-600">
              Status: {society.subscription_status}
            </p>
            <p className="text-gray-600">
              Total Flats: {society.total_flats}
            </p>

            <button
              onClick={() => handleClick(society._id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              View Flats
            </button>
            
            <button
              onClick={() => DeleteSociety(society._id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Delete Society
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DisplaySociety;