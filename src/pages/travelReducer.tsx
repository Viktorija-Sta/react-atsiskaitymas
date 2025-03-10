export interface TravelItem {
    id: string
    title: string
    description: string
    price: number
    image: string
    category: string
}

export interface TravelPageState {
    trips: TravelItem[]
}

export enum TravelPageActionType {
    ADD_DESTINATION = 'addDestination',
    REMOVE_DESTINATION = 'removeDestination',
    UPDATE_DESTINATION = 'updateDestination',
}

export type TravelPageAction = 
    | { type: TravelPageActionType.ADD_DESTINATION, payload: TravelItem }
    | { type: TravelPageActionType.REMOVE_DESTINATION, payload: string }
    | { type: TravelPageActionType.UPDATE_DESTINATION, payload: TravelItem }


export const initialState: TravelPageState = {
    trips: []
}

export const travelPageReducer = (state: TravelPageState, action: TravelPageAction): TravelPageState => {
    switch(action.type) {
        case TravelPageActionType.ADD_DESTINATION:
            return {
                ...state,
                trips: [...state.trips, action.payload]
            }
        case TravelPageActionType.REMOVE_DESTINATION:
            return {
                ...state,
                trips: state.trips.filter(trip => trip.id !== action.payload)
            }
        case TravelPageActionType.UPDATE_DESTINATION:
            return {
                ...state,
                trips: state.trips.map(trip => trip.id === action.payload.id ? action.payload : trip)
            }
        default:
            return state
    }
}