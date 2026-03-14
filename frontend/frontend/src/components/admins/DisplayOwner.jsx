import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DisplayOwner = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchOwner() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/admin/displayOwner/${id}`
        );

        setData(res.data.owner);
      } catch (error) {
        console.log(error.response?.data || error);
      }
    }

    fetchOwner();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black">
      <h1 className="text-3xl font-bold mb-6">Owner Details</h1>

      {data ? (
        <div className="bg-blue-500 text-gray-600 shadow-md rounded-xl p-6 border">
          <p className="text-lg">
            <strong>Name:</strong> {data.name}
          </p>

          <p className="text-lg">
            <strong>Phone:</strong> {data.phone}
          </p>

          <p className="text-lg">
            <strong>Email:</strong> {data.email}
          </p>

          <p className="text-lg">
            <strong>Total Flats:</strong> {data.flats?.length}
          </p>
        </div>
      ) : (
        <p>Loading owner details...</p>
      )}
    </div>
  );
};

export default DisplayOwner;