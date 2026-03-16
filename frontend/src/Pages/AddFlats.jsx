import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addFlats, getSocietyFlats } from "../services/societies";

const OwnerAddFlats = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const societies = location.state?.societies || [];

  const [selectedWing, setSelectedWing] = useState({});
  const [selectedFloor, setSelectedFloor] = useState({});
  const [selectedFlats, setSelectedFlats] = useState({});
  const [takenFlats, setTakenFlats] = useState({});
  const [loading, setLoading] = useState(false);

  /* ------------------- Load Taken Flats ------------------- */

  const loadFlats = async () => {

    const flatsMap = {};

    for (const society of societies) {

      const data = await getSocietyFlats(society._id);

      flatsMap[society._id] = data.flats;

    }

    setTakenFlats(flatsMap);

  };

  useEffect(() => {

    if (societies.length) {
      loadFlats();
    }

    /* Auto refresh every 5 seconds */

    const interval = setInterval(() => {
      if (societies.length) loadFlats();
    }, 5000);

    return () => clearInterval(interval);

  }, [societies]);

  /* ------------------- Generate Flat Numbers ------------------- */

  const generateFlats = (wing, floor, count = 12) => {

    const flats = [];

    for (let i = 1; i <= count; i++) {

      const num = i.toString().padStart(2, "0");
      flats.push(`${wing}-${floor}${num}`);

    }

    return flats;

  };

  /* ------------------- Toggle Selection ------------------- */

  const toggleFlat = (society_id, flat) => {

    const existing = selectedFlats[society_id] || [];

    if (existing.includes(flat)) {

      setSelectedFlats({
        ...selectedFlats,
        [society_id]: existing.filter(f => f !== flat)
      });

    } else {

      setSelectedFlats({
        ...selectedFlats,
        [society_id]: [...existing, flat]
      });

    }

  };

  /* ------------------- Save Flats ------------------- */

  const handleSave = async (society_id) => {

    const flats = selectedFlats[society_id];

    if (!flats || flats.length === 0) {
      alert("Select at least one flat");
      return;
    }

    try {

      setLoading(true);

      for (const flat of flats) {

        await addFlats({
          society_id,
          flat_number: flat
        });

      }

      alert("Flats added successfully");

      await loadFlats();   // reload taken flats

      navigate("/owner/dashboard");

    } catch (error) {

      console.log(error);
      alert("Error saving flats");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Select Your Flats
        </h1>

        {/* Legend */}

        <div className="flex gap-6 mb-8 justify-center text-sm">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            Selected
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            Taken
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded"></div>
            Available
          </div>

        </div>

        <div className="space-y-10">

          {societies.map((society) => {

            const wing = selectedWing[society._id];
            const floor = selectedFloor[society._id];

            return (

              <div
                key={society._id}
                className="bg-white border rounded-2xl shadow-lg p-8"
              >

                {/* Society Info */}

                <div className="mb-6">

                  <h2 className="text-xl font-semibold text-gray-800">
                    {society.name}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {society.address}
                  </p>

                  <p className="text-gray-400 text-xs">
                    Pincode: {society.pincode}
                  </p>

                </div>

                {/* Wing + Floor */}

                <div className="grid md:grid-cols-2 gap-4 mb-6">

                  <select
                    value={wing || ""}
                    onChange={(e) =>
                      setSelectedWing({
                        ...selectedWing,
                        [society._id]: e.target.value
                      })
                    }
                    className="border p-3 rounded-lg"
                  >

                    <option value="">Select Wing</option>

                    {society.wings?.map((w, i) => (
                      <option key={i} value={w}>
                        Wing {w}
                      </option>
                    ))}

                  </select>

                  <select
                    value={floor || ""}
                    onChange={(e) =>
                      setSelectedFloor({
                        ...selectedFloor,
                        [society._id]: e.target.value
                      })
                    }
                    className="border p-3 rounded-lg"
                  >

                    <option value="">Select Floor</option>

                    {Array.from(
                      { length: Number(society.total_floors) + 1 },
                      (_, i) => i
                    ).map((floor) => (
                      <option key={floor} value={floor}>
                        {floor === 0
                          ? "Ground Floor"
                          : `Floor ${floor}`}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Flat Grid */}

                {wing && floor !== undefined && (

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">

                    {generateFlats(wing, floor).map((flat) => {

                      const taken =
                        takenFlats[society._id]?.includes(flat);

                      const selected =
                        selectedFlats[society._id]?.includes(flat);

                      return (

                        <button
                          key={flat}
                          disabled={taken}
                          onClick={() => toggleFlat(society._id, flat)}
                          className={`p-3 rounded-lg border text-sm font-medium transition

                          ${
                            taken
                              ? "bg-red-500 text-white cursor-not-allowed"
                              : selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >

                          {flat}

                        </button>

                      );

                    })}

                  </div>

                )}

                {/* Selected Flats */}

                {selectedFlats[society._id]?.length > 0 && (

                  <div className="mt-6">

                    <p className="text-sm text-gray-500 mb-2">
                      Selected Flats
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {selectedFlats[society._id].map((flat) => (

                        <span
                          key={flat}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
                        >
                          {flat}
                        </span>

                      ))}

                    </div>

                  </div>

                )}

                {/* Save */}

                {selectedFlats[society._id]?.length > 0 && (

                  <button
                    onClick={() => handleSave(society._id)}
                    disabled={loading}
                    className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  >

                    {loading ? "Saving..." : "Save Flats"}

                  </button>

                )}

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

};

export default OwnerAddFlats;