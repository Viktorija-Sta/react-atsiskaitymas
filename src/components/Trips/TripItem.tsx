import React, { useState } from "react";
import { TravelItem } from "../../pages/travelReducer";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import EditTrip from "../EditTrip/EditTrip";

interface TripItemProps {
    data: TravelItem
}

const TripItem: React.FC<TripItemProps> = ({ data }) => {
    const { removeItem, updateItem } = useTravelPageContext()
    const { id, title, description, price, image } = data

    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const deleteHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
    
        if (!window.confirm("Ar tikrai norite pašalinti šią kelionę?")) return
    
        setIsDeleting(true)
        
        try {
            await removeItem(id)
        } catch (error) {
            console.error("Klaida šalinant kelionę:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="trip-item">
            <h3>{title}</h3>
            <img src={image} alt={title} width={500} />
            <p>{description}</p>
            <p>Kaina: {price}€</p>
            <button onClick={() => setIsEditing(true)}>Redaguoti</button>
            <button onClick={deleteHandler} disabled={isDeleting}>
                {isDeleting ? "Šalinama" : "Šalinti"}
            </button>

            {isEditing && (
                <EditTrip trip={data} onClose={() => setIsEditing(false)} onSave={updateItem} />
            )}
        </div>
    )
}

export default TripItem;
