import React, {useEffect, useState} from 'react';
import {Button, Container, Form, FormLabel, Table} from "react-bootstrap";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const BasicCheck = () => {
    const [basics, setBasics] = useState([]);
    const [basic, setBasic] = useState([]);
    const [id, setId] = useState(1);
    const [reset, setRset] = useState([]);
    const [formData, setFormData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/basic/questions/list', {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setBasics(data.content))

        fetch('http://localhost:8080/basic/questions/admin/' + id, {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setBasic(data))

    }, [id, reset]);

    const setIdAndName = (id) => {
        setId(id);
    };

    const formChange = () => {
        setShowForm(prevShowForm => !prevShowForm)
    }


    const deleteQuestion = (a) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?")
        if(confirmed) {
            fetch("http://localhost:8080/basic/questions/delete/" + a, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                        alert("삭제 완료")
                        setRset(data)
                });
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/basic/questions/admin/save', {
            method: "POST",
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if(data != null){
                    alert("추가 성공!")
                    setRset(data)
                    formChange();
                    setId(data.questionId)
                } else {
                    alert("추가 실패")
                }
            })
    }

    return (
        <Container fluid style={{display: "flex"}}>
            {!showForm && <div style={{flex: "1.2", overflowY: "scroll", height: '79vh'}}>
                        <H2>문제 정보</H2><hr/>
                    <Table className='table-bordered'>
                        <tbody>
                        <tr>
                            <td><strong>번 호:</strong></td>
                            <td style={{textAlign: 'center'}}>{basic.questionId}</td>
                        </tr>
                        <tr>
                            <td><strong>제 목:</strong></td>
                            <td style={{textAlign: 'center'}}>{basic.title}</td>
                        </tr>
                        <tr>
                            <td><strong>내 용:</strong></td>
                            <td style={{textAlign: 'center'}}>{basic.description}</td>
                        </tr>
                        <tr>
                            <td><strong>입 력:</strong></td>
                            <td style={{textAlign: 'center'}}>{basic.example_Input}</td>
                        </tr>
                        <tr>
                            <td><strong>출 력:</strong></td>
                            <td style={{textAlign: 'center'}}>{basic.example_Output}</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Button className='btn-success mt-3' style={{width:"100%"}} onClick={() => formChange()}>작성하기</Button>
                    <Button className='btn-danger mt-3' style={{width:"100%"}} onClick={() => deleteQuestion(id)}>삭제하기</Button>
            </div>}
            {showForm && <div style={{flex: "1.2", height: '79vh', marginRight: "3vh"}}>
                <H2>문제 추가하기</H2><hr/>
                <Form onSubmit={submit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>제목</Form.Label>
                        <Form.Control as="textarea"  rows={3} placeholder="제목을 입력하세요." name="title" onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea" placeholder="내용을 입력하세요." rows={5} name="description" onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="formExampleInput">
                        <Form.Label>입력 </Form.Label>
                        <Form.Control as="textarea" rows={4} placeholder="입력 예시를 입력하세요." name="example_Input" onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="formExampleOutput">
                        <Form.Label>출력</Form.Label>
                        <Form.Control as="textarea" rows={4} placeholder="출력 예시를 입력하세요." name="example_Output" onChange={handleChange} required/>
                    </Form.Group>
                    <Button className='btn-warning text-white mt-2' style={{width: "100%"}} onClick={() => formChange()}>돌아 가기</Button>
                    <Button className='btn-success mt-2' type='submit' style={{width: "100%"}}>추가 하기</Button>
                </Form>
            </div>
            }
            <div style={{flex: "0.8" , overflowY: "scroll", height: '79vh'}}>
                <H2>기본문제 리스트</H2><hr/>
                <Table className='text-center'>
                    <thead className='table-success'>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                    </tr>
                    </thead>
                    <tbody>
                    {basics.map((v) => (
                        <tr key={v.questionId} onClick={() => setIdAndName(v.questionId)}>
                            <td>{v.questionId}</td>
                            <td>{v.title}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

        </Container>
    );
};

export default BasicCheck;