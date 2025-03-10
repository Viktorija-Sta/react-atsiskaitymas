import { createContext, useContext, useEffect, useReducer } from "react"
import { initialState, TravelItem, TravelPageActionType, travelPageReducer, TravelPageState } from "./travelReducer"

interface TravelPageContextType extends TravelPageState {
    addItem: (item: TravelItem) => void
    removeItem: (id: string) => void
    updateItem: (item: TravelItem) => void
}
const TravelPageContext = createContext<TravelPageContextType | undefined>(undefined)

type TravelPageContextProviderProps = {
    children: React.ReactNode
}

export const TravelPageContextProvider: React.FC<TravelPageContextProviderProps> = ({ children }) => {
    const [travelPageState, dispatch] = useReducer(travelPageReducer, initialState)

    const addItem = (item: TravelItem) => dispatch({ type: TravelPageActionType.ADD_ITEM, payload: item })
    const removeItem = (id: string) => dispatch({ type: TravelPageActionType.REMOVE_ITEM, payload: id })
    const updateItem = (item: TravelItem) => dispatch({ type: TravelPageActionType.UPDATE_ITEM, payload: item })
    
    useEffect(() => {
        try{

       
        fetch("http://localhost:3000/destinations")
        .then((res) => res.json())
        .then((data: TravelItem[]) => {
            data.forEach((item) => addItem(item))
        })
        } catch (error) {
            console.error('Kalida gaunant duomenis:', error)
        }
    }, [])

    const ctxValue: TravelPageContextType = {
        addItem,
        removeItem,
        updateItem,
        ...travelPageState
       
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