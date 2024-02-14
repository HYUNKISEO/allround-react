import React, {useEffect, useState} from 'react';
import {Nav, Navbar, NavbarText} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const Header = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token && !loggedIn) {
            const decoded = jwtDecode(token);
            setUser(decoded);
            setLoggedIn(true);
        }
    }, [loggedIn]);

    const logout = () => {
        localStorage.removeItem('token')
        setLoggedIn(false);
        navigate("/")
        alert("Logout 완료")
    }

    return (
        <>
            <Navbar bg='dark' data-bs-theme='dark'>
                <Link to='/' className='navbar-brand mx-2'>Home</Link>
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
                            <NavbarText className='text-white'>{`${user.name}님 환영합니다👋`}</NavbarText>
                            <Nav.Link onClick={logout}>로그아웃</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link as={Link} to='/user/login'>로그인</Nav.Link>
                    )}
                </Nav>
            </Navbar>
        </>
    );
};

export default Header;