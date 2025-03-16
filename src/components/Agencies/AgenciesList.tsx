import { useEffect, useState } from "react"
import { API_URL } from "../config"
import AgencyItem from "./AgencyItem"
import { Link } from "react-router"
import './agenciesList.scss'

interface Agency {
    id: string
    name: string
    location: string
    contacts: 
    [
        {
        email: string
        phone: string
    }
]
}

const AgenciesList: React.FC = () => {
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [agencyTripCounts, setAgencyTripCounts] = useState<{ [key: string]: number }>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const res = await fetch(`${API_URL}/agencies`)
                if (!res.ok) throw new Error("Nepavyko gauti agentūrų")
                const data = await res.json()

                setAgencies(data)
                
            } catch (error) {
                setError("Nepavyko užkrauti agentūrų")
                console.error("Klaida gaunant agentūras:", error)
            }
        }

        const fetchDestinationsAgencies = async () => {
            try {
                const res = await fetch(`${API_URL}/destinationsAgencies`)
                if (!res.ok) throw new Error("Nepavyko gauti kelionių duomenų")
                const data = await res.json()

                const counts: { [key: string]: number } = {}
                data.forEach((item: { agencyId: string }) => {
                    counts[item.agencyId] = (counts[item.agencyId] || 0) + 1
                })

                setAgencyTripCounts(counts)
            } catch (error) {
                console.error("Klaida gaunant kelionių duomenis:", error)
            }
        }

        const fetchData = async () => {
            setLoading(true)
            await Promise.all([fetchAgencies(), fetchDestinationsAgencies()])
            setLoading(false)
        }

        fetchData()
    }, [])

    if(loading) return <p>Kraunama...</p>
    if(error) return <p className="error">{error}</p>

    return (
        <div className="agencies-list">
            
            <h2>Visos agentūros:</h2>
            {agencies.length > 0 ? (
                <div className="agencies">
                    {agencies.map((agency) => (
                        <div key={agency.id} className="agency-wrapper">
                            <Link to={`/agency/${agency.id}`}>
                                <AgencyItem data={agency} />
                            </Link>
                            <p>Kelionių paketų: {agencyTripCounts[agency.id] || 0}</p>
                        </div>
                        
                    ))}
                </div>
            ) : (
                <p>Atsiprašome, agentūrų šiuo metu neturime</p>
            )}
        </div>
    )
}

export default AgenciesList