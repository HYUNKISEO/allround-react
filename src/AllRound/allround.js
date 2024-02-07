import React from 'react';
import home from "./pages/home/home";
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header";

const Allround = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route path='/' Component={home}></Route>
            </Routes>
        </div>
    );
};

export default Allround;