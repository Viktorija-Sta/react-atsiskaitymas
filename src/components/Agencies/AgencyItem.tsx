import { AgenciesItem } from "../../pages/travelReducer"

interface AgencyItemProps {
    data: AgenciesItem
}

const AgencyItem: React.FC<AgencyItemProps> = ({  data }) => {
    const { name, location } = data
    return (
        <div className="agency-item">
            <h3>"{name}"</h3>
            <p>Įkurta: {location}</p>
        </div>
    )
}
export default AgencyItem
