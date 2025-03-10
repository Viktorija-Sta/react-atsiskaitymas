import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import { TravelItem } from "../../pages/travelReducer"

interface TripItemProps {
    data: TravelItem
}

const TripItem: React.FC<TripItemProps> = ({ data }) => {
    const { removeItem, updateItem } = useTravelPageContext()
    const { id, title, description, price, image, category } = data

    const handleRemove = () => {
        removeItem(id)
    }

    return (
        <>
            <div className="trip-item">
                <h3>{title}</h3>
                <img src={image} alt={title} />
                <p>{description}</p>
                <p>{price} €</p>

                <button onClick={handleRemove}>Pašalinti</button>
            </div>
        </>
    )
}

export default TripItem