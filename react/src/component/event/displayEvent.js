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





function DisplayEvent(event) {

    const { id } = useParams();
    const [oneEvent, setOneEvent] = useState([]);
    const [name_event, setName] = useState(event.DisplayEventValue.name_event);
    const [description_event, setDescription] = useState(event.DisplayEventValue.description_event);
    const [date_start, setDateStart] = useState(event.DisplayEventValue.date_start);
    const [date_end, setDateEnd] =  useState(event.DisplayEventValue.date_end);
    const [place, setPlace] = useState(event.DisplayEventValue.place);
    const [DisplayEvent, setShowDisplay] = useState(false);


    return(<Box>
            <Box>
                <Button  variant='contained' sx={{mx: 2}}
                         onClick={() => {
                             setShowDisplay(true)
                             setOneEvent({
                                 id: event.DisplayEventValue.id,
                                 name_event: event.DisplayEventValue.name_event,
                                 description_event: event.DisplayEventValue.description_event,
                                 date_start: event.DisplayEventValue.date_start,
                                 date_end: event.DisplayEventValue.date_end,
                                 place: event.DisplayEventValue.place

                             })
                         }}>
                    <Loupe/> Voir details
                </Button>
                <Modal
                    id="modal-crud-container"
                    hideBackdrop
                    open={DisplayEvent}
                    onClose={() => setShowDisplay(false)}
                    aria-labelledby="edit-event-title"
                    aria-describedby="child-modal-description"
                >
                    <Box className="modal-crud modal-crud-event" sx={{bgcolor: 'background.default'}}>
                        <Typography variant="h4" sx={{textAlign: 'center', mb: 4}} id="edit-Event-title">{name_event}</Typography>
                        <Box sx={{ marginTop: 3 }}>
                            {description_event.slice(0,40)}
                        </Box>
                        <Box sx={{ marginTop: 3 }}>
                            Lieu: {place.name_place}
                        </Box>
                        <Box sx={{ marginTop: 3 }}>
                            Date de début: {date_start.slice(0,10)}
                        </Box>
                        <Box sx={{ marginTop: 3 }}>
                            Date de fin: {date_end.slice(0,10)}
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
export default DisplayEvent;