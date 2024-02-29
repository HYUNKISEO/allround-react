import React, {useEffect, useState} from 'react';
import {json, useNavigate, useParams} from "react-router-dom";
import {Button, CloseButton, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import styled from "styled-components";
import MonacoEditor, {DiffEditor} from "@monaco-editor/react";
import {jwtDecode} from "jwt-decode";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const SDetail = () => {
    const token = localStorage.getItem('token')
    const decode = jwtDecode(token)
    const {id} = useParams();
    const [question, setQuestion] = useState([]);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);
    const [reset, setReset] = useState("");
    const [userAnswer, setUserAnsewer] = useState({
        userId: decode.userId,
        questionId : id,
        userAnswer: ''
    });
    const [user, setUser] = useState([]);
    const [checkA, setCheckA] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/share/question/detail/' + id)
            .then(response => response.json())
            .then(data => {
                setQuestion(data)
            })

        fetch('http://localhost:8080/share/answer/detail', {
            method: "post",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                userId: decode.userId,
                questionId: id
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                if(!data.trim() || data.toLowerCase() === 'null'){
                    setUser(null)
                } else {
                    const jsonData = JSON.parse(data);
                    setUser(jsonData)
                }
            })
    }, [reset]);

    useEffect(() => {
        fetch("http://localhost:8080/share/comment/list", {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(id)
        })
            .then(response => response.json())
            .then(data => {
                setComments(data);
            });
    }, [reset]);

    const changeValue = (e) => {
        const token = localStorage.getItem("token")
        const decode = jwtDecode(token);
        setComment({
            ...comment,
            text: e.target.value,
            username: decode.sub,
            userId: decode.userId,
            questionId: id
        });
    };

    const submit = (e) => {
        e.preventDefault()
        if(!comment.text.trim()) {
            alert("내용을 입력해 주세요.")
            return;
        }
        fetch("http://localhost:8080/share/comment/save", {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(comment)
        })
            .then(response => response.json())
            .then(data => {
                alert("작성 성공")
                setReset(data)
                setComment({ text: '' });
            })
    }

    const deletePost = () => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?")
        if(confirmed) {
            fetch("http://localhost:8080/share/question/delete/" + id, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    if (data == '1') {
                        alert('삭제 성공', data);
                        navigate('/share/list')
                    } else {
                        alert('삭제실패', data);
                    }
                });
        }
    }

    const deleteComment = (check) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?")
        if(confirmed) {
            fetch("http://localhost:8080/share/comment/delete/" + check, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    if(data == "1"){
                        alert("삭제 완료")
                        setReset(data)
                    }
                });
        }
    }

    const changeAnswer = (e) => {
        setUserAnsewer((prevUserAnswer) => ({
            ...prevUserAnswer,
            userAnswer: e,
        }));
    }

    const saveCode = () => {
        fetch('http://localhost:8080/share/answer/save', {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(userAnswer)
        })
            .then(response => response.json())
            .then(data => {
                setCheckA(true);
            })
    }
    const handleClose = () => {
        setCheckA(false);
    }

    const checkDelete = (decode.auth === 'ROLE_ADMIN,ROLE_MEMBER');

    return (
        <>
        <Container fluid >
            <Row style={{display: "flex"}}>
            <H2>{question.id} 번 공유문제</H2>
            <hr/>
                <Col md={6} style={{flex: '1'}}>
                    <div className="d-flex justify-content-between">
                        <span>조회수: <strong>{question.viewCnt}</strong></span>
                        <span><img src='https://cdn-icons-png.flaticon.com/512/4369/4369505.png' alt='star' style={{blockSize: '2.5vh'}}/>추천수: <strong>{question.likeCnt}</strong></span>
                        <span>작성일: <strong>{question.createTime}</strong></span>
                    </div>
                    <br />
                    <Form style={{width: '97vh', height: '72vh'}}>
                        <Form.Group controlId="formProblem">
                            <Form.Label>문제</Form.Label>
                            <Form.Control type="text" as='textarea' rows={5} value={question.question} readOnly />
                        </Form.Group>

                        <Form.Group controlId="formExampleInput" className='mt-3'>
                            <Form.Label>입력</Form.Label>
                            <Form.Control type="text" as='textarea' rows={2} value={question.exampleInput} readOnly />
                        </Form.Group>

                        <Form.Group controlId="formExampleOutput">
                            <Form.Label>출력</Form.Label>
                            <Form.Control type="text" as='textarea' rows={2} value={question.exampleOutput} readOnly />
                        </Form.Group>

                        <Form.Group controlId="formInput" className='mt-3'>
                            <Form.Label>예제입력</Form.Label>
                            <Form.Control type="text" value={question.input} readOnly />
                        </Form.Group>

                        <Form.Group controlId="formOutput">
                            <Form.Label>예제출력</Form.Label>
                            <Form.Control type="text" value={question.output} readOnly />
                        </Form.Group>

                        <Form.Group controlId="formComment" className='mt-3'>
                            <Form.Label>작성자 한마디.. 및 힌트</Form.Label>
                            <Form.Control type="text" as='textarea' rows={3} value={question.comment} readOnly />
                        </Form.Group>
                    </Form>
                        <Button style={{width: "100%"}} className='btn-success' onClick={() => navigate('/share/write')}>글 작성하러 가기</Button>
                        <Button style={{width: "100%"}} className='btn-primary mt-1' onClick={() => navigate('/share/list')}>목록 돌아가기</Button>
                </Col>
                <Col md={6} style={{flex: '1', position: 'relative'}}>
                    <div style={{width: '97vh', height: '85.6vh', display: 'flex', flexDirection: 'column', position: 'relative'}}>
                        <MonacoEditor
                            width="100%"
                            height={"100%"}
                            language="java"
                            theme="hc-black"
                            onChange={changeAnswer}
                            value={(decode.userId === question.userId) ? question.answer : (user && user.userAnswer) || ''}
                            options={{
                                selectOnLineNumbers: true,
                                scrollBeyondLastLine: false,
                                fontSize: 15,
                                formatOnType: true,
                                formatOnPaste: true,
                                formatOnSave: true,
                            }}
                        />
                        {checkA && (
                            <div style={{ position: 'absolute', bottom: 63, left: 0, width: '100%', height: '50%', zIndex: 50 }}>
                            <CloseButton variant="danger" onClick={handleClose} style={{backgroundColor: "white"}}/>
                            <DiffEditor
                            original={question.answer}
                        modified={userAnswer.userAnswer}
                        theme='hc-black'
                        width='100%'
                        height='100%'
                        options={{
                            renderSideBySide: true,
                            readOnly: true,
                            colorDecorators: true,
                        }}
                        style={{flex: 1}}
                         />
                        </div>
                        )}
                        {(question.userId !== decode.userId) && <Button className='btn-success' style={{width: '100%'}} onClick={() => saveCode()}>정답 저장하고 비교하기</Button>}
                        {(question.userId === decode.userId || checkDelete) && <Button className='btn-danger mt-1' style={{width: '97vh'}} onClick={() => {deletePost()}}>삭제</Button>}
                    </div>
                </Col>
            </Row>
        </Container>

    <Container fluid><hr/>
        <div className="mb-1 mt-3">
            <label>댓글: <span><strong>{comments.length}</strong></span> 개</label>

            <div className="input-group my-2">
                <Form.Control type="text" name="text" onChange={changeValue} value={comment.text || ''}/>
                <button type="button" className="btn btn-outline-primary" id="btn_comment" onClick={submit}>작성</button>
            </div>

            <Table className="table-hover mt-3 text-center" id="cmt_table">
                <thead>
                <tr>
                    <th style={{width: "16.66%"}}>작성자</th>
                    <th>내용</th>
                    <th style={{width: "16.66%"}}>작성일</th>
                    <th style={{width: "10%"}}>삭제</th>
                </tr>
                </thead>
                <tbody>
                {comments.map(c => (
                    <tr key={c.id}>
                        <td>{c.username}</td>
                        <td>{c.text}</td>
                        <td>{c.createTime}</td>
                        {(c.username === decode.sub || decode.auth === "ROLE_ADMIN,ROLE_MEMBER") && (<td><Button type="button" className="btn btn-danger btn-sm" onClick={() => deleteComment(c.id)}>삭제</Button></td>)}
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    </Container>
    </>
    );
};

export default SDetail;