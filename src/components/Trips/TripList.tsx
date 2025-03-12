import { Link } from "react-router"
import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import TripItem from "./TripItem"
import React from "react"


const TripList: React.FC = () => {
    const { trips, fetchDestinations } = useTravelPageContext()
    
    React.useEffect(() => {
        fetchDestinations()
    }, [fetchDestinations])


    return (
        <div className="trip-list">
            <Link to="create/">
                <button>Pridėti naują kelionę</button>
            </Link>

            <h2>Naujausi kelionių pasiūlymai</h2>
            
            {trips.length > 0 ? (
                <div className="trips">
                {trips.map((trip) => (
                    <Link key={trip.id} to={`/trip/${trip.id}`}>
                        <TripItem data={trip} />
                    </Link>
                ))}
            </div>
            ) : (
                <p>Atsiprašome, kelionių šiuo metu neturime</p>
            )}
        </div>
    )
}

export default TripList