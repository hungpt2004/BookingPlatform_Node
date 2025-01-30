import React, { useState, useEffect } from "react";
import useFetch from "../../../hooks/useFetch";

const Booking = ({ setOpen, hotelId, checkInDate, checkOutDate, userId }) => {
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [facilities, setFacilities] = useState({});
    const { data, loading, error } = useFetch(`http://localhost:8080/room/get-room-by-hotel/${hotelId}`);

    // Fetch facilities for all rooms when the data is loaded
    useEffect(() => {
        if (data && data.rooms) {
            data.rooms.forEach((room) => {
                fetchFacilities(room._id);
            });
        }
    }, [data]);

    // Fetch facilities for a specific room
    const fetchFacilities = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/room/get-facility/${roomId}`);
            const result = await response.json();
            if (!result.error) {
                setFacilities((prev) => ({
                    ...prev,
                    [roomId]: result.facilities,
                }));
            }
        } catch (err) {
            console.error("Failed to fetch facilities:", err);
        }
    };

    const toggleRoomSelection = (roomId) => {
        setSelectedRooms((prev) =>
            prev.includes(roomId)
                ? prev.filter((id) => id !== roomId)
                : [...prev, roomId]
        );
    };

    const closeModal = () => setOpen(false);

    const handleConfirmBooking = async () => {
        try {
            const response = await fetch("http://localhost:8080/user/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    hotelId,
                    roomId: selectedRooms,
                    checkInDate,
                    checkOutDate,
                }),
            });

            const result = await response.json();
            if (!result.error) {
                alert("Booking successful!");
                setOpen(false);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error during booking:", error);
            alert("An error occurred while booking.");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
            onClick={closeModal}
        >
            <div
                className="bg-white w-[400px] max-w-full p-5 rounded-2xl shadow-2xl transition-transform transform scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4 text-center">Select Rooms for Booking</h2>
                {loading && <p>Loading rooms...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {data.rooms.map((room) => (
                            <div
                                key={room._id}
                                className="border-b pb-4 mb-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{room.type}</p>
                                        <p className="text-sm text-gray-600">Price: ${room.price}</p>
                                        <p className="text-sm text-gray-600">
                                            Capacity: {room.capacity}
                                        </p>
                                    </div>
                                </div>
                                {facilities[room._id] && (
                                    <div className="mt-2">
                                        <p className="font-medium">Facilities:</p>
                                        <ul className="text-sm text-gray-600 list-disc pl-5">
                                            {facilities[room._id].map((facility) => (
                                                <li key={facility._id}>
                                                    {facility.name}: {facility.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="mt-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedRooms.includes(room._id)}
                                            onChange={() => toggleRoomSelection(room._id)}
                                            className="w-4 h-4"
                                        />
                                        <span>Select Room</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-2"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleConfirmBooking}
                        className="bg-blue-500 text-black px-4 py-2 rounded-lg"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
