import React, { useState, useEffect } from "react";
import { TravelItem } from "../../pages/travelReducer";
import { useTravelPageContext } from "../../pages/TravelPageContextProvider";

interface TripItemProps {
    data: TravelItem;
}

const TripItem: React.FC<TripItemProps> = ({ data }) => {
    const { removeItem, agencies, fetchAgencies } = useTravelPageContext();
    const { id, title, description, price, image, agencyId } = data;

    const [agencyData, setAgencyData] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    console.log("Kelionės duomenys:", data);
    console.log("Kelionės agentūros ID:", agencyId);
    console.log("Turimos agentūros:", agencies);

    useEffect(() => {
        if (!agencies || agencies.length === 0) {
            fetchAgencies();
        }
    }, [agencies, fetchAgencies]);

    useEffect(() => {
        if (agencies && agencyId) {
            const foundAgency = agencies.find((agencyItem) => Number(agencyItem.id) === Number(agencyId));
            setAgencyData(foundAgency || null);
        }
    }, [agencies, agencyId]);

    console.log("Rasta agentūra:", agencyData);

    const deleteHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!window.confirm("Ar tikrai norite pašalinti šią kelionę?")) return;

        setIsDeleting(true);

        try {
            await removeItem(id);
        } catch (error) {
            console.error("Klaida šalinant kelionę:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="trip-item">
            <h3>{title}</h3>
            <img src={image} alt={title} width={500} />
            <p>{description}</p>
            <p>Kaina: {price}€</p>
            {agencyData ? (
                <p>Organizatorius: {agencyData.name}</p>
            ) : (
                <p>Organizatorius: Nežinomas</p>
            )}

            <button
                onClick={deleteHandler}
                disabled={isDeleting}
                className={isDeleting ? "disabled-button" : ""}
            >
                {isDeleting ? "Šalinama..." : "Šalinti"}
            </button>
        </div>
    );
};

export default TripItem;
