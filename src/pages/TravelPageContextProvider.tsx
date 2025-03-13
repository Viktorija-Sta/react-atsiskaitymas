import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react"
import { AgenciesItem, HotelItem, initialState, TravelItem, TravelPageActionType, travelPageReducer, TravelPageState } from "./travelReducer"
import { API_URL } from "../components/config"


interface TravelPageContextType extends TravelPageState {
    addItem: (item: TravelItem) => Promise<void> 
    removeItem: (id: string) => Promise<void>
    updateItem: (item: TravelItem) => Promise<void>
    fetchDestinations: () => Promise<void>
    addHotel: (hotel: HotelItem) => Promise<void>
    addAgency: (agency: AgenciesItem) => Promise<void>

}

const TravelPageContext = createContext<TravelPageContextType | undefined>(undefined)

type TravelPageContextProviderProps = {
    children: React.ReactNode
}

export const TravelPageContextProvider: React.FC<TravelPageContextProviderProps> = ({ children }) => {
    const [travelPageState, dispatch] = useReducer(travelPageReducer, initialState)
    const isFirstLoad = useRef(true)

    const fetchDestinations = useCallback(async () => {
    try {
        const [destinationsRes, hotelsRes] = await Promise.all([
            fetch(`${API_URL}/destinations`),
            fetch(`${API_URL}/hotels`)
        ])

        if (!destinationsRes.ok || !hotelsRes.ok) throw new Error("Failed to fetch data")

        const destinations = await destinationsRes.json()
        const hotels: HotelItem[] = await hotelsRes.json()

        if (!Array.isArray(destinations) || !Array.isArray(hotels)) {
            throw new Error("Invalid API response format")
        }

        dispatch({ type: TravelPageActionType.SET_DESTINATIONS, payload: destinations })
        dispatch({ type: TravelPageActionType.ADD_HOTELS, payload: hotels })
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}, [])

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

    const addHotel = useCallback(async (hotel: HotelItem) => {
        try {
            const res = await fetch(`${API_URL}/hotels`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hotel),
            })
            if (!res.ok) throw new Error("Failed to add hotel")
    
            const newHotel = await res.json()
            console.log("Adding hotel:", newHotel)
            dispatch({ type: TravelPageActionType.ADD_HOTELS, payload: [newHotel] })
            console.log("Updated hotels state:", travelPageState.hotels)
        } catch (error) {
            console.error("Error adding hotel:", error)
        }
    }, [])
    
    const addAgency = useCallback(async (agency: AgenciesItem) => {
        try {
            const res = await fetch(`${API_URL}/agencies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(agency),
            })
            if (!res.ok) throw new Error("Failed to add agency")
    
            const newAgency = await res.json()
            console.log("Adding agency:", newAgency)
            dispatch({ type: TravelPageActionType.ADD_HOTELS, payload: [newAgency] })
            console.log("Updated hotels state:", travelPageState.agencies)
        } catch (error) {
            console.error("Error adding hotel:", error)
        }
    }, [])


    const removeItem = useCallback(async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/destinations${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to remove destination")
    
            dispatch({ type: TravelPageActionType.REMOVE_DESTINATION, payload: id })
        } catch (error) {
            console.error("Error removing destination:", error)
        }
    }, [])
    

    const updateItem = useCallback(async (item: TravelItem) => {
        try {
            const res = await fetch(`${API_URL}/destinations${item.id}`, {
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

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            console.log("Loading destinations...")
            fetchDestinations()
        }
    }, [fetchDestinations])
            
    const ctxValue: TravelPageContextType = {
        addItem,
        removeItem,
        updateItem,
        fetchDestinations,
        addHotel,
        addAgency,
        ...travelPageState,
    }
  
    return (
        <TravelPageContext.Provider value={ctxValue}>
            {children}
        </TravelPageContext.Provider>
    )
}

export const useTravelPageContext = () => {
    const ctx = useContext(TravelPageContext)
    if (!ctx) {
        throw new Error('useTravelPageContext must be used within a TravelPageContextProvider')
    }
    return ctx
}
