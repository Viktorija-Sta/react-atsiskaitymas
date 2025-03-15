import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import './TripInformation.scss'
import { Button, CircularProgress, ImageList, ImageListItem, MenuItem, Select } from "@mui/material";


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
    const { id } = useParams<{ id: string }>()
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
                const res = await fetch(`${API_URL}/destinations/${id}`)
                if (!res.ok) throw new Error("Nepavyko gauti kelionės duomenų")
                const data = await res.json()
                setTrip(data)
            } catch (error) {
                console.error("Klaida gaunant kelionę:", error)
            }
        }
    
        const fetchHotels = async () => {
            try {
                const res = await fetch(`${API_URL}/hotels?destinationsId=${id}`)
                if (!res.ok) throw new Error("Nepavyko gauti viešbučių")
                const data = await res.json()
                setHotels(data)
            } catch (error) {
                console.error("Klaida gaunant viešbučius:", error)
            }
        }
    
        fetchTrip()
        fetchHotels()
    }, [id])
    


    if (!trip) return <CircularProgress />
    if (!trip.title) return <p>Klaida: Kelionės duomenys nepasiekiami</p>

    const tripDuration = Number(trip.duration.match(/\d+/)?.[0]) || 1
    const selectedHotelObj = hotels.find((hotel) => hotel.id === selectedHotel);
    const hotelPricePerNight = selectedHotelObj ? Number(selectedHotelObj.price) : 0;

    const totalHotelCost = selectedHotelObj ? hotelPricePerNight * tripDuration : 0;
    const totalTripCost = (Number(trip.price) || 0) + totalHotelCost;


    const submitHandler = () => {
        setIsPopupOpen(true)
    }

    const closePopup = () => {
        setIsPopupOpen(false)
    }


return (
    <div className="trip-info">
        
        <h1>{trip.title}</h1>
        <p>✨{trip.description}</p>
        <p>✨{trip.fullDescription}</p>
        <p>Trukmė: {trip.duration}</p>
        <p className="price">
            <strong>Kaina:</strong> {trip.price}€
        </p>

        <div className="image-gallery">
            <ImageList sx={{ height: 450 }} variant="woven" cols={20} gap={5} >
                {Array.isArray(trip.gallery) ? (
                    trip.gallery.map((item, index) => (
                        <ImageListItem key={item} cols={4} rows={1}>
                            <img key={index} src={item} alt={`${trip.title} ${index + 1}`}  />
                        </ImageListItem>
                    ))
                ) : (
                    <p>Galerijos nuotraukos nerastos.</p>
                )}
            </ImageList>
        </div>

        <div className="hotel-selection">
            <h2>Pasirinkite viešbutį</h2>
            <Select fullWidth value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
               <MenuItem value="">Pasirinkite viešbutį</MenuItem>
                {hotels.map((hotel) => (
                    <MenuItem key={hotel.id} value={hotel.id}>
                        {hotel.name} - {hotel.price}€/naktis
                    </MenuItem>
                ))}
            </Select>
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
            <p><strong>Viso: {selectedHotel ? `${totalTripCost.toLocaleString()}€` : "---"}</strong></p>
            <Button variant="contained" type="submit" onClick={submitHandler} disabled={!selectedHotel || !selectedDates.start}>
                Siųsti užklausą
            </Button>
        </div>
        <div className="button">
            <Link to={`/trip/edit/${trip.id}`}>
                <Button variant="contained">Redaguoti</Button>
            </Link>
        </div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Jūsų užklausa išsiųsta!</h2>
                        <p>Dėkojame už jūsų užklausą. Netrukus su jumis susisieksime.</p>
                        <Button variant="contained" onClick={closePopup}>Uždaryti</Button>
                    </div>
                </div>
            )}

    </div>
)}

export default TripInformation
