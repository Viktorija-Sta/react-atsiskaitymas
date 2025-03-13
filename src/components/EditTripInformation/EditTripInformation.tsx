import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { API_URL } from "../config";

interface Hotel {
    name: string;
    price: string;
}

const EditTripInformation: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [editedTrip, setEditedTrip] = useState({ 
        title: "", 
        description: "", 
        fullDescription: "", 
        price: "", 
        duration: "", 
        hotels: [] as Hotel[],
        gallery: [] as string[], 
    })

    const [newHotel, setNewHotel] = useState<Hotel>({ name: "", price: "" })
   
    useEffect(() => {
        const fetchTripData = async () => {
            try {
                const tripRes = await fetch(`${API_URL}/destinations${id}`);
                const tripData = await tripRes.json();
    
                const hotelsRes = await fetch(`${API_URL}/hotels?destinationId=${id}`)
                const hotelsData = await hotelsRes.json()

                console.log("Kelionės duomenys:", tripData)
                console.log("Viešbučių duomenys:", hotelsData)
    
                setEditedTrip({
                    ...tripData,
                    hotels: hotelsData,
                    gallery: Array.isArray(tripData.gallery) ? tripData.gallery : [],
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

     const addHotel = () => {
        if (!newHotel.name || !newHotel.price) return;
        setEditedTrip((prev) => ({ ...prev, hotels: [...prev.hotels, newHotel] }));
        setNewHotel({ name: "", price: "" });
    

        if (newHotel.name && newHotel.price) {
            setEditedTrip((prev) => ({
                ...prev,
                hotels: [...prev.hotels, { name: newHotel.name, price: newHotel.price }],
            }))
        }
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditedTrip({ ...editedTrip, [e.target.name]: e.target.value });
    }

    const imageUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setEditedTrip((prev) => ({ ...prev, gallery: [...prev.gallery, ...fileArray] }));
        }
    };

    const removeHotel = (index: number) => {
        setEditedTrip((prev) => ({
            ...prev,
            hotels: prev.hotels.filter((_, i) => i !== index),
        }))
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault()
        fetch(`http://localhost:3000/destinations/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedTrip),
        }).then(() => navigate(`/trip/${id}`))
    }
    
    
    return (
        <div className="edit-trip-information">
            <form onSubmit={submitHandler}>
                <label htmlFor="title">Miestas/Šalis:</label>
                <input type="text" name="title" value={editedTrip.title} onChange={changeHandler} placeholder="Pavadinimas" />

                <label htmlFor="description">Aprašymas:</label>
                <textarea name="description" value={editedTrip.description} onChange={changeHandler} placeholder="Aprašymas" />

                <label htmlFor="fullDescription">Platesnė informacija:</label>
                <textarea name="fullDescription" value={editedTrip.fullDescription} onChange={changeHandler} placeholder="Platesnė informacija" />

                <label htmlFor="duration">Trukmė:</label>
                <input type="number" name="duration" value={editedTrip.duration} onChange={changeHandler} placeholder="Trukmė (dienos)" />

                <label htmlFor="price">Kaina:</label>
                <input type="number" name="price" value={editedTrip.price} onChange={changeHandler} placeholder="Kaina (€)" />

                <label htmlFor="gallery">Nuotraukos</label>
                <input type="file" name="gallery" multiple onChange={imageUploadHandler} />

                <div className="gallery">
                    {editedTrip.gallery.map((img, index) => (
                        <div key={index} className="image-container">
                            <img src={img} alt={`Kelionės nuotrauka ${index}`} width={100} />
                            <button type="button" onClick={() => removeImage(index)}>Pašalinti</button>
                        </div>
                    ))}
                </div>

                <label htmlFor="hotel">Pridėkite naują Viešbutį:</label>
                <input type="text" id="hotel" placeholder="Viešbučio pavadinimas" />
                
                <input type="number" id="hotel-price" placeholder="Kaina (€)" />
                <button type="button" onClick={addHotel}>Pridėti viešbutį</button>

                <div className="hotel-selection">
                <h2>Viešbučių sąrašas</h2>
                {editedTrip.hotels.length > 0 ? (
                    <ul>
                        {editedTrip.hotels.map((hotel, index) => (
                            <li key={index}>
                                {hotel.name} - {hotel.price}€/naktis
                                <button type="button" onClick={() => removeHotel(index)}>❌</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Viešbučių nėra</p>
                )}
                </div>

                <button type="submit">Išsaugoti</button>
            </form>
            <button onClick={() => navigate(-1)}>Atšaukti</button>
        </div>
    )
}

export default EditTripInformation