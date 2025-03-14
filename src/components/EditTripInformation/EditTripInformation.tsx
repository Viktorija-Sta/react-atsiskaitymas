import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { API_URL } from "../config";
import './EditTripInformation.scss'
import { Button, TextField } from "@mui/material";

interface Hotel {
    name: string
    price: string
}

const EditTripInformation: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [newImageUrl, setNewImageUrl] = useState('')

    const [editedTrip, setEditedTrip] = useState({ 
        title: '',
        description: '',
        fullDescription: '',
        price: '',
        duration: '',
        hotels: [] as Hotel[],
        gallery: [] as string[],
        agencyId: '',
    })

    const [newHotel, setNewHotel] = useState<Hotel>({ name: '', price: '' })
   
    useEffect(() => {
        const fetchTripData = async () => {
            try {
                const tripRes = await fetch(`${API_URL}/destinations/${id}`)
                const tripData = await tripRes.json()

                const hotelsRes = await fetch(`${API_URL}/hotels?destinationId=${id}`)
                const hotelsData = await hotelsRes.json()

                console.log("Kelionės duomenys:", tripData)
                console.log("Viešbučių duomenys:", hotelsData)

                setEditedTrip({
                    title: tripData.title || '',
                    description: tripData.description || '',
                    fullDescription: tripData.fullDescription || '',
                    price: tripData.price || '',
                    duration: tripData.duration || '',
                    hotels: hotelsData || [],
                    gallery: Array.isArray(tripData.gallery) ? tripData.gallery : [],
                    agencyId: tripData.agencyId || '',
                })

            } catch (error) {
                console.error("Klaida gaunant kelionės duomenis:", error)
            }
        }

        fetchTripData()
    }, [id])

    const removeImage = (index: number) => {
        setEditedTrip((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index),
        }))
    }

    const addImageUrl = () => {
        if (!newImageUrl.trim()) return
        setEditedTrip((prev) => ({ ...prev, gallery: [...prev.gallery, newImageUrl.trim()] }))
        setNewImageUrl("")
    }

    const addHotel = () => {
        if (!newHotel.name || !newHotel.price) return;
        setEditedTrip((prev) => ({ ...prev, hotels: [...prev.hotels, newHotel] }))
        setNewHotel({ name: "", price: "" })
    }

    const removeHotel = (index: number) => {
        setEditedTrip((prev) => ({
            ...prev,
            hotels: prev.hotels.filter((_, i) => i !== index),
        }))
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditedTrip({ ...editedTrip, [e.target.name]: e.target.value })
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        fetch(`${API_URL}/destinations/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedTrip),
        })
        .then(() => navigate(`/trip/${id}`))
    }
    
    return (
        <div className="edit-trip-information">
            <form className="edit-form" onSubmit={submitHandler}>
                <label htmlFor="title">Miestas/Šalis:</label>
                <TextField id="standard-basic" type="text" name="title" value={editedTrip.title} onChange={changeHandler} placeholder="Pavadinimas" />

                <label htmlFor="description">Aprašymas:</label>
                <TextField id="standard-basic" name="description" value={editedTrip.description} onChange={changeHandler} placeholder="Aprašymas" />

                <label htmlFor="fullDescription">Platesnė informacija:</label>
                <TextField id="standard-basic" name="fullDescription" value={editedTrip.fullDescription} onChange={changeHandler} placeholder="Platesnė informacija" />

                <label htmlFor="duration">Trukmė:</label>
                <TextField id="standard-basic" type="number" name="duration" value={editedTrip.duration} onChange={changeHandler} placeholder="Trukmė (dienos)" />

                <label htmlFor="price">Kaina:</label>
                <TextField id="standard-basic" type="number" name="price" value={editedTrip.price} onChange={changeHandler} placeholder="Kaina (€)" />

                <label htmlFor="gallery">Nuotraukos</label>
                <TextField id="standard-basic" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Įveskite nuorodas, atskirtas kableliais" />
                <Button variant="contained" type="button" onClick={addImageUrl}>Pridėti nuotrauką</Button>

                <div className="gallery">
                    {editedTrip.gallery.map((img, index) => (
                        <div key={index} className="image-container">
                            <img src={img} alt={`Kelionės nuotrauka ${index}`} width={300} />
                            <Button variant="contained" type="button" onClick={() => removeImage(index)}>Pašalinti</Button>
                        </div>
                    ))}
                </div>

                <label htmlFor="hotel">Pridėkite naują Viešbutį:</label>
                <TextField id="standard-basic" type="text" name="hotel" placeholder="Viešbučio pavadinimas"value={newHotel.name} 
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                />

                <TextField id="standard-basic" type="number" name="hotel-price" placeholder="Kaina (€)"value={newHotel.price} 
                    onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })}
                />
                <Button variant="contained" type="button" onClick={addHotel}>Pridėti viešbutį</Button>

                
                    <h2>Viešbučių sąrašas</h2>
                <div className="hotel-selection">
                    {editedTrip.hotels.length > 0 ? (
                        <ul>
                            {editedTrip.hotels.map((hotel, index) => (
                                <li key={index}>
                                    {hotel.name} - {hotel.price}€/naktis
                                    <div className="buttons">
                                        <Button id="delete-button" variant="contained" type="button" onClick={() => removeHotel(index)}>❌</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Viešbučių nėra</p>
                    )}
                
                </div>

                <Button variant="contained" type="submit">Išsaugoti</Button>
                <Button variant="contained" onClick={() => navigate(-1)}>Atšaukti</Button>
            </form>
        </div>
    )
}

export default EditTripInformation