import { useState, useEffect } from "react";
import Select from "react-select";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import TripItem from "../Trips/TripItem";

const SearchElement = () => {
    const { trips } = useTravelPageContext();
    const categories = [...new Set(trips.map(trip => trip.category))].map(category => ({
        value: category,
        label: category
    }))

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredDestinations, setFilteredDestinations] = useState(trips)

    useEffect(() => {
        setFilteredDestinations(trips)
    }, [trips])

    const searchHandler = () => {
        const filtered = trips.filter(trip => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(trip.category)
            const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesCategory && matchesSearch
        })
        setFilteredDestinations(filtered)
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Ieškoti kelionės..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "1em", padding: "5px", width: "100%" }}
            />

            <Select
                options={categories}
                isMulti
                placeholder="Pasirinkite kategorijas"
                onChange={(selectedOptions) => setSelectedCategories(selectedOptions.map(option => option.value))}
            />

            <button onClick={searchHandler} style={{ marginTop: "1em", padding: "10px", cursor: "pointer" }}>
                Ieškoti
            </button>

            <div>
                {filteredDestinations.length > 0 ? (
                    filteredDestinations.map(trip => <TripItem key={trip.id} data={trip} />)
                ) : (
                    <p>Kelionė nerasta</p>
                )}
            </div>
        </div>
    )
}

export default SearchElement
