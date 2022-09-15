import {Box, Button, FormControl, Modal, Snackbar, TextField, Typography, Alert} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {useState} from "react";
import update from "immutability-helper";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

function EditType(props) {
    const [id, setID] = useState("");
    const [name_type, setName] = useState("");
    const [description_type, setDescription] = useState("");
    const [oneType, setOneType] = useState("");
    const [editType, setShowEdit] = useState(false);
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});

    const { register, control, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
            name_type: props.updateValue.name_type,
            description_type: props.updateValue.description_type,
    } });

    let editTypeForm = async () => {
        try {
            let updatedType = {
                id: id ? id : parseInt(oneType.id),
                name_type: name_type ? name_type : oneType.name_type,
                description_type: description_type ? description_type : oneType.description_type
            }
            let res = await axios.patch("http://127.0.0.1:8000/api/types/" + oneType.id, {name_type, description_type} , {
                "headers" : { "Authorization":"Bearer"+localStorage.getItem('access_token') }
            })
            if (res.status === 200) {
                const foundIndex = props.updateValue.data.findIndex(x => x.id === oneType.id);
                let data = update(props.updateValue.data, {[foundIndex]: {$set: updatedType}})
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
                setOneType({id: props.updateValue.id, name_type: props.updateValue.name_type , description_type: props.updateValue.description_type})
            }}>
              <Edit/>
          </Button>
         <Modal
            id="modal-crud-container"
            hideBackdrop
            open={editType}
            onClose={() => setShowEdit(false)}
            aria-labelledby="edit-type-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modal-crud modal-crud-type" sx={{bgcolor: 'background.default'}}>
                <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="edit-type-title">Editer un type de lieux</Typography>
                <form onSubmit={handleSubmit(editTypeForm)}>
                    <FormControl>
                          <Controller
                              name="name_type"
                              control={control}
                              render={() => (
                                  <TextField
                                   {...register(
                                       'name_type',
                                       {
                                           required: 'Ce champ est requis',
                                           minLength: {value: 5, message: 'Longueur minimale de 5 caractères'}
                                       }
                                   )}
                                   onChange={(e) => setName(e.target.value)}
                                   style={{width: 400, height: 50}}
                                   label="Nom"
                                   variant="standard"
                                   defaultValue={name_type}
                                />
                              )}
                            />
                            {errors.name_type ? (
                                <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.name_type?.message}</Alert>
                            ) : ''}
                        <Controller
                            name="description_type"
                            control={control}
                            defaultValue={description_type}
                            render={() => (
                                <TextField
                                    {...register(
                                        'description_type',
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
                                    value={description_type}
                                />
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
export default EditType;