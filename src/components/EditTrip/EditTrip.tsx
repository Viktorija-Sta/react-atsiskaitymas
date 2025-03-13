// import { useState } from "react";
// import { TravelItem } from "../../pages/travelReducer";
// import "./EditTrip.css"

// interface EditTripProps {
//     trip : TravelItem
//     onClose: () => void
//     onSave: (updatedTrip: TravelItem) => void
// } 

// const EditTrip: React.FC<EditTripProps> = ({ trip, onClose, onSave }) => {
//     const [editedTrip, setEditedTrip] = useState<TravelItem>({ ...trip })

//     const changeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = event.target
//         setEditedTrip((prev) => ({
//             ...prev,
//             [name]: name === 'price' ? parseFloat(value) : value
//         }))

//     }
    
//     const saveHandler = () => {
//         onSave(editedTrip)
//         onClose()
//     }

//     return (
//         <div className="modal">
//             <div className="modal-content">
//                 <h2>Redaguoti kelionę</h2>
//                 <label>
//                     Pavadinimas:
//                     <input type="text" name="title" value={editedTrip.title} onChange={changeHandler} />
//                 </label>
//                 <label>
//                     Aprašymas:
//                     <textarea name="description" value={editedTrip.description} onChange={changeHandler} />
//                 </label>
//                 <label>
//                     Kaina (€):
//                     <input type="number" name="price" value={editedTrip.price} onChange={changeHandler} />
//                 </label>
//                 <label>
//                     Nuotraukos URL:
//                     <input type="text" name="image" value={editedTrip.image} onChange={changeHandler} />
//                 </label>
//                 <div className="modal-actions">
//                     <button onClick={saveHandler}>Išsaugoti</button>
//                     <button onClick={onClose}>Atšaukti</button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default EditTrip