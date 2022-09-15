import {
    Box,
    Button,
    Modal,
    Typography,
    Grid,
} from "@mui/material";
import {Loupe} from "@mui/icons-material";
import React, {useEffect, useState} from "react";

import {useNavigate, useParams} from "react-router";





function DisplayArticle(article) {

    const { id } = useParams();
    const [oneArticle, setOneArticle] = useState([]);
    const [name_article, setName] = useState(article.DisplayArticleValue.name_article);
    const [content_article, setContentArticle] = useState(article.DisplayArticleValue.content_article);
    const [image, setImage] = useState(article.DisplayArticleValue.image);
    const [category, setCategory] = useState(article.DisplayArticleValue.category);
    const [created_at, setCreated] = useState(article.DisplayArticleValue.created_at)
    const [place, setPlace] = useState(article.DisplayArticleValue.place);
    const [DisplayArticle, setShowDisplay] = useState(false);


    return(<Box>
            <Box>
                <Button  variant='contained' sx={{mx: 2}}
                         onClick={() => {
                             setShowDisplay(true)
                             setOneArticle({
                                 id: article.DisplayArticleValue.id,
                                 name_article: article.DisplayArticleValue.name_article,
                                 description_article: article.DisplayArticleValue.description_article,
                                 image: article.DisplayArticleValue.image,
                                 created_at: article.DisplayArticleValue.created_at,
                                 category: article.DisplayArticleValue.category,
                                 place: article.DisplayArticleValue.place

                             })
                         }}>
                    <Loupe/> Voir details
                </Button>
                <Modal
                    id="modal-crud-container"
                    hideBackdrop
                    open={DisplayArticle}
                    onClose={() => setShowDisplay(false)}
                    aria-labelledby="edit-article-title"
                    aria-describedby="child-modal-description"
                >
                    <Box className="modal-crud modal-crud-article" sx={{bgcolor: 'background.default'}}>
                        <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="edit-article-title">{name_article}</Typography>
                        <Box component="img" src={`http://127.0.0.1:8000/storage/uploads/articles/${image}`} alt={image} sx={{ width: "300px" }}/>
                        <Box sx={{ marginTop: 3 }}>
                            {content_article}
                        </Box>
                        <Box sx={{ marginTop: 3 }}>
                            Categorie : {category.name_category}
                        </Box>
                        <Box sx={{ marginTop: 3 }}>
                             Lieu: {place.name_place}
                        </Box>
                        <Box sx={{ marginTop: 3 }}>
                            Publié le: {created_at.slice(0,10)}
                        </Box>
                        <Grid item xs={12} className="action-button" sx={{ minwidth: '100%' }}>
                            <Button variant="outlined" onClick={() => setShowDisplay(false)}>Fermer</Button>
                        </Grid>
                    </Box>

                </Modal>
            </Box>
        </Box>
    )
}
export default DisplayArticle;