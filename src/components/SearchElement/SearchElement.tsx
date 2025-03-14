import { useState, useMemo } from "react";
import Select from "react-select";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import TripItem from "../Trips/TripItem";

const SearchElement = () => {
    const { trips } = useTravelPageContext();

    // Unikalios kategorijos pasirinkimui
    const categories = useMemo(() => {
        return [...new Set(trips.map(trip => trip.category))].map(category => ({
            value: category,
            label: category
        }));
    }, [trips]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Automatinė filtracija be `useEffect`
    const filteredDestinations = useMemo(() => {
        return trips.filter(trip => {
            const matchesCategory =
                selectedCategories.length === 0 || selectedCategories.includes(trip.category);
            const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [trips, selectedCategories, searchTerm]);

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
                onChange={(selectedOptions) =>
                    setSelectedCategories(selectedOptions.map(option => option.value))
                }
            />

            <div style={{ marginTop: "1em" }}>
                {filteredDestinations.length > 0 ? (
                    filteredDestinations.map(trip => (
                        <TripItem key={trip.id} data={trip} />
                    ))
                ) : (
                    <p>Kelionė nerasta</p>
                )}
            </div>
        </div>
    );
};

export default SearchElement;
