import { useState } from "react"
import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import { TravelItem } from "../../pages/travelReducer"

interface TripItemProps {
    data: TravelItem
}

const TripItem: React.FC<TripItemProps> = ({ data }) => {
    const { removeItem, updateItem } = useTravelPageContext()
    const { id, title, description, price, image } = data

    const [isEditing, setIsEditing] = useState(false)
    const [editedTrip, setEditedTrip] = useState<TravelItem>({ ...data })

    const removeHandler = () => {
        removeItem(id)
    }

    const editClickHandler = () => {
        setIsEditing(true)
    }

    const saveHandler = () => {
        if (editedTrip.title && editedTrip.description && editedTrip.price > 0) {
            updateItem(editedTrip)
            setIsEditing(false)
        } else {
            alert("Prašome užpildyti visus laukus ir įvesti teisingą kainą.");
        }
    }
    return (
        <>
             <div className="trip-item">
            {isEditing ? (
                <>
                    <input type="text" value={editedTrip.title} onChange={(e) => setEditedTrip({ ...editedTrip, title: e.target.value })} />
                    <textarea value={editedTrip.description} onChange={(e) => setEditedTrip({ ...editedTrip, description: e.target.value })} />
                    <input type="number" value={editedTrip.price} onChange={(e) => setEditedTrip({ ...editedTrip, price: parseFloat(e.target.value) })} />
                    <button onClick={saveHandler}>Išsaugoti</button>
                </>
            ) : (
                <>
                    <h3>{title}</h3>
                    <img src={image} alt={title} width={500} />
                    <p>{description}</p>
                    <p>{price} €</p>
                    <button onClick={removeHandler}>Pašalinti</button>
                    <button onClick={editClickHandler}>Redaguoti</button>
                </>
            )}
        </div>
        </>
    )
}

export default TripItem