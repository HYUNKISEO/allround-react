import React from 'react';
import home from "./pages/home/home";
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/user/Login";

const Allround = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route path='/' Component={home}/>
                <Route path='/user/login' Component={Login}/>
            </Routes>
        </div>
    );
};

export default Allround;