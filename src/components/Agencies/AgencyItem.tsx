import { AgenciesItem } from "../../pages/travelReducer"

interface AgencyItemProps {
    data: AgenciesItem
}

const AgencyItem: React.FC<AgencyItemProps> = ({  data }) => {
    const { name, location, link } = data
    return (
        <div className="agency-item">
            <h3>{name}</h3>
            <p>{location}</p>
            {link ? (
                <a href={link} target="_blank" rel="noreferrer">
                    {link}
                </a>
            ) : (
                <p>Nuorodos nėra</p>
            )}   
        </div>
    )
}
export default AgencyItem
