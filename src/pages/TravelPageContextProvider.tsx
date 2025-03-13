import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { AgenciesItem, HotelItem, initialState, TravelItem, TravelPageActionType, travelPageReducer, TravelPageState } from "./travelReducer";
import { API_URL } from "../components/config";

interface TravelPageContextType extends TravelPageState {
    addItem: (item: TravelItem) => Promise<void>
    removeItem: (id: string) => Promise<void>
    updateItem: (item: TravelItem) => Promise<void>
    fetchDestinations: () => Promise<void>
    fetchAgencies: () => Promise<void>
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
                fetch(`${API_URL}/hotels`),
            ])

            if (!destinationsRes.ok || !hotelsRes.ok) {
                throw new Error("Failed to fetch data")
            }

            const [destinations, hotels] = await Promise.all([
                destinationsRes.json(),
                hotelsRes.json(),
            ])

            console.log("Gauti kelionių duomenys:", destinations)

            dispatch({ type: TravelPageActionType.SET_DESTINATIONS, payload: destinations })
            dispatch({ type: TravelPageActionType.ADD_HOTELS, payload: hotels })
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }, [dispatch])

    const fetchAgencies = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/agencies`)
            if (!res.ok) throw new Error("Failed to fetch agencies")

            const agencies = await res.json()
            dispatch({ type: TravelPageActionType.ADD_AGENCY, payload: agencies })
        } catch (error) {
            console.error("Error fetching agencies:", error)
        }
    }, [dispatch])

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
    }, [dispatch])

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
    }, [dispatch])

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
    }, [dispatch])

    const removeItem = useCallback(async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/destinations/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to remove destination")

            dispatch({ type: TravelPageActionType.REMOVE_DESTINATION, payload: id })
        } catch (error) {
            console.error("Error removing destination:", error)
        }
    }, [dispatch])

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
    }, [dispatch])

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false
            fetchDestinations()
            fetchAgencies()
        }
    }, [fetchDestinations, fetchAgencies])

    const ctxValue: TravelPageContextType = {
        ...travelPageState,
        addItem,
        removeItem,
        updateItem,
        fetchDestinations,
        fetchAgencies,
        addHotel,
        addAgency,
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
        throw new Error("useTravelPageContext must be used within a TravelPageContextProvider")
    }
    return ctx
}
