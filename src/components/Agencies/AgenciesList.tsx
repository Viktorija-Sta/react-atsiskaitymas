import { useEffect, useState } from "react"
import { API_URL } from "../config"
import AgencyItem from "./AgencyItem"
import { Link } from "react-router"

interface Agency {
    id: string
    name: string
    location: string
    link: string
}

const AgenciesList: React.FC = () => {
    const [agencies, setAgencies] = useState<Agency[]>([])
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

            } finally {
                setLoading(false)
            }
        }

        fetchAgencies()
    }, [])

    if(loading) return <p>Kraunama...</p>
    if(error) return <p className="error">{error}</p>

    return (
        <div className="agencies-list">
            <h2>Visos</h2>
            {agencies.length > 0 ? (
                <div className="agencies">
                    {agencies.map((agency) => (
                        <div key={agency.id} className="agency-wrapper">
                            <Link to={`/agency/${agency.id}`}>
                                <AgencyItem data={agency} />
                            </Link>
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