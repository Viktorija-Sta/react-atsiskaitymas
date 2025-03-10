import { Link } from "react-router"
import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import TripItem from "./TripItem"

const TripList: React.FC = () => {
    const { trips } = useTravelPageContext()
    



    return (
        <div className="trip-list">
            <Link to="create/">
                <button>Pridėti naują kelionę</button>
            </Link>

            <h2>Naujausi kelionių pasiūlymai</h2>
            {trips.length > 0 ? (
                <div className="trips">
                    {trips.map((trip, index) => (
                        <TripItem key={index} data={trip} />
                    ))}
                </div>
            ) : (
                <p>Atsiprašome, kelionių šiuo metu neturime</p>
            )}
        </div>
    )
}

export default TripList