import {Box, Button, FormControl, Modal, Snackbar, Typography, Alert} from "@mui/material";
import {useEffect, useState} from "react";
import update from "immutability-helper";
import {DeleteForeverRounded} from "@mui/icons-material";
import axios from "axios";

function DeleteType(props) {

    const [oneType, setOneType] = useState("");
    const [delType, setShowDelete] = useState(false);
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});

    let deleteType = async (e) => {
        e.preventDefault();
        try {
            let res = await axios.delete('http://127.0.0.1:8000/api/types/' + oneType.id , {
                "headers" : { "Authorization":"Bearer"+localStorage.getItem('access_token') }
            })
            if (res.status === 200) {
                const foundIndex = props.deleteValue.data.findIndex(x => x.id === oneType.id);
                let data = update(props.deleteValue.data, {$splice: [[foundIndex, 1]]})
                props.handleDataChange(data, 'delete');
                setShowDelete(false)
            } else {
                setToastMessage({message: "Une erreur est survenue", severity: "error"});
            }
        } catch (err) {
            console.log(err);
        }
    }

    return(<Box>
            <Button
                variant='contained'
                sx={{mx: 2}}
                onClick={ () => {
                    setShowDelete(true)
                    setOneType({id: props.deleteValue.id, name_type: props.deleteValue.name_type} )
                } }
            >
                <DeleteForeverRounded/>
            </Button>
            <Modal
                id="modal-crud-container"
                hideBackdrop
                open={delType}
                onClose={() => setShowDelete(false)}
                aria-labelledby="delete-type-title"
                aria-describedby="child-modal-description"
            >
                <Box className="modal-crud modal-crud-type" sx={{bgcolor: 'background.default'}}>
                    <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="delete-type-title">Supprimer un type de
                        lieux</Typography>
                    <FormControl>
                        <Box>
                            êtes vous sur de vouloir supprimer le type : {oneType.name_type}?
                        </Box>
                        <Box className="action-button">
                            <Button sx={{m: 3}} type="submit" variant="contained" onClick={deleteType}>Envoyer</Button>
                            <Button variant="outlined" onClick={() => setShowDelete(false)}>Fermer</Button>
                        </Box>
                    </FormControl>
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

export default DeleteType