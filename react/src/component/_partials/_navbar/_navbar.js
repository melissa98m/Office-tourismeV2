import {AppBar, Box, Button} from "@mui/material";
import {SwitchModeButton} from "../_theme/_switchModeButton";
import React, {useEffect} from "react";
import LoginButton from "../../features/loginButton/LoginButton";
import {useSelector} from "react-redux";

export function Navbar() {
    const loggedIn = useSelector((state) => state.loggedIn.value)

    useEffect(() => {
    }, [])

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar className='header' id="navbar">
                <Box sx={{m: 5, flexGrow: 1}} component="div">{document.title}</Box>
                <Box className="navbar">
                    <Button color="secondary" href='/'>Accueil</Button>
                    <Button color="secondary" href='places'>Lieux</Button>
                    <Button color="secondary" href='events'>Evenement</Button>
                    <Button color="secondary" href='articles'>Blog</Button>
                    <Button href={ loggedIn ? 'dashboard' : '' } color="secondary">{ loggedIn ? 'Dashboard' : '' }</Button>
                    <LoginButton/>
                    <SwitchModeButton/>
                </Box>
            </AppBar>
        </Box>
    )
}