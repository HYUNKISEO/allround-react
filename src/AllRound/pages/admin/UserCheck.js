import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import styled from "styled-components";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const UserInfoRow = ({ label, value }) => (
    <tr>
        <th style={{ width: '100px', textAlign: 'right', marginRight: '10px', fontWeight: 'bold'}}>{label}:</th>
        <td style={{ flexGrow: 1 }}>{label === '연 락 처' && value ? value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : value}</td>
    </tr>)

const UserCheck = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/user/list", {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setUsers(data))
    }, [user]);
    console.log(user)

    const detailCheck = (id) => {
        fetch("http://localhost:8080/user/detail/" + id, {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setUser(data))
    }

    const addAuth = (id) => {
        fetch("http://localhost:8080/user/admin/addauth/" + id, {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setUser(data))
    }

    const removeAuth = (id) => {
        fetch("http://localhost:8080/user/admin/removeauth/" + id, {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setUser(data))
    }

    const formChange = () => {
        setShowForm(prevShowForm => !prevShowForm)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            id:user.id,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       if (!formData.password){
           setFormData(prevFormData => ({...prevFormData, password: user.password}))
       }else if(!formData.dob){
           setFormData(prevFormData => ({...prevFormData, dob: user.dob}))
       }else if(!formData.name){
           setFormData(prevFormData => ({...prevFormData, name: user.name}))
       }else if(!formData.phone){
           setFormData(prevFormData => ({...prevFormData, phone: user.phone}))
       }
       fetch("http://localhost:8080/user/admin/update", {
           method: "PUT",
           headers: {'Content-Type': 'application/json;charset=utf-8'},
           body: JSON.stringify(formData)
       })
           .then(response => response.json())
           .then(data => {detailCheck(data.id)})
        setShowForm(false);
    };

    const removeUser = (id) => {
        fetch("http://localhost:8080/user/delete/" + id, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                if (data == '1') {
                    alert('삭제 성공', data);
                } else {
                    alert('삭제실패', data);
                }
            });
    }

    return (
        <Container fluid>
            <Row>
                <Col className='col-6'>
                    <H2>회원 상세정보</H2><hr/>
                    <Table bordered hover style={{ textAlign: 'center'}}>
                        <tbody>
                        <UserInfoRow label="회원번호" value={user.id} />
                        <UserInfoRow label="아 이 디" value={user.username} />
                        <UserInfoRow label="이&nbsp;&nbsp;&nbsp;&nbsp;름" value={user.name} />
                        <UserInfoRow label="권 한 1" value={user.authorities && user.authorities[0].name} />
                        <UserInfoRow label="권 한 2" value={user.authorities && user.authorities[1] && user.authorities[1].name} />
                        <UserInfoRow label="생년월일" value={user.dob} />
                        <UserInfoRow label="연 락 처" value={user.phone} />
                        <UserInfoRow label="생 성 일" value={user.create_time} />
                        </tbody>
                    </Table>

                    {!showForm  &&<div className='d-grid gap-2'>
                        <Button className='btn-success' onClick={() => addAuth(user.id)}>권한 추가</Button>
                        <Button className='btn-success' onClick={() => removeAuth(user.id)}>권한 삭제</Button>
                        <Button className='btn-success' onClick={() => formChange()}>정보 변경</Button>
                        <Button className='btn-danger' onClick={() => removeUser(user.id)}>회원 삭제</Button>
                    </div>}
                    {showForm &&
                        <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-2'>
                            <Form.Label>비밀번호:</Form.Label>
                            <Form.Control type='password' name='password' onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Form.Label>이름:</Form.Label>
                            <Form.Control type='text' name='name' onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Form.Label>생년월일:</Form.Label>
                            <Form.Control type='date' name='dob' onChange={handleChange} max={new Date().toISOString().split('T')[0]}/>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Form.Label>연락처:</Form.Label>
                            <Form.Control type='tel' name='phone' onChange={handleChange}/>
                        </Form.Group>
                            <div  className='d-grid gap-1'>
                        <Button className='btn-warning text-white' onClick={() => formChange()}>돌아 가기</Button>
                        <Button className='btn-success' type='submit'>수정 하기</Button>
                            </div>
                        </Form>}
                </Col>

                <Col className='col-6'>
                    <H2>회원 목록</H2><hr/>
                    <div style={{ overflowY: "scroll", height: '79vh' }}>
                    <Table className='text-center' hover>
                        <thead className='table-success' style={{ position: "sticky", top: 0, zIndex: 1 }}>
                        <tr>
                            <th>번호</th>
                            <th>아아디</th>
                            <th>이름</th>
                            <th>생성일</th>
                        </tr>
                        </thead>
                        <tbody style={{position: 'sticky'}}>
                        {users.map(user => (
                            <tr key={user.id} onClick={() => detailCheck(user.id)}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>{user.create_time}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default UserCheck;