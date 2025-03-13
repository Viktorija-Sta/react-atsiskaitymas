import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { API_URL } from "../config";

const EditAgencyInformation: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [editedAgency, setEditedAgency] = useState({ 
        name: '',
        location: '',
        contacts: [{ email: '', phone: '' }]
    });

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                const agencyRes = await fetch(`${API_URL}/agencies/${id}`);
                const agencyData = await agencyRes.json();

                console.log("Agentūros duomenys:", agencyData);

                setEditedAgency({
                    name: agencyData.name || '',
                    location: agencyData.location || '',
                    contacts: agencyData.contacts?.length > 0 
                    ? agencyData.contacts 
                    : [{ email: '', phone: '' }]
                });

            } catch (error) {
                console.error("Klaida gaunant agentūros duomenis:", error);
            }
        };

        fetchAgencyData();
    }, [id]);

    const contactChangeHandler = (index: number, field: "email" | "phone", value: string) => {
        setEditedAgency((prev) => {
            const updatedContacts = [...prev.contacts];
            updatedContacts[index] = { ...updatedContacts[index], [field]: value };
            return { ...prev, contacts: updatedContacts };
        });
    };

    const saveChanges = async () => {
        try {
            await fetch(`${API_URL}/agencies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedAgency),
            });

            navigate(`/agency/${id}`)
        } catch (error) {
            console.error("Klaida išsaugant agentūros duomenis:", error);
        }
    };


    return (
        <div className="edit-agency">
        <h2>Redaguoti agentūros informaciją</h2>

        <div className="form">
            <label>
                Pavadinimas:
                <input
                    type="text"
                    value={editedAgency.name}
                    onChange={(e) => setEditedAgency((prev) => ({ ...prev, name: e.target.value }))}
                />
            </label>

            <label>
                Lokacija:
                <input
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
                        <input
                            type="email"
                            value={contact.email}
                            onChange={(e) => contactChangeHandler(index, "email", e.target.value)}
                        />
                    </label>

                    <label>
                        Telefonas:
                        <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => contactChangeHandler(index, "phone", e.target.value)}
                        />
                    </label>
                </div>
            ))}

            <button onClick={saveChanges}>Išsaugoti</button>
        </div>
    </div>
    );
};

export default EditAgencyInformation;
