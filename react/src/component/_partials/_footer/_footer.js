import {AppBar, Box, Link} from "@mui/material";
import {useEffect} from "react";

export function Footer() {

    useEffect(() => {
    }, [])

    return (
         <AppBar id="footer" position="fixed" color="primary" className='footer-container' sx={{ top: 'auto', bottom: 0, minHeight: "50px" }}>
             <Box>
                 @Office du tourisme 2022
             </Box>
         </AppBar>

    )
}