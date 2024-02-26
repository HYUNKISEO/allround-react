import React, {useEffect, useState} from 'react';
import {Nav, Navbar, NavbarCollapse, NavbarText, NavbarToggle, NavDropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "./Header.css";

const Header = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
            setLoggedIn(true);
        } else {
            setLoggedIn(false)
        }

        // 15초마다 실행될 작업
        const intervalId = setInterval(() => {
            // 여기에 수행할 작업을 넣으세요.
            console.log('작업 실행');
        }, 10000);

        // 컴포넌트가 언마운트될 때 clearInterval로 인터벌을 정리합니다.
        return () => clearInterval(intervalId);
    }, [loggedIn]);

    const logout = () => {
        localStorage.removeItem('token')
        setLoggedIn(false);
        navigate("/")
        alert("Logout 완료")
        window.location.reload()
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
                    <Link to='/basic' className='nav-link'>기본문제</Link>
                    <Link to='/share/list' className='nav-link'>공유문제</Link>
                    <Link to='/board/list' className='nav-link'>게시판</Link>
                    <NavDropdown title='시험정보' id='exam-dropdown' style={{zIndex: "1000"}}>
                        <Link to='/testinfo' className='dropdown-item'>일정정보</Link>
                        <Link to='/testinfo/book' className='dropdown-item'>최신서적</Link>
                    </NavDropdown>
                    <Link to='/tutorial' className='nav-link' style={{zIndex: "1000"}}>강의정보</Link>
                </Nav>
                <Nav>
                    {user.auth === "ROLE_ADMIN,ROLE_MEMBER" && <Nav.Link as={Link} to='/admin' className='nav-link' style={{zIndex: "1000"}}>관리자 페이지</Nav.Link>}
                    {loggedIn ? (
                        <>
                            <NavbarText className='text-white' onClick={GoMyPage}  style={{ cursor: 'pointer' }}>{`${user.sub}님 환영합니다👋`}</NavbarText>
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