import {
    Box,
    Button,
    FormControl,
    Modal,
    Snackbar,
    TextField,
    Typography,
    Alert,
    Input,
    Grid,
    Select, MenuItem, InputLabel
} from "@mui/material";
import {useEffect, useState} from "react";
import update from "immutability-helper";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

function NewArticle(props) {

    const [id, setID] = useState("");
    const [name_article, setName] = useState("");
    const [content_article, setContentArticle] = useState("");
    const [image, setImage] = useState("");

    const [category, setCategory] = useState({});
    const [place, setPlace] = useState({});

    const [categories, setCategories] = useState({});
    const [places, setPlaces] = useState({});

    const [newArticle, setShowNew] = useState(false);

    // Handle Toast Article
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});
    const { register, control, handleSubmit, formState: { errors } } = useForm({defaultValues: {
            name_article: '',
            content_article: '',
            image: '',
            category: {},
            place: {},
        }});


    useEffect( () => {
        getAlls()
    }, [])

    let reset = () => {
        setName('');
        setContentArticle('');
        setImage('');
        setCategory({});
        setPlace({});
    }

    let getAlls = async () => {
        await axios.get("http://127.0.0.1:8000/api/categories/").then((actualData) => { setCategories(actualData.data.data) });
        await axios.get("http://127.0.0.1:8000/api/places/").then((actualData) => { setPlaces(actualData.data.data) });
    }

    let newArticleForm = async () => {
        try {

            let formData = new FormData();

            formData.append("name_article", name_article);
            formData.append("content_article", content_article);
            formData.append("image", image);
            formData.append("category", `${category}`);
            formData.append("place", `${place}`);

            let newArticle = {
                name_article: name_article,
                content_article: content_article,
                image: image,
                category: category,
                place: place
            };

            let res = await axios.post('http://127.0.0.1:8000/api/articles/', formData, {
                "headers" : { "Authorization":"Bearer"+localStorage.getItem('access_token') }
            });
            if (res.status === 200) {
                let tab = {};
                await Object.assign(tab, res.data.data);
                let data = update(props.newValue.data, {$push: [{
                        id : tab.id,
                        name_article: tab.name_article,
                        content_article: tab.content_article,
                        image: tab.image,
                        category: tab.category,
                        place: tab.place
                }]})
                props.handleDataChange(data);
                reset();
                setToastMessage({message: "Article ajouté ! Vous pouvez en ajouter un autre", severity: "success"});
                setShowToast(true);
            } else {
                setToastMessage({message: "Une erreur est survenue", severity: "error"});
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (<Box>
            <Button variant="contained" onClick={() => {
                setShowNew(true)
            }}>Ajouter</Button>
            <Modal
                id="modal-crud-container"
                hideBackdrop
                open={newArticle}
                onClose={() => setShowNew(false)}
                aria-labelledby="new-article-title"
                aria-describedby="child-modal-description"
            >
                <Box className="modal-crud modal-crud-Article" sx={{bgcolor: 'background.default'}}>
                    <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="new-article-title">Nouveau article</Typography>
                    <form onSubmit={handleSubmit(newArticleForm)}>
                        <Grid container spacing={8}>
                            <Grid item xs={6} sx={{ display: 'flex',flexDirection: 'column'}}>
                                <Controller
                                    name="name_article"
                                    control={control}
                                    defaultValue=""
                                    render={() => (
                                        <TextField
                                            {...register(
                                                'nam_article',
                                                {
                                                    required: 'Ce champ est requis'
                                                }
                                            )}
                                            onChange={(e) => setName(e.target.value)}
                                            sx={{mt: 5, height: 50}}
                                            label="Nom de l'article"
                                            variant="standard"
                                            value={name_article}
                                        />
                                    )}
                                />
                                {errors.name_article ? (
                                    <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.name_article?.message}</Alert>
                                ) : ''}

                                <Controller
                                    name="content_article"
                                    control={control}
                                    defaultValue=""
                                    render={() => (
                                        <TextField
                                            {...register(
                                                'content_article',
                                                {
                                                    required: 'Ce champ est requis',
                                                }
                                            )}
                                            multiline
                                            rows={4}
                                            onChange={(e) => setContentArticle(e.target.value)}
                                            sx={{mt: 5, mb: 20, height: 50, width: '100%'}}
                                            label="Contenu de l'article"
                                            variant="outlined"
                                            value={content_article}
                                        />
                                    )}
                                />
                                {errors.content_article ? (
                                    <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.content_article?.message}</Alert>
                                ) : ''}

                                <Controller
                                    name="image"
                                    control={control}
                                    defaultValue=""
                                    render={() => (
                                        <Input
                                            type='file'
                                            {...register('image')}
                                            onChange={(e) => setImage(e.target.files[0]) }
                                            sx={{mt: 5, height: 50}}
                                        />
                                    )}
                                />
                                {errors.image ? (
                                    <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.image?.message}</Alert>
                                ) : ''}
                            </Grid>
                            <Grid item xs={6} sx={{ display: 'flex',flexDirection: 'column'}}>
                                <Controller
                                    name="category"
                                    control={control}
                                    defaultValue=""
                                    render={() => (
                                        <FormControl sx={{ m: 1, mt: 5, minWidth: 120 }} size="small">
                                            <InputLabel id="category-select">Categorie</InputLabel>
                                            <Select
                                                labelId="category-select"
                                                id="category-select"
                                                value={category}
                                                label="Categorie"
                                                onChange={(e) => setCategory(e.target.value)}
                                                sx={{height: 50}}
                                                variant="outlined"
                                            >
                                                {categories.map((category) => {
                                                    return(
                                                        <MenuItem key={category.id} value={category.id}>{category.name_category}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="place"
                                    control={control}
                                    defaultValue=""
                                    render={() => (
                                        <FormControl sx={{ m: 1, mt: 5, minWidth: 120 }} size="small">
                                            <InputLabel id="event-select">Lieu</InputLabel>
                                            <Select
                                                labelId="place-select"
                                                id="place-select"
                                                value={place}
                                                label="Lieu"
                                                onChange={(e) => setPlace(e.target.value)}
                                                sx={{height: 50}}
                                                variant="outlined"
                                            >
                                                {places.map((place) => {
                                                    return(
                                                        <MenuItem key={place.id} value={place.id}>{place.name_place}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} className="action-button" sx={{ minwidth: '100%' }}>
                                <Button type="submit" sx={{m: 3}} variant="contained">Envoyer</Button>
                                <Button variant="outlined" onClick={() => setShowNew(false)}>Fermer</Button>
                            </Grid>
                        </Grid>
                    </form>

                </Box>
            </Modal>

            <Snackbar
                open={toast}
                autoHideDuration={3000}
                onClose={() => setShowToast(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={() => setShowToast(false)} severity={toastMessage.severity} sx={{width: '100%'}}>
                    {toastMessage.message}
                </Alert>
            </Snackbar>
        </Box>

    )
}

export default NewArticle;