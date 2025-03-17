import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { AgenciesItem, HotelItem, initialState, TravelItem, TravelPageActionType, travelPageReducer, TravelPageState } from "./travelReducer";
import { API_URL } from "../components/config";

// Sukuriamas konteksto tipas su visomis galimomis funkcijomis
interface TravelPageContextType extends TravelPageState {
    addItem: (item: TravelItem) => Promise<void>
    removeItem: (id: string) => Promise<void>
    updateItem: (item: TravelItem) => Promise<void>
    fetchDestinations: () => Promise<void>
    fetchAgencies: () => Promise<void>
    addHotel: (hotel: HotelItem) => Promise<void>
    addAgency: (agency: AgenciesItem) => Promise<void>
}

// Sukuriamas React kontekstas
const TravelPageContext = createContext<TravelPageContextType | undefined>(undefined)

type TravelPageContextProviderProps = {
    children: React.ReactNode
}


export const TravelPageContextProvider: React.FC<TravelPageContextProviderProps> = ({ children }) => {
        // Naudojamas useReducer valdyti būseną

    const [travelPageState, dispatch] = useReducer(travelPageReducer, initialState)
   

     // Funkcija, skirta gauti kelionių, viešbučių ir agentūrų duomenis iš API
    const fetchDestinations = useCallback(async () => {
        try {
            const [destinationsRes, hotelsRes, agenciesRes] = await Promise.all([
                fetch(`${API_URL}/destinations`),
                fetch(`${API_URL}/hotels`),
                fetch(`${API_URL}/agencies`),
            ])

            if (!destinationsRes.ok || !hotelsRes.ok || !agenciesRes.ok) {
                throw new Error("Failed to fetch data")
            }

            const [destinations, hotels, agencies] = await Promise.all([
                destinationsRes.json(),
                hotelsRes.json(),
                agenciesRes.json(),
            ])
            console.log("Gauti kelionių duomenys:", destinations);
            
// Išsaugomi duomenys į būseną
            dispatch({ type: TravelPageActionType.SET_DESTINATIONS, payload: destinations })
            dispatch({ type: TravelPageActionType.ADD_HOTELS, payload: hotels })
            dispatch({ type: TravelPageActionType.ADD_AGENCY, payload: agencies })
        } catch (error) {
            console.error("Error fetching data:", error)
        }

    }, [])

     // Funkcija, skirta gauti agentūrų duomenis iš API
    const fetchAgencies = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/agencies`)
            if (!res.ok) throw new Error("Failed to fetch agencies")

            const agencies = await res.json()
            dispatch({ type: TravelPageActionType.ADD_AGENCY, payload: agencies })
        } catch (error) {
            console.error("Error fetching agencies:", error)
        }
    }, [])


// Funkcija, skirta pridėti naują kelionės vietą
    const addItem = useCallback(async (item: TravelItem) => {
        try {
            const res = await fetch(`${API_URL}/destinations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            })
            if (!res.ok) throw new Error("Failed to add destination")

            const newItem = await res.json()
            dispatch({ type: TravelPageActionType.ADD_DESTINATION, payload: newItem })
        } catch (error) {
            console.error("Error adding destination:", error)
        }
    }, [])

     // Funkcija, skirta pridėti naują viešbutį
    const addHotel = useCallback(async (hotel: HotelItem) => {
        try {
            const res = await fetch(`${API_URL}/hotels`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hotel),
            })
            if (!res.ok) throw new Error("Failed to add hotel")

            const newHotel = await res.json()
            dispatch({ type: TravelPageActionType.ADD_HOTELS, payload: newHotel })
        } catch (error) {
            console.error("Error adding hotel:", error)
        }
    }, [])

    // Funkcija, skirta pridėti naują kelionių agentūrą
    const addAgency = useCallback(async (agency: AgenciesItem) => {
        try {
            const res = await fetch(`${API_URL}/agencies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(agency),
            })
            if (!res.ok) throw new Error("Failed to add agency")

            const newAgency = await res.json()
            dispatch({ type: TravelPageActionType.ADD_AGENCY, payload: newAgency })
        } catch (error) {
            console.error("Error adding agency:", error)
        }
    }, [])

    // Funkcija, skirta pašalinti kelionės vietą pagal ID
    const removeItem = useCallback(async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/destinations/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to remove destination")

            dispatch({ type: TravelPageActionType.REMOVE_DESTINATION, payload: id })
        } catch (error) {
            console.error("Error removing destination:", error)
        }
    }, [])

  // Funkcija, skirta atnaujinti kelionės vietą
    const updateItem = useCallback(async (item: TravelItem) => {
        try {
            const res = await fetch(`${API_URL}/destinations/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            })
            if (!res.ok) throw new Error("Failed to update destination")

            dispatch({ type: TravelPageActionType.UPDATE_DESTINATION, payload: item })
        } catch (error) {
            console.error("Error updating destination:", error)
        }
    }, [])

    // Automatiškai įkelia duomenis kai komponentas užkraunamas
    useEffect(() => {
        fetchDestinations()
    }, [fetchDestinations])

   
     // Konteksto reikšmė su visomis funkcijomis
    const ctxValue: TravelPageContextType = {
        ...travelPageState,
        addItem,
        removeItem,
        updateItem,
        fetchDestinations,
        fetchAgencies,
        addHotel,
        addAgency,
        agencies: travelPageState.agencies,
    }

    return <TravelPageContext.Provider value={ctxValue}>
        {children}
    </TravelPageContext.Provider>
}


export const useTravelPageContext = () => {
    const ctx = useContext(TravelPageContext)
    if (!ctx) {
        throw new Error("useTravelPageContext must be used within a TravelPageContextProvider")
    }
    return ctx
}

