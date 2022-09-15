import {
    Box,
    Button,
    FormControl,
    Modal,
    Snackbar,
    TextField,
    Typography,
    Alert,
    InputLabel,
    Select, MenuItem
} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {useEffect, useState} from "react";
import update from "immutability-helper";
import {useForm, Controller} from "react-hook-form";
import { format } from "date-fns";
import axios from "axios";

function EditEvent(props) {
    const [id, setID] = useState("");
    const [name_event, setName] = useState(props.updateValue.name_event);
    const [description_event, setDescription] =  useState(props.updateValue.description_event);

    const [place, setPlace] = useState(undefined);
    const [places, setPlaces] = useState({});

    const [date_start, setDateStart] = useState(props.updateValue.date_start);
    const [date_end, setDateEnd] = useState(props.updateValue.date_end);
    const [oneEvent, setOneEvent] = useState("");
    const [editEvent, setShowEdit] = useState(false);
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name_event: props.updateValue.name_event,
            description_event: props.updateValue.description_event,
            date_start: props.updateValue.date_start,
            date_end: props.updateValue.date_end},
            place: props.updateValue.place,
        });
    useEffect( () => {
        getPlaces()
    }, [])

    let getPlaces = async () => {
        await axios.get("http://127.0.0.1:8000/api/places/").then((actualData) => { setPlaces(actualData.data.data) });
    }

    let editEventForm = async () => {
        try {
            let updatedEvent = {
                id: id ? id : parseInt(oneEvent.id),
                name_event: name_event ? name_event : oneEvent.name_event,
                description: description_event ? description_event : oneEvent.description_event,
                date_start: format(new Date(date_start), "yyyy-MM-dd HH:mm:ss") ?? oneEvent.date_start,
                date_end: format(new Date(date_end), "yyyy-MM-dd HH:mm:ss") ?? oneEvent.date_end,
                place: place ? place : oneEvent.place.id,
            }
            let res = await axios.patch("http://127.0.0.1:8000/api/events/" + oneEvent.id, {name_event, description_event, date_start, date_end },
            {
                "headers" : { "Content-Type":"multipart/form-data" }
            })
            if (res.status === 200) {
                const foundIndex = props.updateValue.data.findIndex(x => x.id === oneEvent.id);
                let data = update(props.updateValue.data, {[foundIndex]: {$set: updatedEvent}})
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
                setOneEvent({
                    id: props.updateValue.id,
                    name_event: props.updateValue.name_event,
                    description_event: props.updateValue.description_event,
                    date_start: props.updateValue.date_start,
                    date_end: props.updateValue.date_end,
                    place: props.updateValue.place
                })
            }}>
              <Edit/>
          </Button>
         <Modal
            id="modal-crud-container"
            hideBackdrop
            open={editEvent}
            onClose={() => setShowEdit(false)}
            aria-labelledby="edit-event-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modal-crud modal-crud-event" sx={{bgcolor: 'background.default'}}>
                <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="edit-event-title">Editer un event</Typography>
                <form onSubmit={handleSubmit(editEventForm)}>
                    <FormControl>
                        <Controller
                          name="name"
                          control={control}
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
                               style={{width: 400, height: 50}}
                               label="Nom"
                               variant="standard"
                               defaultValue={name_event}
                            />
                          )}
                        />
                        {errors.name_event ? (
                            <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.name_event?.message}</Alert>
                        ) : ''}

                        <Controller
                          name="date_start"
                          control={control}
                          render={() => (
                              <Box>
                                  <Box>Date de début</Box>
                                  <TextField
                                   {...register(
                                       'date_start',
                                       {
                                           required: 'Ce champ est requis'
                                       }
                                   )}
                                   onChange={(e) => setDateStart(e.target.value)}
                                   style={{width: 400, height: 50}}
                                   type='datetime-local'
                                   variant="standard"
                                   defaultValue={date_start}
                                />
                              </Box>
                          )}
                        />
                        {errors.date_start ? (
                            <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.date_start?.message}</Alert>
                        ) : ''}

                        <Controller
                          name="date_end"
                          control={control}
                          render={() => (
                              <Box>
                                  <Box>Date de fin</Box>
                                  <TextField
                                   {...register(
                                       'date_end',
                                       {
                                           required: 'Ce champ est requis'
                                       }
                                   )}
                                   onChange={(e) => setDateEnd(e.target.value)}
                                   style={{width: 400, height: 50}}
                                   type='datetime-local'
                                   variant="standard"
                                   defaultValue={date_end}
                                />
                              </Box>
                          )}
                        />
                        {errors.date_start ? (
                            <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.date_start?.message}</Alert>

                        ) : ''}
                        <Controller
                            name="description_event"
                            control={control}
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
                                    defaultValue={description_event}
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
                        <Box className="action-button">
                            <Button type="submit" sx={{m: 3}} variant="contained">Envoyer</Button>
                            <Button variant="outlined" onClick={() => setShowEdit(false)}>Fermer</Button>
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
export default EditEvent;