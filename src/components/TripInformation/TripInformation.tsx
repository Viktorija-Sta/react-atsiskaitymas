import { Link, useParams } from "react-router";
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

// interface Agency {
//     id: string
//     name: string
//     location: string
//     link: string
// }

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
        if (!id) return
        
        const fetchTrip = async () => {
            try {
                const res = await fetch(`http://localhost:3000/destinations/${id}`)
                if (!res.ok) throw new Error("Nepavyko gauti kelionės duomenų")
                const data = await res.json()
                setTrip(data)
            } catch (error) {
                console.error("Klaida gaunant kelionę:", error)
            }
        }
    
        const fetchHotels = async () => {
            try {
                const res = await fetch(`http://localhost:3000/hotels?destinationsId=${id}`)
                if (!res.ok) throw new Error("Nepavyko gauti viešbučių")
                const data = await res.json()
                setHotels(data)
            } catch (error) {
                console.error("Klaida gaunant viešbučius:", error)
            }
        }
    
        fetchTrip()
        fetchHotels()
    }, [id, setTrip, setHotels])
    


    if (!trip) return <p>Kraunama...</p>
    if (!trip.title) return <p>Klaida: Kelionės duomenys nepasiekiami</p>

const tripDuration = isNaN(Number(trip.duration)) ? 1 : Number(trip.duration)
const selectedHotelObj = hotels.find((hotel) => hotel.id === selectedHotel)
const hotelPricePerNight = selectedHotelObj ? Number(selectedHotelObj.price) : 0
const totalHotelCost = selectedHotelObj ? hotelPricePerNight * tripDuration : 0
const totalTripCost = (Number(trip.price) || 0) + (Number(totalHotelCost) || 0)


const submitHandler = () => {
    setIsPopupOpen(true)
}

const closePopup = () => {
    setIsPopupOpen(false)
}


return (
    <div className="trip-info">
        <Link to={`/trip/edit/${trip.id}`}>
            <button>Redaguoti</button>
        </Link>
        <h1>{trip.title}</h1>
        <p>{trip.description}</p>
        <p>{trip.fullDescription}</p>
        <p>Trukmė: {trip.duration}</p>
        <p>
            <strong>Kaina:</strong> {trip.price}€
        </p>

        <div className="image-gallery">
    {Array.isArray(trip.gallery) ? (
        trip.gallery.map((img, index) => (
            <img key={index} src={img} alt={`${trip.title} ${index + 1}`} />
        ))
    ) : (
        <p>Galerijos nuotraukos nerastos.</p>
    )}
</div>

        <div className="hotel-selection">
            <h2>Pasirinkite viešbutį</h2>
            <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                <option value="">Pasirinkite viešbutį</option>
                {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                        {hotel.name} - {hotel.price}€/naktis
                    </option>
                ))}
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
                {selectedHotelObj
                    ? `Kelionė: ${trip.price}€ + Viešbutis: ${totalHotelCost}€ (${hotelPricePerNight}€/naktis × ${tripDuration} n.)`
                    : "Pasirinkite viešbutį, kad matytumėte kainą"}
            </p>

            <p><strong>Viso: {selectedHotel ? totalTripCost.toLocaleString() + "€" : "---"}</strong></p>

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
