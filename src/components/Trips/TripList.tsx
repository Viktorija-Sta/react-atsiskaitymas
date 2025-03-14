import { Link } from "react-router";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import TripItem from "./TripItem";
import React, { useEffect } from "react";

const TripList: React.FC = () => {
    const { trips,  fetchAgencies, agencies } = useTravelPageContext()

    console.log("Kelionių sąrašas:", trips)
    console.log("Agentūros sąrašas:", agencies)

    useEffect(() => {
        fetchAgencies()
    }, [])

    return (
        <div className="trip-list">
            <div className="actions">
                <Link to="create/">
                    <button>Pridėti naują kelionę</button>
                </Link>

                <Link to="/agencies">
                    <button>Kelionių organizatoriai</button>
                </Link>
            </div>

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
