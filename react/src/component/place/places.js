import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Typography,
    Card, CardMedia, CardContent, CardActions
} from "@mui/material";

import axios from "axios";
import DisplayPlace from "./displayPlace";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';



function Places() {

    document.title = 'Tous les lieux';

    const [data, setData] = useState(null); // array of data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // WIP
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});



    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/places').then((actualData) => {
            actualData = actualData.data;
            setLoading(true)
            console.log(actualData)
            setData(actualData.data);
            setError(null);
        }).catch((err) => {
            setError(err.message);
            setData(null);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleDataChange = async (dataChange) => {
        await setData(dataChange)
    }

    return <Container maxWidth="xl" id="place">
            <Typography variant="h3" sx={{textAlign: "center"}} gutterBottom>Tous les lieux</Typography>
            {loading ? (
                <Typography variant="h5" sx={{textAlign: "center"}} gutterBottom>Chargement des lieux...</Typography>
            ) : (
                <Box sx={{ maxWidth: '90%' }}>
                                {data.map(({id, name_place, description_place, image, type, address}) => {
                                    return (

                                        <Card sx={{ maxWidth: 500 , display: 'inline-block' , margin: 3 }}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image= {`http://127.0.0.1:8000/storage/uploads/places/${image}`}
                                                alt={image}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {name_place}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {description_place.slice(0,30)}
                                                </Typography>
                                            </CardContent>
                                            <Box>
                                                <CardActions>
                                                    <Box sx={{display: 'flex', justifyContent: 'right'}}>
                                                        <DisplayPlace DisplayPlaceValue={{id, name_place, description_place, image, type, address, data}} handleDataChange={handleDataChange} />
                                                    </Box>
                                                </CardActions>
                                                <MapContainer center={[address.latitude, address.longitude]} zoom={16} scrollWheelZoom={true}>
                                                    <TileLayer
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                    <Marker position={[address.latitude, address.longitude]}>
                                                        <Popup>
                                                            {name_place}
                                                            {address.address}
                                                        </Popup>
                                                    </Marker>

                                                </MapContainer>
                                            </Box>
                                        </Card>

                                    )
                                })}
                </Box>
            )}


    </Container>
}

export default Places;