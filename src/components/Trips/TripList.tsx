import { useState, useEffect } from "react";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import TripItem from "./TripItem";
import { Link } from "react-router";
import SearchElement from "../SearchElement/SearchElement";
import './trip.scss'

const TripList: React.FC = () => {
    const { trips } = useTravelPageContext()
    const [filteredTrips, setFilteredTrips] = useState(trips)

    useEffect(() => {
        setFilteredTrips(trips)
    }, [trips])

    const handleFilterChange = (categories: string[], searchTerm: string) => {
        const newFilteredTrips = trips.filter(trip =>
            (categories.length === 0 || categories.includes(trip.category)) &&
            trip.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredTrips(newFilteredTrips)
    }

    return (
        <div className="trip-list">
            <div className="actions">
                <Link to="create/">
                    <button>Pridėti naują kelionę</button>
                </Link>
                <Link to="/agencies">Kelionių organizatoriai</Link>
            </div>

            <SearchElement onFilterChange={handleFilterChange} />

            <h2>Naujausi kelionių pasiūlymai</h2>

            {filteredTrips.length > 0 ? (
                <div className="trips">
                    {filteredTrips.map((trip) => (
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
