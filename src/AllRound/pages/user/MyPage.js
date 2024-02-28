import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Header from "../../components/Header";


const UserInfoRow = ({ label, value }) => (
    <tr>
        <th style={{ whiteSpace: 'nowrap', letterSpacing: '0.2rem', textAlign: 'center', fontSize: '2vh'}}>{label}</th>
        <td className='p-2' style={{ textAlign: 'center', fontSize: '2vh'}} >
            {label === '연 락 처' && value ? value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : value}</td>
    </tr>
);

const H2 = styled.h2`
  text-align: center;
  color: green;
  font-weight: bold;
  /* 여러 다른 스타일 속성들을 추가할 수 있습니다. */
`;

const MyPage = () => {
    const [user, setUser] = useState({
        id:0,
        username:'',
        name: '',
        dob:'',
        phone:'',
        createdTime:''
    });
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [info, setInfo] = useState({
        userId: user.id,
        password: '',
        newpassword: '',
        repassword: '',
        phone:'',
    });
    const [question, setQuestion] = useState([]);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');

        // 토큰을 디코딩하여 username 추출
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        fetch(`http://localhost:8080/user/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
                // 다른 필요한 헤더도 추가할 수 있음
            }
        })
            .then(response => response.json())
            .then(data => {
                setUser({
                    id: data.id,
                    username: data.username,
                    name: data.name,
                    dob: data.dob,
                    phone: data.phone,
                    createdTime: data.create_time
                })
            })
        fetch("http://localhost:8080/board/post/mylist/" + decodedToken.userId, {
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
            .then(reponse => reponse.json())
            .then(data => setPosts(data))

        fetch("http://localhost:8080/share/question/mylist/" + decodedToken.userId, {
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
            .then(reponse => reponse.json())
            .then(data => setQuestion(data))
    }, []);

    const handleShowForm = () => {
        setShowForm(prevShowForm => !prevShowForm);
    };

    const changeValue = (e) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value,
            userId: user.id,
        });
        setErrors({...errors, [e.target.name]: ''})
    }

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        let isValid = true;
        if(info.phone && !info.phone.trim().match(/^[0-9]{10,11}$/)) {
            isValid = false ;
            setErrors({...errors, phone: '10~11자리 숫자만 입력하세요.'});
        } else if (info.newpassword != info.repassword) {
            isValid = false;
            setErrors({...errors, newpassword: '비밀번호와 확인이 맞지 않습니다.'});
        } else if (!info.newpassword.trim()) {
            isValid = false;
            setErrors({...errors, newpassword: ' 필수 입력입니다.'});
        } else if (!info.repassword.trim()) {
            isValid = false;
            setErrors({...errors, repassword: '필수 입력입니다.'});
        } else if (!info.password.trim()){
            isValid = false;
            setErrors({...errors, password: '필수 입력입니다.'})
        } else if (info.password === info.newpassword){
            isValid = false;
            setErrors({...errors, newpassword: '현재 비밀번호와 같을 수 없습니다.'})
        }
        if(!isValid){
            return;
        }

        fetch("http://localhost:8080/user/update", {
            method: "PUT",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(info)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        alert(data.message)
                    })
                }
                return response.json();
            })
            .then(data => {
                if(data != null){
                    alert("정보가 변경되어 로그아웃 됩니다.")
                    navigate("/user/login")
                    localStorage.removeItem('token')
                }
            })
    }

    const removeUser = () => {
        if(window.confirm("정말로 삭제하시겠습니까?")){
        fetch("http://localhost:8080/user/delete/" + user.id, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                if (data == '1') {
                    alert('삭제 성공', data);
                    navigate('/');
                    localStorage.removeItem('token')
                    window.location.reload()
                } else {
                    alert('삭제실패', data);
                }
            });}
    }

    return (
        <Container fluid className='mt-4'>
            <Row>
                <Col sm={12} md={6} style={{borderRight: '1px solid #CCCCCC', paddingRight: '2vh'}}>
                    <H2>회원 정보</H2>
                    <hr/>
                    <Table  bordered hover className='mt-3'>
                        <tbody>
                        <UserInfoRow label="회원번호" value={user.id} />
                        <UserInfoRow label="아 이 디" value={user.username} />
                        <UserInfoRow label="이&nbsp;&nbsp;&nbsp;&nbsp;름" value={user.name} />
                        <UserInfoRow label="생년월일" value={user.dob} />
                        <UserInfoRow label="연 락 처" value={user.phone} />
                        <UserInfoRow label="가 입 일" value={user.createdTime} />
                        </tbody>
                    </Table>
                    <div className='d-grid gap-2'>
                        <Button variant="success text-white" onClick={handleShowForm}>
                            회원 수정
                        </Button>
                        <Button variant="danger" onClick={removeUser}>
                            회원 탈퇴
                        </Button>
                    </div>

                    <H2 className='mt-3'> 회원정보 수정</H2><hr/>
                    {!showForm  && <div style={{textAlign: 'center', fontSize: '19vh', letterSpacing: '-0.1em' ,lineHeight: '0.8', fontWeight: 'bold' }}><div>ALL</div><div>ROUND</div></div>}
                    {showForm && (
                        <Form className='mt-3'>
                            <Form.Group controlId='formContact'>
                                <Form.Label>연락처</Form.Label>{errors.phone && <span className='text-danger'>{errors.phone}</span>}
                                <Form.Control
                                    type='text'
                                    placeholder='숫자만 입력하세요.'
                                    name='phone'
                                    onChange={changeValue}
                                />
                            </Form.Group>

                            <Form.Group controlId='nowPassword'>
                                <Form.Label>현재 비밀번호</Form.Label>{errors.password && <span className='text-danger'>{errors.password}</span>}
                                <Form.Control
                                    type='password'
                                    placeholder='현재 비밀번호를 입력하세요.'
                                    name='password'
                                    onChange={changeValue}
                                />
                            </Form.Group>

                            <Form.Group controlId='formNewPassword'>
                                <Form.Label>새 비밀번호</Form.Label>{errors.newpassword && <span className='text-danger'>{errors.newpassword}</span>}
                                <Form.Control
                                    type='password'
                                    placeholder='새 비밀번호를 입력하세요.'
                                    name='newpassword'
                                    onChange={changeValue}
                                />
                            </Form.Group>

                            <Form.Group controlId='formRePassword'>
                            <Form.Label>비밀번호 확인</Form.Label>{errors.repassword && <span className='text-danger'>{errors.repassword}</span>}
                            <Form.Control
                                type='password'
                                placeholder='새 비밀번호를 입력하세요.'
                                name='repassword'
                                onChange={changeValue}
                            />
                            </Form.Group>
                            <div className='d-grid gap-1 mt-2 mb-1'>
                            <Button variant='success' onClick={handleUpdateProfile}>
                                저장
                            </Button>
                            </div>
                        </Form>)}
                </Col>

                <Col sm={12} md={6}>
                    <Row>
                        <Col>
                            <H2>나의 게시글 목록</H2><hr/>
                            <div style={{height: "40vh", overflowY: "auto"}}>
                            <Table className='text-center'>
                                <thead className='table-success' style={{ position: "sticky", top: "0", zIndex: "1" }}>
                                <tr>
                                    <th>번호</th>
                                    <th>카테고리</th>
                                    <th>제목</th>
                                    <th>조회수</th>
                                    <th>작성일</th>
                                </tr>
                                </thead>
                                <tbody>
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.id}</td>
                                        <td>{post.category}</td>
                                        <td><Link to={`/board/post/${post.id}`}>{post.subject}</Link></td>
                                        <td>{post.viewCnt}</td>
                                        <td>{post.createTime}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col style={{ marginTop: '20px' }}>
                            <H2>나의 공유문제 목록</H2>
                            <div style={{height: "40vh", overflowY: "auto"}}>
                                <Table className='text-center'>
                                    <thead className='table-success' style={{ position: "sticky", top: "0", zIndex: "1" }}>
                                    <tr>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>조회수</th>
                                        <th>작성일</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {question.map(q => (
                                        <tr key={q.id}>
                                            <td>{q.id}</td>
                                            <td><Link to={`/share/detail/${q.id}`}>{q.question}</Link></td>
                                            <td>{q.viewCnt}</td>
                                            <td>{q.createTime}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default MyPage;