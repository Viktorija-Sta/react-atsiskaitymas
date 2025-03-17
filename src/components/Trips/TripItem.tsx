import React, { useState, useEffect } from "react";
import { TravelItem } from "../../pages/travelReducer";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";
import './trip.scss'
import { Button } from "@mui/material";

interface TripItemProps {
    data: TravelItem
}

const TripItem: React.FC<TripItemProps> = ({ data }) => {
    // Gauname kontekstą su funkcijomis ir agentūrų duomenimis
    const { removeItem, agencies, fetchAgencies } = useTravelPageContext()
    const { id, title, description, price, image, agencyId } = data

    const [agencyData, setAgencyData] = useState<{ id: string; name: string } | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    console.log("Kelionės duomenys:", data)
    console.log("Kelionės agentūros ID:", agencyId)
    console.log("Turimos agentūros:", agencies)

    // Jeigu agentūrų duomenys dar neužkrauti, iškviečiame jų gavimą
    useEffect(() => {
        if (!agencies || agencies.length === 0) {
            fetchAgencies()
        }
    }, [agencies, fetchAgencies])

    // Kai pasikeičia agentūrų sąrašas arba agentūros ID, ieškome atitinkamos agentūros
    useEffect(() => {
        if (agencyId && agencies.length > 0) {
            const foundAgency = agencies.find(agency => agency.id === agencyId)
            setAgencyData(foundAgency || null)
        }
    }, [agencies, agencyId])
    

    console.log("Rasta agentūra:", agencyData)

     // Funkcija kelionei pašalinti su patvirtinimu
    const deleteHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (!window.confirm("Ar tikrai norite pašalinti šią kelionę?")) return

        setIsDeleting(true)

        try {
            await removeItem(id)

        } catch (error) {
            console.error("Klaida šalinant kelionę:", error)

        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="trip-item">
            <h3>{title}</h3>

            <img src={image} alt={title}  />
            <p>{description}</p>
            <p>Kaina: {price}€</p>

            {agencyData ? (
                <p>Organizatorius: {agencyData.name}</p>
            ) : (
                <p>Organizatorius: Nežinomas</p>
            )}

            <Button 
                variant="contained"
                onClick={deleteHandler}
                disabled={isDeleting}
                className={isDeleting ? "disabled-button" : ""}
            >
                {isDeleting ? "Šalinama..." : "Šalinti"}
            </Button>
        </div>
    )
}

export default TripItem
