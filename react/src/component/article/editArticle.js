import {
    Box,
    Button,
    FormControl,
    Modal,
    Snackbar,
    TextField,
    Typography,
    Alert,
    Grid,
    Input,
    InputLabel, Select, MenuItem
} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {useEffect, useState} from "react";
import update from "immutability-helper";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

function EditArticle(props) {
    const [id, setID] = useState("");
    const [name_article, setName] = useState(props.updateValue.name_article);
    const [content_article, setContentArticle] = useState(props.updateValue.content_article);
    const [image, setImage] = useState('');
    const [cImage, setCImage] = useState(props.updateValue.image);

    const [oneArticle, setOneArticle] = useState("");

    const [category, setCategory] = useState(undefined);
    const [place, setPlace] = useState(undefined);

    const [categories, setCategories] = useState({});
    const [places, setPlaces] = useState({});

    const [editArticle, setShowEdit] = useState(false);
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues:
            {   name_article: props.updateValue.name_article,
                content_article : props.updateValue.content_article,
                image: props.updateValue.image,
                category: props.updateValue.category,
                place: props.updateValue.place,
            } });

    useEffect( () => {
        getAlls()
    }, [])

    let getAlls = async () => {
        await axios.get("http://127.0.0.1:8000/api/categories/").then((actualData) => { setCategories(actualData.data.data) });
        await axios.get("http://127.0.0.1:8000/api/places/").then((actualData) => { setPlaces(actualData.data.data) });
    }

    let editArticleForm = async () => {
        try {
            let formData = new FormData();
            formData.append("name_article",  name_article);
            formData.append("content_article", content_article);
            formData.append("category",  category ? `${category}` : `${props.updateValue.category.id}`);
            formData.append("place", place ? `${place}` : `${props.updateValue.place.id}`)
            if (image){
                formData.append("image", image);
            }
            formData.append("_method", 'PATCH');

            let updatedArticle = {
                id: id ? id : parseInt(oneArticle.id),
                name_article: name_article ? name_article : oneArticle.name_article,
                content_article: content_article ? content_article : oneArticle.content_article,
                image: image ? image : oneArticle.image,
                category: category ? category : oneArticle.category.id,
                place: place ? place : oneArticle.place.id,
            }

            let res = await axios.post("http://127.0.0.1:8000/api/articles/" + oneArticle.id, formData, {
                "headers" : { "Authorization":"Bearer"+localStorage.getItem('access_token') }
            })
            if (res.status === 200) {
                const foundIndex = props.updateValue.data.findIndex(x => x.id === oneArticle.id);
                let tab = {};
                await Object.assign(tab, res.data.data);
                let data = update(props.updateValue.data, {[foundIndex]: {$set: tab}})
                props.handleDataChange(data, 'edit');
                setShowEdit(false)
            } else {
                setToastMessage({message: "Une erreur est survenue", severity: "error"});
                setShowToast(true)
            }

        } catch (err) {
            console.log(err);
        }
    }

    return(<Box >
            <Button color='info' variant='contained' sx={{mx: 2}}
                    onClick={() => {
                        setShowEdit(true)
                        setOneArticle({
                            id: props.updateValue.id,
                            name_article: props.updateValue.name_article,
                            content_article: props.updateValue.content_article,
                            image: props.updateValue.image,
                            category: props.updateValue.category,
                            place: props.updateValue.place
                        })
                        setCImage(props.updateValue.image);
                    }}>
                <Edit/>
            </Button>
            <Modal
                id="modal-crud-container"
                hideBackdrop
                open={editArticle}
                onClose={() => setShowEdit(false)}
                aria-labelledby="edit-place-title"
                aria-describedby="child-modal-description"
            >
                <Box className="modal-crud modal-crud-place" sx={{bgcolor: 'background.default'}}>
                    <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="edit-place-title">Editer un Article</Typography>
                    <form onSubmit={handleSubmit(editArticleForm)}>
                        <Grid container spacing={8}>
                            <Grid item xs={6} sx={{ display: 'flex',flexDirection: 'column'}}>
                                <Controller
                                    name="name_article"
                                    control={control}
                                    render={() => (
                                        <TextField
                                            {...register(
                                                'name_article',
                                                {
                                                    required: 'Ce champ est requis'
                                                }
                                            )}
                                            onChange={(e) => setName(e.target.value)}
                                            sx={{mt: 5, height: 50}}
                                            label="Nom de l'article"
                                            variant="standard"
                                            defaultValue={name_article}
                                        />
                                    )}
                                />
                                {errors.name_article ? (
                                    <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.name_article?.message}</Alert>
                                ) : ''}

                                <Controller
                                    name="content_article"
                                    control={control}
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
                                            defaultValue={content_article}
                                        />
                                    )}
                                />
                                {errors.content_article ? (
                                    <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.content_article?.message}</Alert>
                                ) : ''}

                                <Controller
                                    name="image"
                                    control={control}
                                    render={() => (
                                        <Box sx={{ display: 'flex'}}>
                                            <Box component="img" src={`http://127.0.0.1:8000/storage/uploads/${cImage}`} alt={cImage} sx={{ width: "80px", mr: 3 }}/>
                                            <Input
                                                type='file'
                                                {...register('image')}
                                                onChange={(e) => setImage(e.target.files[0])}
                                                sx={{mt: 5, height: 50}}
                                            />
                                        </Box>
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
                                    render={() => (
                                        <FormControl sx={{ m: 1, mt: 5, minWidth: 120 }} size="small">
                                            <InputLabel id="type-select">Categorie</InputLabel>
                                            <Select
                                                labelId="category-select"
                                                id="category-select"
                                                defaultValue={props.updateValue.category.id}
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
                                    render={() => (
                                        <FormControl sx={{ m: 1, mt: 5, minWidth: 120 }} size="small">
                                            <InputLabel id="place-select">Lieu</InputLabel>
                                            <Select
                                                labelId="place-select"
                                                id="place-select"
                                                defaultValue={props.updateValue.category.id}
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
                                <Button variant="outlined" onClick={() => setShowEdit(false)}>Fermer</Button>
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
export default EditArticle;