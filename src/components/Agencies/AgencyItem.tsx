import { useState } from "react"
import { AgenciesItem } from "../../pages/travelReducer"
import { Button } from "@mui/material"
import { useTravelPageContext } from "../../pages/TravelPageContextProvider"
import { API_URL } from "../../components/config"
import { useNavigate } from "react-router"

interface AgencyItemProps {
    data: AgenciesItem
}

const AgencyItem: React.FC<AgencyItemProps> = ({ data }) => {
    const { id, name, location } = data
    const { fetchAgencies } = useTravelPageContext()
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate()

    const deleteHandler = async () => {
        if (!window.confirm(`Ar tikrai norite pašalinti agentūrą "${name}"?`)) return

        setIsDeleting(true)

        try {
            await fetch(`${API_URL}/agencies/${id}`, {
                method: "DELETE",
            })

            await fetchAgencies()
        } catch (err) {
            console.error("Klaida šalinant agentūrą:", err)
        } finally {
            setIsDeleting(false)
        }
        navigate(`/agencies`)
    }

    return (
        <div className="agency-item">
            <h3>"{name}"</h3>
            <p>Įkurta: {location}</p>

            <Button
                variant="contained"
                type="button" // <--- ŠITA LINIJA SPRENDŽIA PROBLEMĄ
                onClick={deleteHandler}
                disabled={isDeleting}
                className={isDeleting ? "disabled-button" : ""}
            >
                {isDeleting ? "Šalinama..." : "Šalinti"}
            </Button>
            
        </div>
    )
}

export default AgencyItem
