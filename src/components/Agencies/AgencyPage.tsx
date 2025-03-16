import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { API_URL } from "../config";
import { AgenciesItem, TravelItem } from "../../pages/travelReducer";
import TripItem from "../Trips/TripItem";
import { Button } from "@mui/material";
import './agencyPage.scss'

const AgencyPage: React.FC = () => {
    const { id } = useParams() as { id: string }
    const [agency, setAgency] = useState<AgenciesItem | null>(null)
    const [trips, setTrips] = useState<TravelItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                const agencyRes = await fetch(`${API_URL}/agencies`)
                if (!agencyRes.ok) throw new Error("Nepavyko gauti agentūros duomenų")

                const agenciesData: AgenciesItem[] = await agencyRes.json()
                const foundAgency = agenciesData.find((a) => a.id === id) || null
                
                if (!foundAgency) {
                    setError("Agentūra nerasta")
                    setLoading(false)
                    return
                }

                setAgency(foundAgency)

                const tripsRes = await fetch(`${API_URL}/destinations`)
                if (!tripsRes.ok) throw new Error("Nepavyko gauti agentūros kelionių")

                const tripsData: TravelItem[] = await tripsRes.json()

                if (!Array.isArray(tripsData)) {
                    throw new Error("Blogas tripsData formatas")
                }

                const filteredTrips = tripsData.filter((trip) => trip.agencyId === id)
                setTrips(filteredTrips)

            } catch (error) {
                setError("Įvyko klaida")
                console.error(error)

            } finally {
                setLoading(false)
            }
        }

        fetchAgencyData()
    }, [id])

    if (loading) return <p>Kraunama...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="agency-page">
            {agency && 
            <Link to={`/agencies/edit/${agency.id}`}>
                <Button variant="outlined"> Redaguoti agentūrą</Button>
            </Link>}

            {agency && (
                <div className="agency-info">
                    <h2>"{agency.name}"</h2>
                    <h4>Kontaktai</h4>
                    <ul>
                        <li>{agency.contacts[0]?.email}</li>
                        <li>{agency.contacts[0]?.phone}</li>
                    </ul>
                </div>
            )}

            <h3>Agentūros kelonių pasiūlymai</h3>
                {trips.length > 0 ? (
                    trips.map((trip) => (
                        <div className="trips" style={{
                            display: "flex",
                            flexWrap: "wrap",
                            maxWidth: "80%",
                            padding: "20px",
                            border: "1px solid rgba(194, 192, 194, 0.397)",
                            borderRadius: '8px',
                            margin: "20px",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                            
                        }}>
                            <Link  
                            to={`/trip/${trip.id}`} key={trip.id} className="trip-wrapper"
                            style={{
                                textDecoration: "none", 
                                color: "black", 
                                display: "flex",
                                flexDirection: "column",
                                flexWrap: "wrap",
                                width: "100%"
                                
                            }}>
                                <TripItem  key={trip.id} data={trip} />
                            </Link>
            </div>
                        ))
                    ) : (
                    <p>Ši agentūra dar neturi kelionių</p>
                )}
        </div>
    )
}

export default AgencyPage
