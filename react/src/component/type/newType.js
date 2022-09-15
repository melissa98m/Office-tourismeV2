import {Box, Button, FormControl, Modal, Snackbar, TextField, Typography, Alert, Input} from "@mui/material";
import {useState} from "react";
import update from "immutability-helper";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

function NewType(props) {

    const [id, setID] = useState("");
    const [name_type, setName] = useState("");
    const [description_type , setDescription] = useState("")
    const [newType, setShowNew] = useState(false);
    // Handle Toast event
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});
    const { register, control, handleSubmit, formState: { errors } } = useForm({defaultValues: {
            name_type: '',
            description_type:''
    }});

    let newTypeForm = async () => {
        try {
            let res = await axios.post('http://127.0.0.1:8000/api/types/', {name_type , description_type} , {
                "headers" : { "Authorization":"Bearer"+localStorage.getItem('access_token') }
            })
            if (res.status === 200) {
                let tab = {};
                await Object.assign(tab, res.data.data);
                let data = update(props.newValue.data, {$push: [{id : tab.id, name_type: tab.name_type , description_type: tab.description_type}]})
                props.handleDataChange(data);
                setName("");
                setToastMessage({message: "Type ajouté ! Vous pouvez en ajouter un autre", severity: "success"});
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
            open={newType}
            onClose={() => setShowNew(false)}
            aria-labelledby="new-type-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modal-crud modal-crud-type" sx={{bgcolor: 'background.default'}}>
                <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="new-type-title">Nouveau type de lieux</Typography>
                <form onSubmit={handleSubmit(newTypeForm)}>
                    <FormControl>
                        <Controller
                          name="name_type"
                          control={control}
                          defaultValue=""
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
                               value={name_type}
                            />
                          )}
                        />
                        {errors.name_type ? (
                            <Alert sx={{mt:2, p:0, pl:2}} severity="error">{errors.name_type?.message}</Alert>
                        ) : ''}
                        <Controller
                            name="description_type"
                            control={control}
                            defaultValue=""
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

export default NewType;