import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react"
import { initialState, TravelItem, TravelPageActionType, travelPageReducer, TravelPageState } from "./travelReducer"


interface TravelPageContextType extends TravelPageState {
    addItem: (item: TravelItem) => Promise<void> 
    removeItem: (id: string) => Promise<void>
    updateItem: (item: TravelItem) => Promise<void>
    fetchDestinations: () => Promise<void>
    
}

const TravelPageContext = createContext<TravelPageContextType | undefined>(undefined)

type TravelPageContextProviderProps = {
    children: React.ReactNode
}

export const TravelPageContextProvider: React.FC<TravelPageContextProviderProps> = ({ children }) => {
    const [travelPageState, dispatch] = useReducer(travelPageReducer, initialState);
    

    const isFirstLoad = useRef(true)

    const fetchDestinations = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:3000/destinations")
            if (!res.ok) throw new Error("Failed to fetch destinations")
            
            const data: TravelItem[] = await res.json()
            dispatch({ type: TravelPageActionType.SET_DESTINATIONS, payload: data })
        } catch (error) {
            console.error("Error fetching destinations:", error)
        }
    }, [])
    
    const addItem = useCallback(async (item: TravelItem) => {
        try {
            const res = await fetch("http://localhost:3000/destinations", {
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


    const removeItem = useCallback(async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3000/destinations/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to remove destination")

            dispatch({ type: TravelPageActionType.REMOVE_DESTINATION, payload: id })
        } catch (error) {
            console.error("Error removing destination:", error)
        }
    }, [])

    const updateItem = useCallback(async (item: TravelItem) => {
        try {
            const res = await fetch(`http://localhost:3000/destinations/${item.id}`, {
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
            console.log("Loading destinations...");
            fetchDestinations()
        }
    }, [fetchDestinations])
            
    const ctxValue: TravelPageContextType = {
        addItem,
        removeItem,
        updateItem,
        fetchDestinations,
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
