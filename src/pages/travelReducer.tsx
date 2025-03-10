export interface TravelItem {
    id: string
    title: string
    description: string
    price: number
    image: string
    category: string
}

export interface TravelPageState {
    items: TravelItem[]
}

export enum TravelPageActionType {
    ADD_ITEM = 'ADD_ITEM',
    REMOVE_ITEM = 'REMOVE_ITEM',
    UPDATE_ITEM = 'UPDATE_ITEM',
}

export type TravelPageAction = 
    | { type: TravelPageActionType.ADD_ITEM, payload: TravelItem }
    | { type: TravelPageActionType.REMOVE_ITEM, payload: string }
    | { type: TravelPageActionType.UPDATE_ITEM, payload: TravelItem }


export const initialState: TravelPageState = {
    items: []
}

export const travelPageReducer = (state: TravelPageState, action: TravelPageAction): TravelPageState => {
    switch(action.type) {
        case TravelPageActionType.ADD_ITEM:
            return {
                ...state,
                items: [...state.items, action.payload]
            }
        case TravelPageActionType.REMOVE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            }
        case TravelPageActionType.UPDATE_ITEM:
            return {
                ...state,
                items: state.items.map(item => item.id === action.payload.id ? action.payload : item)
            }
        default:
            return state
    }
}

