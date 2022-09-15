import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Typography,
    Card, CardMedia, CardContent, CardActions
} from "@mui/material";

import axios from "axios";
import DisplayEvent from "./displayEvent";


function Events() {

    document.title = 'Tous les évenements';

    const [data, setData] = useState(null); // array of data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // WIP
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});



    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/events').then((actualData) => {
            actualData = actualData.data;
            setLoading(true)
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
        <Typography variant="h3" sx={{textAlign: "center"}} gutterBottom>Tous les articles</Typography>
        {loading ? (
            <Typography variant="h5" sx={{textAlign: "center"}} gutterBottom>Chargement des article...</Typography>
        ) : (
            <Box sx={{ maxWidth: '90%' }}>
                {data.map(({id, name_event, description_event, date_start, date_end , place }) => {
                    return (
                        <Card sx={{ maxWidth: 365 , display: 'inline-block' , margin: 3 }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {name_event.slice(0,30)}
                                </Typography>
                                <Typography variant="body2">
                                    {description_event.slice(0,70)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Date de début: {date_start.slice(0,10)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Date de fin: {date_end.slice(0,10)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Lieu :{place.name_place}
                                </Typography>
                            </CardContent>
                            <Box>
                                <CardActions>
                                    <Box sx={{display: 'flex', justifyContent: 'right'}}>
                                        <DisplayEvent DisplayEventValue={{id, name_event, description_event, date_start, date_end ,place, data}} handleDataChange={handleDataChange} />
                                    </Box>
                                </CardActions>
                            </Box>
                        </Card>

                    )
                })}
            </Box>
        )}


    </Container>
}

export default Events;