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
    MenuItem,
    Select, InputLabel, Input
} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {useEffect, useState} from "react";
import update from "immutability-helper";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

function EditPlace(props) {
    const [id, setID] = useState("");
    const [name_place, setName] = useState(props.updateValue.name_place);
    const [description_place, setDescription] = useState(props.updateValue.description_place);
    const [image, setImage] = useState('');
    const [cImage, setCImage] = useState(props.updateValue.image);

    // One of ...
    const [type, setType] = useState(undefined);
    const [address, setAddress] = useState(undefined);
    // List All
    const [types, setTypes] = useState({});
    const [addresses, setAddresses] = useState({});

    const [onePlace, setOnePlace] = useState("");
    const [editPlace, setShowEdit] = useState(false);
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});

    const { register, control, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
        name_place: props.updateValue.name_place,
        description_place: props.updateValue.description_place,
        image: props.updateValue.image,
        type: props.updateValue.type,
        address: props.updateValue.address,
    } });

    useEffect( () => {
        getAlls()
    }, [])

    let getAlls = async () => {
        await axios.get("http://127.0.0.1:8000/api/types/").then((actualData) => { setTypes(actualData.data.data) });
        await axios.get("http://127.0.0.1:8000/api/addresses/").then((actualData) => { setAddresses(actualData.data.data) });
    }

    let editPlaceForm = async () => {
        try {

            let formData = new FormData();
            formData.append("name_place",  name_place);
            formData.append("description_place", description_place);
            formData.append("type",  type ? `${type}` : `${props.updateValue.type.id}`);
            formData.append("address", address ? `${address}` : `${props.updateValue.address.id}`);
            if (image){
                formData.append("image", image);
            }
            formData.append("_method", 'PATCH');

            let updatedPlace = {
                id: id ? id : parseInt(onePlace.id),
                name_place: name_place ? name_place : onePlace.name_place,
                description_place: description_place ? description_place : onePlace.description_place,
                image: image ? image : onePlace.image,
                type: type ? type : onePlace.type.id,
                address: address ? address : onePlace.address.id,
            }

            let res = await axios.post("http://127.0.0.1:8000/api/places/" + onePlace.id, formData, {
                "headers" : { "Authorization":"Bearer"+localStorage.getItem('access_token') }
            })
            if (res.status === 200) {
                const foundIndex = props.updateValue.data.findIndex(x => x.id === onePlace.id);
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
                setOnePlace({
                    id: props.updateValue.id,
                    name_place: props.updateValue.name_place,
                    description_place: props.updateValue.description_place,
                    image: props.updateValue.image,
                    type: props.updateValue.type,
                    address: props.updateValue.address
                })
                setCImage(props.updateValue.image);
            }}>
              <Edit/>
          </Button>
         <Modal
            id="modal-crud-container"
            hideBackdrop
            open={editPlace}
            onClose={() => setShowEdit(false)}
            aria-labelledby="edit-place-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modal-crud modal-crud-place" sx={{bgcolor: 'background.default'}}>
                <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="edit-place-title">Editer un lieu</Typography>
                <form onSubmit={handleSubmit(editPlaceForm)}>
                    <Grid container spacing={8}>
                        <Grid item xs={6} sx={{ display: 'flex',flexDirection: 'column'}}>
                            <Controller
                              name="name_place"
                              control={control}
                              render={() => (
                                  <TextField
                                   {...register(
                                       'name_place',
                                       {
                                           required: 'Ce champ est requis'
                                       }
                                   )}
                                   onChange={(e) => setName(e.target.value)}
                                   sx={{mt: 5, height: 50}}
                                   label="Nom"
                                   variant="standard"
                                   defaultValue={name_place}
                                />
                              )}
                            />
                            {errors.name_place ? (
                                <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.name_place?.message}</Alert>
                            ) : ''}

                            <Controller
                              name="description_place"
                              control={control}
                              render={() => (
                                  <TextField
                                   {...register(
                                       'description_place',
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
                                   defaultValue={description_place}
                                />
                              )}
                            />
                            <Box className='description-limit'>{description_place.length}/255 caractères</Box>
                            {errors.description_place ? (
                                <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.description_place?.message}</Alert>
                            ) : ''}

                            <Controller
                              name="image"
                              control={control}
                              render={() => (
                                  <Box sx={{ display: 'flex'}}>
                                      <Box component="img" src={`http://127.0.0.1:8000/storage/uploads/places/${cImage}`} alt={cImage} sx={{ width: "80px", mr: 3 }}/>
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
                              name="type"
                              control={control}
                              render={() => (
                                  <FormControl sx={{ m: 1, mt: 5, minWidth: 120 }} size="small">
                                      <InputLabel id="type-select">Type</InputLabel>
                                      <Select
                                        labelId="type-select"
                                        id="type-select"
                                        defaultValue={props.updateValue.type.id}
                                        label="Type"
                                        onChange={(e) => setType(e.target.value)}
                                        sx={{height: 50}}
                                        variant="outlined"
                                      >
                                      {types.map((type) => {
                                          return(
                                              <MenuItem key={type.id} value={type.id}>{type.name_type}</MenuItem>
                                          )
                                      })}
                                      </Select>
                                  </FormControl>
                              )}
                            />
                            <Controller
                              name="address"
                              control={control}
                              render={() => (
                                  <FormControl sx={{ m: 1, mt: 5, minWidth: 120 }} size="small">
                                      <InputLabel id="address-select">Adresse</InputLabel>
                                      <Select
                                        labelId="address-select"
                                        id="address-select"
                                        defaultValue={props.updateValue.address.id}
                                        label="Adresse"
                                        onChange={(e) => setAddress(e.target.value)}
                                        sx={{height: 50}}
                                        variant="outlined"
                                      >
                                      {addresses.map((address) => {
                                          return(
                                              <MenuItem key={address.id} value={address.id}>{address.address} {address.postal_code} {address.city}</MenuItem>
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
export default EditPlace;