import React from 'react';
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/user/Login";
import SignUp from "./pages/user/SignUp";
import AuthCheck from "./components/AuthCheck";
import Home from "./pages/home/Home";
import MyPage from "./pages/user/MyPage";
import TestInfo from "./pages/testinfo/TestInfo";
import Book from "./pages/testinfo/Book";
import List from "./pages/board/List";

const Allround = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/user/login' element={<Login/>}/>
                <Route path='/user/signup' element={<SignUp/>}/>
                <Route path='/user/mypage' element={<AuthCheck><MyPage/></AuthCheck>}/>
                <Route path='/TestInfo' element={<AuthCheck><TestInfo/></AuthCheck>}/>
                <Route path='/TestInfo/book' element={<AuthCheck><Book/></AuthCheck>}/>
                <Route path='/board/list' element={<AuthCheck><List/></AuthCheck>}/>
            </Routes>
        </div>
    );
};

export default Allround;