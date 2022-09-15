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
    InputLabel, Select, MenuItem
} from "@mui/material";
import {useEffect, useState} from "react";
import update from "immutability-helper";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

function NewEvent(props) {

    const [id, setID] = useState("");
    const [name_event, setName] = useState("");
    const [description_event, setDescription] = useState("");
    const [date_start, setDateStart] = useState("");
    const [date_end, setDateEnd] = useState("");
    const [newEvent, setShowNew] = useState(false);

    const [place, setPlace] = useState({});
    const [places, setPlaces] = useState({});
    // Handle Toast event
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});
    const { register, control, handleSubmit, formState: { errors } } = useForm({defaultValues: {
            name: '',
            description_event: '',
            date_start: '',
            date_end: '',
            place: {},
        }});
    useEffect( () => {
        getPlaces()
    }, [])

    let reset = () => {
        setName('');
        setDescription('');
        setDateStart('');
        setDateEnd('');
        setPlace({});
    }

    let getPlaces = async () => {
        await axios.get("http://127.0.0.1:8000/api/places/").then((actualData) => { setPlaces(actualData.data.data) });
    }

    let newEventForm = async () => {
        try {

            let formData = new FormData();

            formData.append("name_event", name_event);
            formData.append("description_event", description_event);
            formData.append("date_start", date_start);
            formData.append("date_end", date_end);
            formData.append("place", `${place}`);

            let newEvent = {
                name_event: name_event,
                description_event: description_event,
                date_start: date_start,
                date_end: date_end,
                place: place
            };

            let res = await axios.post('http://127.0.0.1:8000/api/events/', formData, {
                "headers" : { "Authorization":"Bearer"+localStorage.getItem('access_token') }
            });
            if (res.status === 200) {
                let tab = {};
                await Object.assign(tab, res.data.data);
                let data = update(props.newValue.data, {$push: [{
                        id : tab.id,
                        name_event: tab.name_event,
                        description_event: tab.description_event,
                        date_start: tab.date_start,
                        date_end: tab.date_end,
                        place: tab.place
                    }]})
                props.handleDataChange(data);
                reset();
                setToastMessage({message: "Evenement ajouté ! Vous pouvez en ajouter un autre", severity: "success"});
                setShowToast(true);
            } else {
                setToastMessage({message: "Une erreur est survenue", severity: "error"});
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (<Box>
        <Button variant="contained" onClick={() => setShowNew(true)}>Ajouter</Button>
        <Modal
            id="modal-crud-container"
            hideBackdrop
            open={newEvent}
            onClose={() => setShowNew(false)}
            aria-labelledby="new-event-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modal-crud modal-crud-event" sx={{bgcolor: 'background.default'}}>
                <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="new-event-title">Nouvel event</Typography>
                <form onSubmit={handleSubmit(newEventForm)}>
                    <FormControl>
                        <Controller
                          name="name_event"
                          control={control}
                          defaultValue=""
                          render={() => (
                              <TextField
                               {...register(
                                   'name_event',
                                   {
                                       required: 'Ce champ est requis',
                                       minLength: {value: 5, message: 'Longueur minimale de 5 caractères'}
                                   }
                               )}
                               onChange={(e) => setName(e.target.value)}
                               style={{height: 50}}
                               label="Nom de l'event"
                               variant="standard"
                               value={name_event}
                            />
                          )}
                        />
                        {errors.name_event ? (
                            <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.name_event?.message}</Alert>
                        ) : ''}

                        <Controller
                          name="date_start"
                          control={control}
                          defaultValue=""
                          render={() => (
                              <Box>
                                <Box sx={{mt:2}}>Date de début</Box>
                                <TextField
                                   {...register(
                                       'date_start',
                                       {
                                           required: 'Ce champ est requis'
                                       }
                                   )}
                                   type='datetime-local'
                                   onChange={(e) => setDateStart(e.target.value)}
                                   style={{width: "100%", height: 50}}
                                   variant="standard"
                                   value={date_start}
                                />
                            </Box>
                          )}
                        />
                        {errors.date_start ? (
                            <Alert sx={{mt:2, p:0, pl:2, width: 200}} severity="error">{errors.date_start?.message}</Alert>
                        ) : ''}

                        <Controller
                          name="date_end"
                          control={control}
                          defaultValue=""
                          render={() => (<Box>
                            <Box sx={{mt:2}}>Date de fin</Box>
                            <TextField
                               {...register(
                                   'date_end',
                                   {
                                       required: 'Ce champ est requis',
                                   }
                               )}
                               type='datetime-local'
                               onChange={(e) => setDateEnd(e.target.value)}
                               style={{width: "100%", height: 50}}
                               variant="standard"
                               value={date_end}
                            />
                          </Box>
                          )}
                        />
                        {errors.date_end ? (
                            <Alert sx={{mt:2, p:0, pl:2, width: 200}} severity="error">{errors.date_end?.message}</Alert>
                        ) : ''}
                        <Controller
                            name="description_event"
                            control={control}
                            defaultValue=""
                            render={() => (
                                <TextField
                                    {...register(
                                        'description_event',
                                        {
                                            required: 'Ce champ est requis',
                                            maxLength: {value: 255, message: 'Longueur maximale de 255 caractères'}
                                        }
                                    )}
                                    multiline
                                    rows={4}
                                    onChange={(e) => setDescription(e.target.value)}
                                    sx={{mt: 5, mb: 20, height: 50, width: '100%'}}
                                    label="Description"
                                    variant="outlined"
                                    value={description_event}
                                />
                            )}
                        />

                        <Box className='description-limit'>{description_event.length}/255 caractères</Box>
                        {errors.description_event ? (
                            <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.description_event?.message}</Alert>
                        ) : ''}
                        <Controller
                            name="place"
                            control={control}
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
                        <Box className="action-button">
                            <Button type="submit" sx={{m: 3}} variant="contained">Envoyer</Button>
                            <Button variant="outlined" onClick={() => setShowNew(false)}>Fermer</Button>
                        </Box>
                    </FormControl>
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

export default NewEvent;