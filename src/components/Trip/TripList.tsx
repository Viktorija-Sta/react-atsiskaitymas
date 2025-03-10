import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import TripItem from "./TripItem"

const TripList: React.FC = () => {
    const { trips } = useTravelPageContext()

    return (
        <div className="trip-list">
            <h2>Naujausi kelionių pasiūlymai</h2>
            {trips.length > 0 ? (
                <div className="trips">
                    {trips.map((trip) => (
                        <TripItem key={trip.id} data={trip} />
                    ))}
                </div>
            ) : (
                <p>Atsiprašome, kelionių šiuo metu neturime</p>
            )}
        </div>
    )
}

export default TripList