import React, {useState} from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

const Header = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <>
            <Navbar bg='dark' data-bs-theme='dark'>
                <Link to='/' className='navbar-brand'>Home</Link>
                <Nav className='me-auto'>
                    <Link to='/basic' className='nav-link'>기본</Link>
                    <Link to='/share' className='nav-link'>공유</Link>
                    <Link to='/board' className='nav-link'>게시판</Link>
                    <Link to='/testinfo' className='nav-link'>시험</Link>
                    <Link to='/yotube' className='nav-link'>강의</Link>
                </Nav>
                <Nav>
                    {loggedIn ? (
                        <>
                            <Nav.Text>{`000님 환영합니다`}</Nav.Text>
                            <Nav.Link>로그아웃</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link>로그인</Nav.Link>
                    )}
                </Nav>
            </Navbar>
        </>
    );
};

export default Header;