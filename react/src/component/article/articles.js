import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Typography,
    Card, CardMedia, CardContent, CardActions
} from "@mui/material";

import axios from "axios";
import DisplayArticle from "./displayArticle";


function Articles() {

    document.title = 'Tous les articles';

    const [data, setData] = useState(null); // array of data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // WIP
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});



    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/articles/sortDate').then((actualData) => {
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
        <Typography variant="h3" sx={{textAlign: "center"}} gutterBottom>Tous les articles</Typography>
        {loading ? (
            <Typography variant="h5" sx={{textAlign: "center"}} gutterBottom>Chargement des article...</Typography>
        ) : (
            <Box sx={{ maxWidth: '90%' }}>
                {data.map(({id, name_article, content_article, image, category, place , created_at}) => {
                    return (
                        <Card sx={{ maxWidth: 365 , display: 'inline-block' , margin: 3 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image= {`http://127.0.0.1:8000/storage/uploads/articles/${image}`}
                                alt={image}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {name_article.slice(0,30)}
                                </Typography>
                                <Typography variant="body2">
                                    {content_article.slice(0,70)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Categorie: {category.name_category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Lieu :{place.name_place}
                                </Typography>
                            </CardContent>
                            <Box>
                                <CardActions>
                                    <Box sx={{display: 'flex', justifyContent: 'right'}}>
                                        <DisplayArticle DisplayArticleValue={{id, name_article, content_article, image, category,place,created_at, data}} handleDataChange={handleDataChange} />
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

export default Articles;