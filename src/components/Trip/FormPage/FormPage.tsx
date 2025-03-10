import { useNavigate } from "react-router";
import { useTravelPageContext } from "../../../pages/TravelPageContextProvider";

const FormPage: React.FC = () => {
    const { addItem } = useTravelPageContext()
    const navigate = useNavigate()

    const generateUniqueId = (): string => {
        return Math.random().toString(36).substr(2, 9)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const title = formData.get('title') as string
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'))
        const image = formData.get('image') as string
        const category = formData.get('category') as string

        const newTrip = {
            id: generateUniqueId(),
            title,
            description,
            price,
            image,
            category,
        }

        addItem(newTrip)

        try {
            await fetch("http://localhost:3000/destinations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTrip),
            });
        } catch (error) {
            console.error('Klaida įrašant duomenis į db:', error)
        }

        navigate("/")
        form.reset()
    }

    return (
        <>
            <h2>Pridėti kelionę</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Pavadinimas" required />
                <input type="text" name="description" placeholder="Aprašymas" required />
                <input type="number" name="price" placeholder="Kaina" required />
                <input type="text" name="image" placeholder="Nuotrauka" required />
                <input type="text" name="category" placeholder="Kategorija" required />
                <button type="submit">Pridėti naują kelionę</button>
            </form>
        </>
    )
}

export default FormPage
