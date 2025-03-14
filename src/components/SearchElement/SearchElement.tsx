import { useState } from "react";
import Select, { MultiValue } from "react-select";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";

interface SearchElementProps {
    onFilterChange: (categories: string[], searchTerm: string) => void
}

const SearchElement: React.FC<SearchElementProps> = ({ onFilterChange }) => {
    const { trips } = useTravelPageContext()
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const categories = Array.from(new Set(trips.map((trip) => trip.category))).map((category) => ({
        value: category,
        label: category,
    }))

    const handleCategoryChange = (newValue: MultiValue<{ value: string; label: string }>) => {
        const newCategories = newValue ? newValue.map((option: { value: string; label: string }) => option.value) : []
        setSelectedCategories(newCategories)
        onFilterChange(newCategories, searchTerm)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        onFilterChange(selectedCategories, newSearchTerm)
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Ieškoti kelionės..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: "1em", padding: "5px", width: "100%" }}
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
