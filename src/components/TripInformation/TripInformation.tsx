import { useParams } from "react-router";
import { useEffect, useState } from "react";

interface Trip {
    id: string
    title: string
    description: string
    price: number
    gallery: string[]
    fullDescription: string
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

    useEffect(() => {
        if (!id) {
            console.log("Kelionės ID nerastas!", id)
            return
        }

        console.log("Gaunamas kelionės ID:", id)
        fetch(`http://localhost:3000/destinations/${id}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Nepavyko gauti kelionės duomenų");
            }
            return res.json();
        })
        .then((data) => {
            console.log("Gauti kelionės duomenys:", data);
            setTrip(data);
        })
        .catch((error) => console.error("Klaida gaunant kelionę:", error));

    fetch(`http://localhost:3000/hotels?destinationsId=${id}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Nepavyko gauti viešbučių");
            }
            return res.json();
        })
        .then((data) => {
            console.log("Gauti viešbučiai:", data);
            setHotels(data);
        })
        .catch((error) => console.error("Klaida gaunant viešbučius:", error));
}, [id]);

if (!trip) {
    return <p>Kraunama...</p>;
}


return (
    <div className="trip-info">
        <h1>{trip.title}</h1>
        <p>{trip.description}</p>
        <p>{trip.fullDescription}</p>
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
            <label htmlFor="end-date">Pabaigos data:</label>
            <input
                type="date"
                id="end-date"
                value={selectedDates.end}
                onChange={(e) => setSelectedDates((prev) => ({ ...prev, end: e.target.value }))}
            />
        </div>

        <button type="submit" disabled={!selectedHotel || !selectedDates.start || !selectedDates.end}>
            Užsakyti kelionę
        </button>
    </div>
)
}

export default TripInformation
