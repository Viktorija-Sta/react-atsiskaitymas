import { createContext, useContext, useReducer } from "react"

interface TravelPageContextType extends TravelPageState {
    addItem: (item: TravelItem) => void
}
const TravelPageContext = createContext<TravelPageContextType | undefined>(undefined)

type TravelPageContextProviderProps = {
    children: React.ReactNode
}

export const TravelPageContextProvider: React.FC<TravelPageContextProviderProps> = ({ children }) => {
    const [travelPageState, dispatch] = useReducer(travelPageReducer, initialState)

    const addItem = (item: TravelItem) => dispatch({ type: 'ADD_ITEM', payload: item )
    

    return (
        <TravelPageContext.Provider value={ctxValue}>
            {children}
        </TravelPageContext.Provider>
    )
}

const ctxValue: TravelPageContextType = {
    addItem
}

export const useTravelPageContext = () => {
    const ctx = useContext(TravelPageContext)
    if (!ctx) {
        throw new Error('useTravelPageContext must be used within a TravelPageContextProvider')
    }
    return ctx
}