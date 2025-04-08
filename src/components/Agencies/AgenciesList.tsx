import { useEffect, useState } from "react"
import { API_URL } from "../config"
import AgencyItem from "./AgencyItem"
import { Link } from "react-router"
import './agenciesList.scss'
import SearchElement from "../SearchElement/SearchElement"
import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import { Button } from "@mui/material"

interface Agency {
    id: string
    name: string
    location: string
    contacts: [
        {
            email: string
            phone: string
        }
    ]
}

const AgenciesList: React.FC = () => {
    const { trips } = useTravelPageContext()
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const agencyTripCounts = trips.reduce((acc: { [key: string]: number }, trip) => {
        acc[trip.agencyId] = (acc[trip.agencyId] || 0) + 1
        return acc
    }, {})

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const res = await fetch(`${API_URL}/agencies`)
                if (!res.ok) throw new Error("Nepavyko gauti agentūrų")
                const data = await res.json()
                setAgencies(data)
                setFilteredAgencies(data)
            } catch (error) {
                setError("Nepavyko užkrauti agentūrų")
                console.error("Klaida gaunant agentūras:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAgencies()
    }, [])

    const handleFilterChange = (categories: string[], searchTerm: string) => {
        const newFilteredAgencies = agencies.filter(agency =>
            (categories.length === 0 || categories.includes(agency.location)) &&
            agency.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredAgencies(newFilteredAgencies)
    }

    if (loading) return <p>Kraunama...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="agencies-list">
            <SearchElement
                onFilterChange={handleFilterChange}
                options={agencies.map(a => a.location)}
            />
            <h2>Visos agentūros:</h2>
            {filteredAgencies.length > 0 ? (
                <div className="agencies">
                    {filteredAgencies.map((agency) => (
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
            <Link to={'/'} className="back-link">
                <Button variant="contained" className="back-button">Į kelionių sąrašą</Button>
            </Link>
        </div>
    )
}

export default AgenciesList
