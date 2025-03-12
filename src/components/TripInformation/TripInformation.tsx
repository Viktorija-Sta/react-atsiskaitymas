import { useParams } from "react-router";
import { useEffect, useState } from "react";

interface Trip {
    id: string
    title: string
    description: string
    price: number
    gallery: string[]
    fullDescription: string
    duration: string
}

interface Hotel {
    id: string;
    destinationsId: string
    name: string
    price: number
}

const TripInformation: React.FC = () => {
    const { id } = useParams<Record<string, string | undefined>>()
        console.log("Kelionės ID:", id)

    const [trip, setTrip] = useState<Trip | null>(null)
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [selectedHotel, setSelectedHotel] = useState<string>("")
    const [selectedDates, setSelectedDates] = useState<{ start: string, end: string }>({ 
        start: "",
        end: "",
    })

    const [isPopupOpen, setIsPopupOpen] = useState(false)

    useEffect(() => {
        if (!id) {
            console.log("Kelionės ID nerastas!", id)
            return
        }

        console.log("Gaunamas kelionės ID:", id)
        fetch(`http://localhost:3000/destinations/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Nepavyko gauti kelionės duomenų")
                }
                return res.json()
            })
            .then((data) => {
                console.log("Gauti kelionės duomenys:", data)
                setTrip(data)
            })
            .catch((error) => console.error("Klaida gaunant kelionę:", error))
            

        fetch(`http://localhost:3000/hotels?destinationsId=${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Nepavyko gauti viešbučių");
                }
                return res.json()
            })
            .then((data) => {
                console.log("Gauti viešbučiai:", data)
                setHotels(data)
            })
            .catch((error) => console.error("Klaida gaunant viešbučius:", error))
}, [id])

if (!trip) {
    return <p>Kraunama...</p>
}

const tripDuration = parseInt(trip.duration, 10) || 1;

const selectedHotelObj = hotels.find((hotel) => hotel.name === selectedHotel);
const hotelPricePerNight = selectedHotelObj ? selectedHotelObj.price : 0;

const totalHotelCost = hotelPricePerNight * tripDuration;

const totalTripCost = trip.price + totalHotelCost;

const submitHandler = () => {
    setIsPopupOpen(true)
}

const closePopup = () => {
    setIsPopupOpen(false)
}


return (
    <div className="trip-info">
        <h1>{trip.title}</h1>
        <p>{trip.description}</p>
        <p>{trip.fullDescription}</p>
        <p>Trukmė: {trip.duration}</p>
        <p>
            <strong>Kaina:</strong> {trip.price}€
        </p>

        <div className="image-gallery">
            {trip.gallery.map((img, index) => (
                <img key={index} src={img} alt={`${trip.title} ${index + 1}`} />
            ))}
        </div>

        <div className="hotel-selection">
            <h2>Pasirinkite viešbutį</h2>
            <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                <option value="">Pasirinkite viešbutį</option>
                {hotels.length > 0 ? (
                    hotels.map((hotel) => (
                        <option key={hotel.id} value={hotel.name}>
                            {hotel.name} - {hotel.price}€/naktis
                        </option>
                    ))
                ) : (
                    <option value="" disabled>
                        Viešbučių nėra
                    </option>
                )}
            </select>
        </div>

        <div className="date-selection">
            <h2>Pasirinkite kelionės laikotarpį</h2>
            <label htmlFor="start-date">Pradžios data:</label>
            <input
                type="date"
                id="start-date"
                value={selectedDates.start}
                onChange={(e) => setSelectedDates((prev) => ({ ...prev, start: e.target.value }))}
            />
        </div>

        <div className="total-price">
                <h2>Galutinė kaina:</h2>
                <p>
                    {selectedHotel
                        ? `Kelionė: ${trip.price}€ + Viešbutis: ${totalHotelCost}€ (${hotelPricePerNight}€/naktis × ${tripDuration} n.)`
                        : "Pasirinkite viešbutį, kad matytumėte kainą"}
                </p>
                <p><strong>Viso: {selectedHotel ? totalTripCost + "€" : "---"}</strong></p>
            </div>

            <button type="submit" onClick={submitHandler} disabled={!selectedHotel}>
                Siųsti užklausą
            </button>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Jūsų užklausa išsiųsta!</h2>
                        <p>Dėkojame už jūsų užklausą. Netrukus su jumis susisieksime.</p>
                        <button onClick={closePopup}>Uždaryti</button>
                    </div>
                </div>
            )}


            <style>
                {`
                    .popup-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .popup-content {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                    }
                    .popup-content button {
                        margin-top: 10px;
                        padding: 8px 16px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .popup-content button:hover {
                        background: #0056b3;
                    }
                `}
            </style>
    </div>
)}

export default TripInformation
