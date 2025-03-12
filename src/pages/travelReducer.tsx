export interface TravelItem {
    id: string
    title: string
    description: string
    price: number
    image: string
    category: string
    duration: string
    fullDescription: string
    gallery: string[]
}

export interface HotelItem {
    id: string
    destinationsId: string
    name: string
    price: number
}

export interface TravelPageState {
    trips: TravelItem[]
    hotels: HotelItem[] 
}

export enum TravelPageActionType {
    ADD_DESTINATION = 'addDestination',
    REMOVE_DESTINATION = 'removeDestination',
    UPDATE_DESTINATION = 'updateDestination',
    SET_DESTINATIONS = 'setDestinations',
    ADD_HOTELS = 'addHotel',
}

export type TravelPageAction = 
    | { type: TravelPageActionType.ADD_DESTINATION, payload: TravelItem }
    | { type: TravelPageActionType.REMOVE_DESTINATION, payload: string }
    | { type: TravelPageActionType.UPDATE_DESTINATION, payload: TravelItem }
    | { type: TravelPageActionType.SET_DESTINATIONS, payload: TravelItem[] }
    | { type: TravelPageActionType.ADD_HOTELS; payload: HotelItem[] }


export const initialState: TravelPageState = {
    trips: [],
    hotels: []
}

export const travelPageReducer = (state: TravelPageState, action: TravelPageAction): TravelPageState => {
    switch(action.type) {
        case TravelPageActionType.ADD_DESTINATION:
            return {
                ...state,
                trips: [...state.trips, action.payload]
            }
            case TravelPageActionType.ADD_HOTELS:
                return {
                    ...state,
                    hotels: [...state.hotels, ...action.payload],
                }
        case TravelPageActionType.REMOVE_DESTINATION:
            return {
                ...state,
                trips: state.trips.filter(item => item.id !== action.payload),
                hotels: state.hotels.filter(hotel => hotel.destinationsId !== action.payload) 
          
            }
        case TravelPageActionType.UPDATE_DESTINATION:
            return {
                ...state,
                trips: state.trips.map(trip => trip.id === action.payload.id ? action.payload : trip)
           
            }

        case TravelPageActionType.SET_DESTINATIONS:
            return {
                ...state,
                trips: action.payload,
            }
        default:
            return state
    }
}