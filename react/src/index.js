import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import './assets/css/component/_partials/_theme.scss';

import {Provider} from 'react-redux';
import store from './store'

import RouteService from "./services/route/route-service";
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {lightTheme} from "./component/_partials/_theme/_lightTheme";
import {darkTheme} from "./component/_partials/_theme/_darkTheme";
import {ColorContext, setThemeToStorage} from "./component/_partials/_theme/_colorContext";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

import App from './App';
import Home from "./component/home/home";
import Type from "./component/type/type";
import Event from "./component/event/event";
import Events from "./component/event/events";
import Place from "./component/place/place";
import {Navbar} from "./component/_partials/_navbar/_navbar";
import {Footer} from "./component/_partials/_footer/_footer";
import Article from "./component/article/article";
import Category from "./component/category/category";
import Address from "./component/address/address";
import Login from "./services/auth/login";
import Logout from "./services/auth/logout";
import Register from "./services/auth/register";
import Places from "./component/place/places";
import Articles from "./component/article/articles";
import Dashboard from "./component/dashboard/dashboard";



function CustomTheme() {

    const [mode, setMode] = React.useState("light");
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === "light" ? "dark" : "light"
                );
                setThemeToStorage();
            },
        }),
        []
    );
    const theme = React.useMemo(
        () => createTheme(mode === "light" ? lightTheme : darkTheme),
        [mode]
    );

    useEffect(() => {
        // rend le thème persistant après reload
        const mode = localStorage.getItem("isDarkMode");
        if (mode) {
            setMode(mode);
        }
    }, []);
    return <ColorContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme/>
            <Navbar/>
            <App/>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<RouteService Component={Home}/>}>Accueil</Route>
                    <Route exact path="place" element={<RouteService Component={Place}/>}>Place</Route>
                    <Route exact path="places" element={<RouteService Component={Places}/>}>Places</Route>
                    <Route exact path="address" element={<RouteService Component={Address}/>}>Address</Route>
                    <Route exact path="article" element={<RouteService Component={Article}/>}>Article</Route>
                    <Route exact path="articles" element={<RouteService Component={Articles}/>}>Blog</Route>
                    <Route exact path="category" element={<RouteService Component={Category}/>}>Category</Route>
                    <Route exact path="type" element={<RouteService Component={Type}/>}>Type</Route>
                    <Route exact path="event" element={<RouteService Component={Event}/>}>Event</Route>
                    <Route exact path="events" element={<RouteService Component={Events}/>}>Events</Route>
                    <Route exact path="dashboard" element={<RouteService Component={Dashboard}/>}>Dashboard</Route>
                    <Route exact path="login" element={<RouteService Component={Login}/>}>Login</Route>
                    <Route exact path="logout" element={<RouteService Component={Logout}/>}>Logout</Route>
                    <Route exact path="register" element={<RouteService Component={Register}/>}>Logout</Route>
                    <Route path="*" element={
                        <div>
                            <h2>Erreur 404 : Not found</h2>
                        </div>
                    }/>
                </Routes>
            </BrowserRouter>
            <Footer />
        </ThemeProvider>
    </ColorContext.Provider>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <CustomTheme/>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
