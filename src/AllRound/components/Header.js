import React, {useEffect, useState} from 'react';
import {Nav, Navbar, NavbarCollapse, NavbarText, NavbarToggle, NavDropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "./Header.css";

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

    function GoMyPage() {
        navigate('/user/mypage')
    }

    return (
        <>
            <Navbar bg='dark' data-bs-theme='dark' expand='md'>
                <Link to='/' className='navbar-brand mx-2'>Home</Link>
                <NavbarToggle aria-controls="navbar-nav" />
                <NavbarCollapse id="navbar-nav">
                <Nav className='me-auto'>
                    <Link to='/basic' className='nav-link'>기본</Link>
                    <Link to='/share' className='nav-link'>공유</Link>
                    <Link to='/board/list' className='nav-link'>게시판</Link>
                    <NavDropdown title='시험' id='exam-dropdown'>
                        <Link to='/testinfo' className='dropdown-item'>일정정보</Link>
                        <Link to='/testinfo/book' className='dropdown-item'>최신서적</Link>
                        {/* 다른 시험과 관련된 링크들 추가 가능 */}
                    </NavDropdown>
                    <Link to='/yotube' className='nav-link'>강의</Link>
                </Nav>
                <Nav>
                    {loggedIn ? (
                        <>
                            <NavbarText className='text-white' onClick={GoMyPage}  style={{ cursor: 'pointer' }}>{`${user.name}님 환영합니다👋`}</NavbarText>
                            <Nav.Link onClick={logout}>로그아웃</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link as={Link} to='/user/login'>로그인</Nav.Link>
                    )}
                </Nav>
                </NavbarCollapse>
            </Navbar>
        </>
    );
};

export default Header;