export interface TravelItem {
    id: string
    title: string
    description: string
    price: number
    image: string
    category: string
    duration: string
    fullDescription: string
    gallery: string[], 
    agencyId: string
}

export interface HotelItem {
    id: string
    destinationsId: string
    name: string
    price: number
}

export interface AgenciesItem {
    id: string
    name: string
    location: string
    contacts:[
        {
            email: string
            phone: string
        }
    ]
}

export interface TravelPageState {
    trips: TravelItem[]
    hotels: HotelItem[] 
    agencies: AgenciesItem[]
}

export enum TravelPageActionType {
    ADD_DESTINATION = 'addDestination',
    REMOVE_DESTINATION = 'removeDestination',
    UPDATE_DESTINATION = 'updateDestination',
    SET_DESTINATIONS = 'setDestinations',
    ADD_HOTELS = 'addHotel',
    ADD_AGENCY= 'addAgency'
}

export type TravelPageAction = 
    | { type: TravelPageActionType.ADD_DESTINATION, payload: TravelItem }
    | { type: TravelPageActionType.REMOVE_DESTINATION, payload: string }
    | { type: TravelPageActionType.UPDATE_DESTINATION, payload: TravelItem }
    | { type: TravelPageActionType.SET_DESTINATIONS, payload: TravelItem[] }
    | { type: TravelPageActionType.ADD_HOTELS, payload: HotelItem[] }
    | {type: TravelPageActionType.ADD_AGENCY, payload: AgenciesItem[]}


export const initialState: TravelPageState = {
    trips: [],
    hotels: [],
    agencies: [],
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

        case TravelPageActionType.ADD_AGENCY:
            return {
                 ...state,
                agencies: [...state.agencies, ...action.payload],
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