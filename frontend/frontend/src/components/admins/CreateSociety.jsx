import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateSociety = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    SocietyId: "",
    name: "",
    address: "",
    pincode: "",
    total_flats: "",
    total_floors: "",
  });

  const [wings, setWings] = useState([""]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleWingChange = (index, value) => {
    const updated = [...wings];
    updated[index] = value;
    setWings(updated);
  };

  const addWing = () => {
    setWings([...wings, ""]);
  };

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/createSociety",
        {
          ...formData,
          subscription_status: "inactive",
          wings: wings,
        }
      );

      console.log(res.data);

      const id = res.data.society.id;
      const name = res.data.society.name;

      navigate(`/createFlats/${name}/${id}`);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Create Society</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        <input
          className="border p-2 rounded"
          type="text"
          name="SocietyId"
          placeholder="Society ID"
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="name"
          placeholder="Society Name"
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="number"
          name="total_flats"
          placeholder="Total Flats"
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="number"
          name="total_floors"
          placeholder="Total Floors"
          onChange={handleChange}
        />

        {/* Wings */}
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="font-semibold">Wings</h2>

          {wings.map((wing, index) => (
            <input
              key={index}
              className="border p-2 rounded"
              type="text"
              placeholder={`Wing ${index + 1}`}
              value={wing}
              onChange={(e) => handleWingChange(index, e.target.value)}
            />
          ))}

          <button
            type="button"
            onClick={addWing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg w-fit"
          >
            + Add Wing
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
        >
          Create Society
        </button>

      </form>
    </div>
  );
};

export default CreateSociety;