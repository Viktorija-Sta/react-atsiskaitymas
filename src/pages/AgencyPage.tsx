import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { API_URL } from "../components/config"
import TripItem from "../components/Trips/TripItem"
import { AgenciesItem, TravelItem } from "./travelReducer"

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
                if(!agencyRes.ok) throw new Error ("Nepavyko gauti agentūros duomenų")
                const agenciesData: AgenciesItem[] = await agencyRes.json()
                const foundAgency = agenciesData.find((a) => a.id === id) || null
                setAgency(foundAgency)

                const tripsRes = await fetch(`${API_URL}/destinations`)
                if (!tripsRes.ok) throw new Error("Nepavyko gauti agentūros kelionių")
                const tripsData = await tripsRes.json()

                const destinationsAgenciesRes = await fetch(`${API_URL}/destinationsAgencies`)
                if (!destinationsAgenciesRes.ok) throw new Error("Nepavyko gauti agentūrų kelionių sąrašo")
                const destinationsAgenciesData = await destinationsAgenciesRes.json()

                const agencyDestinations = destinationsAgenciesData?.destinationsAgencies 
                    ?.filter((da: { agencyId: string }) => da.agencyId === id)
                    ?.map((da: { destinationId: string }) => da.destinationId) || []

                const filteredTrips = tripsData.destinations.filter(
                    (trip: TravelItem) => agencyDestinations.includes(trip.id)
                )

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
            {agency && (
                <div className="agency-info">
                    <h2>{agency.name}</h2>
                    <p>{agency.location}</p>
                    {agency.link && <a href={agency.link} target="_blank" rel="noreferrer">Oficialus puslapis</a>}
                </div>
            )}

            <h3>Agentūros kelionės</h3>
            {trips.length > 0 ? (
                <div className="trips">
                    {trips.map((trip) => (
                        <TripItem key={trip.id} data={trip} />
                    ))}
                </div>
            ) : (
                <p>Ši agentūra dar neturi kelionių</p>
            )}
        </div>
    )
}

export default AgencyPage