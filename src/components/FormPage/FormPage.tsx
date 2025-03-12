import { useState } from "react";
import { useNavigate } from "react-router";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import { HotelItem, TravelItem } from "../../pages/travelReducer";

const FormPage: React.FC = () => {
    const { addItem, addHotel, trips } = useTravelPageContext()
    const navigate = useNavigate()

    const [galleryLinks, setGalleryLinks] = useState<string>("")

    const generateUniqueId = (): string => {
        return Math.random().toString(36).substr(2, 9)
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const existingTrip = trips.find((trip) => trip.title === formData.get("title"))
        if (existingTrip) {
            console.log("Kelionė jau yra sąraše.")
            return
        }

        const galleryFiles = formData.getAll("gallery") as File[]
        const galleryFileUrls = galleryFiles.map((file) => URL.createObjectURL(file))

        const galleryUrlArray = galleryLinks.split(",").map((link) => link.trim()).filter((link) => link !== "")

        const galleryUrls = [...galleryFileUrls, ...galleryUrlArray]

        const tripId = generateUniqueId()

        const newTrip: TravelItem = {
            id: tripId,
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),
            image: formData.get("image") as string,
            category: formData.get("category") as string,
            duration: formData.get("duration") as string,
            fullDescription: formData.get("fullDescription") as string,
            gallery: galleryUrls,
        }

        const newHotel: HotelItem = {
            id: generateUniqueId(),
            destinationsId: tripId,
            name: formData.get("hotel") as string,
            price: Number(formData.get("hotel-price")),
        }

        await addItem(newTrip)
        await addHotel(newHotel)

        navigate("/")
        form.reset()
        setGalleryLinks("")
    }

    return (
        <>
            <h2>Pridėti naują kelionės kryptį</h2>
            <form onSubmit={submitHandler}>
                <input type="text" name="title" placeholder="Pavadinimas" required />
                <input type="text" name="description" placeholder="Aprašymas" required />
                <input type="text" name="duration" placeholder="Trukmė" required />
                <textarea name="fullDescription" placeholder="Platesnė informacija" required minLength={30} />

                <input type="text" name="image" placeholder="Titulinė nuotrauka" required />

                <label>Galerijos nuotraukos (failai)</label>
                <input type="file" name="gallery" multiple />

                <label>Galerijos nuotraukos (nuorodos, atskirkite kableliais)</label>
                <textarea
                    name="gallery-links"
                    value={galleryLinks}
                    onChange={(e) => setGalleryLinks(e.target.value)}
                    placeholder="Įveskite nuorodas, atskirtas kableliais"
                />

                <input type="text" name="category" placeholder="Kategorija" required />
                <input type="number" name="price" placeholder="Kaina" required />

                <input type="text" name="hotel" placeholder="Viešbučio pavadinimas" required />
                <input type="number" name="hotel-price" placeholder="Viešbučio kaina (€/nakčiai)" required />

                <button type="submit">Pridėti naują kelionę</button>
            </form>
        </>
    )
}

export default FormPage
