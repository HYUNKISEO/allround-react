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
import Write from "./pages/board/Write";
import Detail from "./pages/board/Detail";
import Update from "./pages/board/Update";
import Admin from "./pages/admin/Admin";
import Tutorial from "./pages/tutorial/Tutorial";
import BasicQuestionList from "./pages/basic/BasicQuestionList";
import BasicQuestionWrite from "./pages/basic/BasicQuestionWrite";
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
                <Route path='/board/write' element={<AuthCheck><Write/></AuthCheck>}/>
                <Route path='/board/post/:id' element={<AuthCheck><Detail/></AuthCheck>}/>
                <Route path='/board/update/:id' element={<AuthCheck><Update/></AuthCheck>}/>
                <Route path='/admin' element={<AuthCheck><Admin/></AuthCheck>}/>
                <Route path='/tutorial' element={<AuthCheck><Tutorial/></AuthCheck>}/>
                {/*기본문제리스트*/}
                <Route path='/basic/question/list' element={<AuthCheck><BasicQuestionList/></AuthCheck>}/>
                {/*/!*기본문제작성*!/*/}
                <Route path='/basic/question/save/:questionId' element={<AuthCheck><BasicQuestionWrite/></AuthCheck>}/>


            </Routes>
        </div>
    );
};

export default Allround;