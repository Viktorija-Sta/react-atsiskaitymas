import React, { useState } from "react";
import { TravelItem } from "../../pages/travelReducer";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import EditTrip from "../EditTrip/EditTrip";

interface TripItemProps {
    data: TravelItem;
}

const TripItem: React.FC<TripItemProps> = ({ data }) => {
    const { removeItem, updateItem } = useTravelPageContext();
    const { id, title, description, price, image } = data;

    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = (updatedTrip: TravelItem) => {
        updateItem(updatedTrip);
        setIsEditing(false);
    };

    return (
        <div className="trip-item">
            <h3>{title}</h3>
            <img src={image} alt={title} width={500} />
            <p>{description}</p>
            <p>Kaina: {price}€</p>
            <button onClick={handleEditClick}>Redaguoti</button>
            <button onClick={() => removeItem(id)}>Šalinti</button>

            {isEditing && (
                <EditTrip trip={data} onClose={() => setIsEditing(false)} onSave={handleSave} />
            )}
        </div>
    );
};

export default TripItem;
