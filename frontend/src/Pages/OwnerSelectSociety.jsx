import React, { useEffect, useState } from "react";
import { addsocieties, displaySocieties } from "../services/societies";
import { useNavigate } from "react-router-dom";

const OwnerSelectSociety = () => {
  const [societies, setSocieties] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSocieties, setSelectedSocieties] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await displaySocieties();
        setSocieties(data.societies);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSocieties();
  }, []);

  const toggleSociety = (society) => {
    const exists = selectedSocieties.find(
      (s) => s._id === society._id
    );

    if (exists) {
      setSelectedSocieties(
        selectedSocieties.filter((s) => s._id !== society._id)
      );
    } else {
      setSelectedSocieties([...selectedSocieties, society]);
    }
  };

  const filteredSocieties = societies.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNext = async () => {

  try {

    for (let society of selectedSocieties) {
      await addsocieties({
        society_id: society._id
      });
    }

    navigate("/owner/add-flats", {
      state: { societies: selectedSocieties },
    });

  } catch (error) {
    console.log(error);
  }

};

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Select Your Society
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search society..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
        />

        {/* Society Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredSocieties.map((society) => {

            const selected = selectedSocieties.find(
              (s) => s._id === society._id
            );

            return (
              <div
                key={society._id}
                onClick={() => toggleSociety(society)}
                className={`cursor-pointer p-5 rounded-xl border transition-all shadow-sm hover:shadow-md
                ${
                  selected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <h2 className="font-semibold text-lg text-gray-800">
                  {society.name}
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                  {society.address}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Pincode: {society.pincode}
                </p>

                <div className="text-xs text-gray-400 mt-2">
                  Floors: {society.total_floors} • Flats:{" "}
                  {society.total_flats}
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Button */}
        {selectedSocieties.length > 0 && (
          <div className="flex justify-end mt-8">

            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Next ({selectedSocieties.length})
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default OwnerSelectSociety;