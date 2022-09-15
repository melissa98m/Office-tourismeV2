import React from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Container,
} from "@mui/material";




function Dashboard() {

    document.title = 'Dashboard'

    return <Container maxWidth="lg" id='dashboard'>
        <Box>
            <ButtonGroup
                orientation="vertical"
                aria-label="vertical contained button group"
                variant="text"
            >
                <Button color="secondary" href='place'>Gérer les lieux</Button>
                <Button color="secondary" href='type'>Gérer les types</Button>
                <Button color="secondary" href='category'>Gérer les categories</Button>
                <Button color="secondary" href='article'>Gérer les articles</Button>
                <Button color="secondary" href='event'>Gérer les évenements</Button>
                <Button color="secondary" href='address'>Gérer les adresses</Button>
            </ButtonGroup>
        </Box>
    </Container>
}


export default Dashboard;