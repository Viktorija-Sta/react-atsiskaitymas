import { useState } from "react";
import { useNavigate } from "react-router";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import { AgenciesItem, HotelItem, TravelItem } from "../../pages/travelReducer";
import './formPage.scss'
import { Button, MenuItem, Select, TextField } from "@mui/material";

const FormPage: React.FC = () => {
    const { addItem, addHotel, trips, addAgency } = useTravelPageContext()
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
        id: '',
        name: '',
        location: '',
        email: '',
        phone: '',
    })

    const generateUniqueId = (): string => Math.random().toString(36).slice(2, 11)

    const agencyChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAgency((prevAgency) => ({ ...prevAgency, [name]: value }))
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
    
        const existingTrip = trips.find((trip) => trip.title === title)
        if (existingTrip) {
            console.log("Kelionė jau yra sąraše.")
            navigate(`/trip/${existingTrip.id}`) 
            return
        }
    
        const galleryUrlArray = galleryLinks
            .split(",")
            .map(link => link.trim())
            .filter(link => link !== "")
    
        const tripId = generateUniqueId()
        const agencyId = generateUniqueId()
    
        const newAgency: AgenciesItem = {
            id: agencyId,
            name: agency.name,
            location: agency.location,
            contacts: [
                {
                    email: agency.email,
                    phone: agency.phone,
                }
            ]
        }
    
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
            agencyId: agencyId
        }
    
        const newHotel: HotelItem = {
            id: generateUniqueId(),
            destinationsId: tripId,
            name: hotel,
            price: Number(hotelPrice),
        }
    
        await addAgency(newAgency)
        await addItem(newTrip)
        await addHotel(newHotel)
    
        navigate(`/trip/${tripId}`)
    }

    return (
        
        <div className="create-page">
            <h2>Pridėti naują kelionės kryptį</h2>
            <form onSubmit={submitHandler}>
                <TextField id="standard-basic" type="text" placeholder="Miestas, Šalis" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <TextField id="standard-basic" type="text" placeholder="Aprašymas" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <TextField id="standard-basic" type="number" placeholder="Trukmė (dienomis)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                <TextField id="standard-basic" placeholder="Platesnė informacija" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} required />
                <TextField id="standard-basic" type="text" placeholder="Titulinė nuotrauka" value={image} onChange={(e) => setImage(e.target.value)} required />
                <TextField id="standard-basic" value={galleryLinks} onChange={(e) => setGalleryLinks(e.target.value)} placeholder="Įveskite nuorodas, atskirtas kableliais" />

                <div className="select-element">
                    <p>Pasirinkite kategoriją</p>
                    <Select fullWidth value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <MenuItem value=""></MenuItem>
                        <MenuItem value="Azija">Azija</MenuItem>
                        <MenuItem value="Afrika">Afrika</MenuItem>
                        <MenuItem value="Europa">Europa</MenuItem>
                        <MenuItem value="JAV">JAV</MenuItem>
                        <MenuItem value="Kita">Kita</MenuItem>
                        
                    </Select>
                </div>

                <TextField id="standard-basic" type="number" placeholder="Kaina" value={price} onChange={(e) => setPrice(e.target.value)} required />

                <h3>Kelionių organizatoriaus informacija</h3>
                <TextField id="standard-basic" type="text" name="name" placeholder="Pavadinimas" value={agency.name} onChange={agencyChangeHandler} required />
                <TextField id="standard-basic" type="text" name="location" placeholder="Lokacija" value={agency.location} onChange={agencyChangeHandler} required />
                <TextField id="standard-basic" type="email" name="email" placeholder="El. paštas" value={agency.email} onChange={agencyChangeHandler} required />
                <TextField id="standard-basic" type="tel" name="phone" placeholder="Telefonas" value={agency.phone} onChange={agencyChangeHandler} required />

                <div className="hotel-info">
                    <p>Viešbučio informacija</p>
                    <TextField id="standard-basic" type="text" placeholder="Viešbučio pavadinimas" value={hotel} onChange={(e) => setHotel(e.target.value)} required />
                    <TextField id="standard-basic" type="number" placeholder="Viešbučio kaina (€/nakčiai)" value={hotelPrice} onChange={(e) => setHotelPrice(e.target.value)} required />
                </div>
                <Button variant="contained" type="submit">Pridėti naują kelionę</Button>
            </form>
        </div>
        
    )
}

export default FormPage
