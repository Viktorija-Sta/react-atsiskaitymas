import { useState } from "react"
import Select, { MultiValue } from "react-select"
import './searchElement.scss'

interface SearchElementProps {
    onFilterChange: (categories: string[], searchTerm: string) => void
    options: string[] // Pvz. location sąrašas iš agentūrų
}

const SearchElement: React.FC<SearchElementProps> = ({ onFilterChange, options }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Unikalios reikšmės į select formatą
    const categories = Array.from(new Set(options)).map((option) => ({
        value: option,
        label: option,
    }))

    const handleCategoryChange = (newValue: MultiValue<{ value: string; label: string }>) => {
        const newCategories = newValue ? newValue.map((option) => option.value) : []
        setSelectedCategories(newCategories)
        onFilterChange(newCategories, searchTerm)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        onFilterChange(selectedCategories, newSearchTerm)
    }

    return (
        <div className="search-element">
            <input
                type="text"
                placeholder="Ieškoti pavadinimo..."
                value={searchTerm}
                onChange={handleSearchChange}
            />

            <Select
                options={categories}
                isMulti
                placeholder="Pasirinkite vietoves"
                onChange={handleCategoryChange}
                className="select-filter"
            />
        </div>
    )
}

export default SearchElement
