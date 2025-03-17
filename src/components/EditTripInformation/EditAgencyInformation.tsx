import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { API_URL } from "../config";
import './editAgencyInformation.scss'
import { Button, TextField } from "@mui/material";

const EditAgencyInformation: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [editedAgency, setEditedAgency] = useState({ 
        name: '',
        location: '',
        contacts: [{ email: '', phone: '' }]
    })

    // Užkrauna agentūros duomenis pagal ID
    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                const agencyRes = await fetch(`${API_URL}/agencies/${id}`)
                const agencyData = await agencyRes.json()

                console.log("Agentūros duomenys:", agencyData)

                setEditedAgency({
                    name: agencyData.name || '',
                    location: agencyData.location || '',
                    contacts: agencyData.contacts?.length > 0 
                    ? agencyData.contacts 
                    : [{ email: '', phone: '' }]
                })

            } catch (error) {
                console.error("Klaida gaunant agentūros duomenis:", error)
            }
        }

        fetchAgencyData()
    }, [id])

    // Tvarko kontaktinių duomenų pakeitimus
    const contactChangeHandler = (index: number, field: "email" | "phone", value: string) => {
        setEditedAgency((prev) => {
            const updatedContacts = [...prev.contacts]
            updatedContacts[index] = { ...updatedContacts[index], [field]: value }
            return { ...prev, contacts: updatedContacts }
        })
    }

    // Išsaugo pakeistus duomenis į serverį
    const saveChanges = async () => {
        try {
            await fetch(`${API_URL}/agencies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedAgency),
            })

            // Nukreipia vartotoją atgal į agentūros puslapį
            navigate(`/agency/${id}`)
            
        } catch (error) {
            console.error("Klaida išsaugant agentūros duomenis:", error)
        }
    }


    return (
        <div className="edit-agency">
            <h2>Redaguoti agentūros informaciją</h2>

            <div className="form">
                <label>
                    Pavadinimas:
                    <TextField 
                        id="standard-basic"
                        type="text"
                        value={editedAgency.name}
                        onChange={(e) => setEditedAgency((prev) => ({ ...prev, name: e.target.value }))}
                    />
                </label>

                <label>
                    Lokacija:
                    <TextField
                        id="standard-basic"
                        type="text"
                        value={editedAgency.location}
                        onChange={(e) => setEditedAgency((prev) => ({ ...prev, location: e.target.value }))}
                    />
                </label>

                <h3>Kontaktai:</h3>
                {editedAgency.contacts.map((contact, index) => (
                    <div key={index}>
                        <label>
                            El. paštas:
                            <TextField 
                                id="standard-basic"
                                type="email"
                                value={contact.email}
                                onChange={(e) => contactChangeHandler(index, "email", e.target.value)}
                            />
                        </label>

                        <label>
                            Telefonas:
                            <TextField 
                                id="standard-basic"
                                type="tel"
                                value={contact.phone}
                                onChange={(e) => contactChangeHandler(index, "phone", e.target.value)}
                            />
                        </label>
                    </div>
                ))}

                <Button variant="contained" onClick={saveChanges}>Išsaugoti</Button>
            </div>
        </div>
    )
}

export default EditAgencyInformation
