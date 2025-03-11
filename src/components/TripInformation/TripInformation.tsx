import { useParams } from "react-router"
import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import { useEffect, useState } from "react"

interface Trip {
    id: string
}

interface TripInformationProps {
    title: string
    description: string
    price: number
    gallery: string[]
    img: string
    hotels: { name: string, price: number }[]
}

const TripInformation: React.FC<TripInformationProps> = ({ title, description, price, gallery, hotels }) => {
    const { id } = useParams()
    const { travelList } = useTravelPageContext()
    
    const [trip, setTrip] = useState<Trip | null>(null)
    const [selectedHotel, setSelectedHotel] = useState('')
    const [selectedDates, setSelectedDates] = useState({ start: '', end: '' })

    useEffect(() => {
        if(id) {
            const foundTrip = travelList.find((item: { id: string }) => item.id === id)
            if(foundTrip) {
                setTrip(foundTrip)
            }
        }
    }, [id, travelList])

    if(!trip) {
        return <p>Loading....</p>
    }

    return (
        <div className="trip-info">
            <h1>{title}</h1>
            <p>{description}</p>
            <p><strong>Kaina:</strong> {price}€</p>

            <div className="image-gallery">
                {gallery.map((img, index) => (
                    <img key={index} src={img} alt={`${title} ${index + 1}`} />
                ))}
            </div>

            <div className="hotel-selection">
                <h2>Pasirinkite viešbutį</h2>
                <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                    <option value="">Pasirinkite viešbutį</option>
                    {hotels.map((hotel, index) => (
                        <option key={index} value={hotel.name}>{hotel.name} - {hotel.price}€/naktis</option>
                    ))}
                </select>
            </div>

            <div className="date-selection">
                <h2>Pasirinkite kelionės laikotarpį</h2>
                <label htmlFor="start-date">Pradžios data:</label>
                <input
                    type="date" 
                    name="start-date" 
                    id="start-date" 
                    value={selectedDates.start} 
                    onChange={(e) => setSelectedDates((prev) => ({ ...prev, start: e.target.value}))} 
                />
                <label htmlFor="end-date">Pabaigos data:</label>
                <input
                    type="date" 
                    name="end-date" 
                    id="end-date" 
                    value={selectedDates.end} 
                    onChange={(e) => setSelectedDates((prev) => ({ ...prev, end: e.target.value}))}
                />
            </div>

            <button type="submit" disabled={!selectedHotel || !selectedDates.start || !selectedDates.end}>
                Užsakyti kelionę
            </button>
        </div>
    )
}

export default TripInformation