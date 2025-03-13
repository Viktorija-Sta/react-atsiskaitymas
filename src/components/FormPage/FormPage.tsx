import { useState } from "react";
import { useNavigate } from "react-router";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import { HotelItem, TravelItem } from "../../pages/travelReducer";

const FormPage: React.FC = () => {
    const { addItem, addHotel, trips,  } = useTravelPageContext()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [duration, setDuration] = useState('')
    const [fullDescription, setFullDescription] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [hotel, setHotel] = useState('')
    const [hotelPrice, setHotelPrice] = useState('')
    const [galleryLinks, setGalleryLinks] = useState('')
    
    const [agency, setAgency] = useState({
        name: '',
        location: '',
        email: '',
        phone: '',
    })

    const generateUniqueId = (): string => Math.random().toString(36).substr(2, 9)

    const agencyChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgency({ ...agency, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
            
        const existingTrip = trips.find((trip) => trip.title === title)
        if (existingTrip) {
            console.log("Kelionė jau yra sąraše.")
            return
        }

        const galleryUrlArray = galleryLinks.split(",").map(link => link.trim()).filter(link => link !== "")
        const tripId = generateUniqueId()

        const newTrip: TravelItem = {
            id: tripId,
            title,
            description,
            price: Number(price),
            image,
            category,
            duration,
            fullDescription,
            gallery: galleryUrlArray,
            agency: agency.name,
        }

        const newHotel: HotelItem = {
            id: generateUniqueId(),
            destinationsId: tripId,
            name: hotel,
            price: Number(hotelPrice),
        }

        await addItem(newTrip)
        await addHotel(newHotel)

        navigate("/")
    }

    return (
        <>
            <h2>Pridėti naują kelionės kryptį</h2>
            <form onSubmit={submitHandler}>
                <input type="text" placeholder="Pavadinimas" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Aprašymas" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="text" placeholder="Trukmė" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                <textarea placeholder="Platesnė informacija" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} required />
                <input type="text" placeholder="Titulinė nuotrauka" value={image} onChange={(e) => setImage(e.target.value)} required />
                <label>Galerijos nuotraukos (nuorodos, atskirkite kableliais)</label>
                <textarea value={galleryLinks} onChange={(e) => setGalleryLinks(e.target.value)} placeholder="Įveskite nuorodas, atskirtas kableliais" />
                <input type="text" placeholder="Kategorija" value={category} onChange={(e) => setCategory(e.target.value)} required />
                <input type="number" placeholder="Kaina" value={price} onChange={(e) => setPrice(e.target.value)} required />

                <h3>Kelionių organizatorius</h3>
                <input type="text" name="name" placeholder="Pavadinimas" value={agency.name} onChange={agencyChangeHandler} required />
                <input type="text" name="location" placeholder="Vieta" value={agency.location} onChange={agencyChangeHandler} required />
                <input type="email" name="email" placeholder="El. paštas" value={agency.email} onChange={agencyChangeHandler} required />
                <input type="tel" name="phone" placeholder="Telefonas" value={agency.phone} onChange={agencyChangeHandler} required />


                <input type="text" placeholder="Viešbučio pavadinimas" value={hotel} onChange={(e) => setHotel(e.target.value)} required />
                <input type="number" placeholder="Viešbučio kaina (€/nakčiai)" value={hotelPrice} onChange={(e) => setHotelPrice(e.target.value)} required />

                <button type="submit">Pridėti naują kelionę</button>
            </form>
        </>
    )
}

export default FormPage
