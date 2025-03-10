import TripList from "../components/Trip/TripList"
import { TravelPageContextProvider } from "./TravelPageContextProvider"

const TravelPage: React.FC = () => {
    return(
        <TravelPageContextProvider>
            <TripList />
        </TravelPageContextProvider>
    )
}

export default TravelPage