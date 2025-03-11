import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react"
import { initialState, TravelItem, TravelPageActionType, travelPageReducer, TravelPageState } from "./travelReducer"


interface TravelPageContextType extends TravelPageState {
    addItem: (item: TravelItem) => Promise<void> 
    removeItem: (id: string) => Promise<void>
    updateItem: (item: TravelItem) => Promise<void>
    fetchDestinations: () => Promise<void>
    travelList: { id: string }[]
    
}

const TravelPageContext = createContext<TravelPageContextType | undefined>(undefined)

type TravelPageContextProviderProps = {
    children: React.ReactNode
}

export const TravelPageContextProvider: React.FC<TravelPageContextProviderProps> = ({ children }) => {
    const [travelPageState, dispatch] = useReducer(travelPageReducer, initialState);
    

    const isFirstLoad = useRef(true)

    const fetchDestinations = useCallback(async () => {
        try{
            const res = await fetch("http://localhost:3000/destinations")
            if (res.ok) {
                const data: TravelItem[] = await res.json()
                dispatch({ type: TravelPageActionType.SET_DESTINATIONS, payload: data })
            } else {
                console.log('Failed to fetch destinations.')
            }
        } catch (error) {
            console.log('Error fetching destinations:', error)
        }
    }, [])
    
    const addItem = useCallback(async (item: TravelItem) => {
        try {
            const res = await fetch("http://localhost:3000/destinations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });
            if (res.ok) {
                const newItem = await res.json();
                dispatch({ type: TravelPageActionType.ADD_DESTINATION, payload: newItem });
            } else {
                console.log('Failed to add destination')
            }
        } catch (error) {
            console.log('Error adding destination:', error)
        }
    }, [])

    const removeItem = useCallback(async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3000/destinations/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                dispatch({ type: TravelPageActionType.REMOVE_DESTINATION, payload: id });
            } else {
                console.log('Failed to remove destination')
            }
        } catch (error) {
            console.log('Error removing destination:', error)
        }
    }, [])

    const updateItem = useCallback(async (item: TravelItem) => {
        try {
            const res = await fetch(`http://localhost:3000/destinations/${item.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });
            if (res.ok) {
                dispatch({ type: TravelPageActionType.UPDATE_DESTINATION, payload: item });
            } else {
                console.log('Failed to update destination')
            }
        } catch (error) {
            console.log('Error updating destination:', error)
        }
    }, [])

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            console.log("Loading destinations...");
            fetchDestinations(); // Fetch destinations on the first load
        }
    }, [fetchDestinations]);
            
    const ctxValue: TravelPageContextType = {
        addItem,
        removeItem,
        updateItem,
        fetchDestinations,
        ...travelPageState,
        travelList: travelPageState.trips
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
