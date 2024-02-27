import React, {useState} from 'react';
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import MonacoEditor from "@monaco-editor/react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;


const SWrite = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState([]);
    const [errors, setErrors] = useState({});

    const changeAnswer = (e) => {
        setQuestion((prevQuestion) => ({...prevQuestion, [e.target.name] : e.target.value}))
    }

    const changeEditorAnswer = (e) => {
        const token = localStorage.getItem('token')
        const decode = jwtDecode(token)
        setQuestion((prevQuestion) => ({...prevQuestion, answer : e, userId: decode.userId}))
    }

    const saveQuestion = (e) => {
        e.preventDefault();
        let isValid = true;
        if( !question.question.trim()) {
            isValid = false ;
            setErrors({...errors, question: ' 필수 입력입니다.'});
            return;
        } else if (!question.input.trim()) {
            isValid = false;
            setErrors({...errors, input: ' 필수 입력입니다.'});
            return;
        } else if (!question.output.trim()) {
            isValid = false;
            setErrors({...errors, output: ' 필수 입력입니다.'});
            return;
        } else if (!question.comment.trim()) {
            isValid = false;
            setErrors({...errors, comment: '필수 입력입니다.'})
            return;
        } else if (!question.answer.trim()) {
            isValid = false;
            setErrors({...errors, answer: '필수 입력입니다.'})
            return;
        } else if (!question.exampleInput || !question.exampleOutput){
            isValid = false;
            setErrors({...errors, example: '없으면 "없음" 작성해주세요.'})
            return;
        }

        fetch('http://localhost:8080/share/question/save', {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(question)
        })
            .then(response => response.json())
            .then(data => {
                navigate('/share/detail/' + data.id)

            })
    }

    return (
        <Container fluid >
            <Row style={{display: "flex"}}>
                <H2>공유문제 만들기</H2>
                <hr/>
                <Col md={6} style={{flex: '1'}}>
                    <Form onSubmit={saveQuestion} style={{width: '97vh', height: '72vh'}}>
                        <Form.Group controlId="formProblem">
                            <Form.Label>문제</Form.Label> {errors.question && <span className='text-danger'>{errors.question}</span>}
                            <Form.Control type="text" as='textarea' rows={5} name="question" onChange={changeAnswer}/>
                        </Form.Group>

                        <Form.Group controlId="formExampleInput" className='mt-3'>
                            <Form.Label>입력</Form.Label>{errors.input && <span className='text-danger'>{errors.input}</span>}
                            <Form.Control type="text" as='textarea' rows={2} name='input' onChange={changeAnswer}/>
                        </Form.Group>

                        <Form.Group controlId="formExampleOutput">
                            <Form.Label>출력</Form.Label>{errors.output && <span className='text-danger'>{errors.output}</span>}
                            <Form.Control type="text" as='textarea' rows={2} name='output' onChange={changeAnswer}/>
                        </Form.Group>

                        <Form.Group controlId="formInput" className='mt-3'>
                            <Form.Label>예제입력</Form.Label>{errors.example && <span className='text-danger'>{errors.example}</span>}
                            <Form.Control type="text" name='exampleInput' onChange={changeAnswer}/>
                        </Form.Group>

                        <Form.Group controlId="formOutput">
                            <Form.Label>예제출력</Form.Label>{errors.example && <span className='text-danger'>{errors.example}</span>}
                            <Form.Control type="text" name='exampleOutput' onChange={changeAnswer}/>
                        </Form.Group>

                        <Form.Group controlId="formComment" className='mt-3'>
                            <Form.Label>작성자 한마디.. 및 힌트</Form.Label>{errors.comment && <span className='text-danger'>{errors.comment}</span>}
                            <Form.Control type="text" as='textarea' rows={3} name='comment' onChange={changeAnswer}/>
                        </Form.Group>
                        <Button className='btn-success mb-3 mt-3' style={{width: '100%'}} type='submit'>작성완료</Button>
                        <Button style={{width: '100%'}} onClick={() => navigate('/share/list')}>목록으로</Button>
                    </Form>
                </Col>
                <Col md={6} style={{flex: '1', position: 'relative'}}>
                    <div style={{width: '97vh', height: '81vh', display: 'flex', flexDirection: 'column', position: 'relative'}}>
                        {errors.answer && <span className='text-danger'>{errors.answer}</span>}
                        <MonacoEditor
                            width="100%"
                            height="100%"
                            language="java"
                            theme="hc-black"
                            onChange={(value) => changeEditorAnswer(value)}
                            options={{
                                selectOnLineNumbers: true,
                                scrollBeyondLastLine: false,
                                fontSize: 15,
                                formatOnType: true,
                                formatOnPaste: true,
                                formatOnSave: true,
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
export default SWrite;