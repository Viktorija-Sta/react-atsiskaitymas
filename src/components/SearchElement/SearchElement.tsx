import { useState } from "react";
import Select, { MultiValue } from "react-select";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import './searchElement.scss'

interface SearchElementProps {
    onFilterChange: (categories: string[], searchTerm: string) => void
}

const SearchElement: React.FC<SearchElementProps> = ({ onFilterChange }) => {
    const { trips } = useTravelPageContext()
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Sukuriamas unikalus kelionių kategorijų sąrašas
    const categories = Array.from(new Set(trips.map((trip) => trip.category))).map((category) => ({
        value: category,
        label: category,
    }))

    // Funkcija kategorijų pasirinkimui valdyti
    const handleCategoryChange = (newValue: MultiValue<{ value: string; label: string }>) => {
        const newCategories = newValue ? newValue.map((option: { value: string; label: string }) => option.value) : []
        setSelectedCategories(newCategories)
        onFilterChange(newCategories, searchTerm)
    }

     // Funkcija paieškos laukelio reikšmei valdyti
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        onFilterChange(selectedCategories, newSearchTerm)
    }

    return (
        <div className="search-element">
            <input
                type="text"
                placeholder="Ieškoti kelionės..."
                value={searchTerm}
                onChange={handleSearchChange}
                
            />

            <Select
                options={categories}
                isMulti
                placeholder="Pasirinkite kategorijas"
                onChange={handleCategoryChange}
            />
        </div>
    )
}

export default SearchElement
