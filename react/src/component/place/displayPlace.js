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
import {Loupe} from "@mui/icons-material";
import React, {useEffect, useState} from "react";

import {useNavigate, useParams} from "react-router";



function DisplayPlace(place) {

    const { id } = useParams();
    const [onePlace, setOnePlace] = useState([]);
    const [name_place, setName] = useState(place.DisplayPlaceValue.name_place);
    const [description_place, setDescription] = useState(place.DisplayPlaceValue.description_place);
    const [image, setImage] = useState(place.DisplayPlaceValue.image);
    const [type, setType] = useState(place.DisplayPlaceValue.type);
    const [address, setAddress] = useState(place.DisplayPlaceValue.address);
    const [DisplayPlace, setShowDisplay] = useState(false);


    return(<Box>
        <Box>
            <Button  variant='contained' sx={{mx: 2}}
                    onClick={() => {
                        setShowDisplay(true)
                        setOnePlace({
                            id: place.DisplayPlaceValue.id,
                            name_place: place.DisplayPlaceValue.name_place,
                            description_place: place.DisplayPlaceValue.description_place,
                            image: place.DisplayPlaceValue.image,
                            type: place.DisplayPlaceValue.type,
                            address: place.DisplayPlaceValue.address

                        })
                    }}>
                <Loupe/> Voir details
            </Button>
            <Modal
                id="modal-crud-container"
                hideBackdrop
                open={DisplayPlace}
                onClose={() => setShowDisplay(false)}
                aria-labelledby="edit-place-title"
                aria-describedby="child-modal-description"
            >
                <Box className="modal-crud modal-crud-place" sx={{bgcolor: 'background.default'}}>
                    <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="edit-place-title">{name_place}</Typography>
                    <Box component="img" src={`http://127.0.0.1:8000/storage/uploads/places/${image}`} alt={image} sx={{ width: "300px" }}/>
                    <Box sx={{ marginTop: 3 }}>
                        {description_place}
                    </Box>
                    <Box sx={{ marginTop: 3 }}>
                       Type de lieu: {type.name_type}
                    </Box>
                    <Box sx={{ marginTop: 3 }}>
                        Adresse du lieu: {address.address}
                        <Typography variant="body">{address.postal_code}-{address.city}</Typography>
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
export default DisplayPlace;