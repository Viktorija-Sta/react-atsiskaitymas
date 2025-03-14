import SearchElement from "../components/SearchElement/SearchElement"
import TripList from "../components/Trips/TripList"
import { TravelPageContextProvider } from "./TravelPageContextProvider"


const TravelPage: React.FC = () => {
    return(
        <TravelPageContextProvider>
            <SearchElement />
            <TripList />
        </TravelPageContextProvider>
    )
}

export default TravelPage