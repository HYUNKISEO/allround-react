import React, {useEffect, useState} from 'react';
import {Button, Container, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const ShareCheck = () => {
    const [question, setQuestion] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [id, setId] = useState(0);
    const [comments, setComments] = useState([]);
    const [reset, setRset] = useState([]);
    const [name, setName] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/share/question/detail/' + id, {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setQuestion(data))

        fetch('http://localhost:8080/share/question/list' ,{
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setQuestions(data))
        fetch("http://localhost:8080/share/comment/list", {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(id)
        })
            .then(response => response.json())
            .then(data => {
                setComments(data);
            });
    }, [reset, id]);

    const DeleteComment = (a) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?")
        if(confirmed) {
            fetch("http://localhost:8080/share/comment/delete/" + a, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    if(data == "1"){
                        alert("삭제 완료")
                        setRset(data)
                    }
                });
        }
    }

    const deleteQuestion = (a) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?")
        if(confirmed) {
            fetch("http://localhost:8080/share/question/delete/" + a, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    if(data == "1"){
                        alert("삭제 완료")
                        setRset(data)
                    }
                });
        }
    }
    const setIdAndName = (id, name) => {
        setId(id);
        setName(name);
    };

    return (
        <Container fluid style={{display: "flex", marginTop: "10px"}}>
            <div style={{flex: "1", overflowY: "scroll", height: '79vh'}}>
                <H2>{question.id}문제 정보</H2><hr/>
                <Table className='table-bordered'>
                    <tbody>
                    <tr>
                        <td><strong>번 호:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.id}</td>
                    </tr>
                    <tr>
                        <td><strong>작성자:</strong></td>
                        <td style={{textAlign: 'center'}}>{name}</td>
                    </tr>
                    <tr>
                        <td><strong>질 문:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.question}</td>
                    </tr>
                    <tr>
                        <td><strong>입 력:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.input}</td>
                    </tr>
                    <tr>
                        <td><strong>출 력:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.output}</td>
                    </tr>
                    <tr>
                        <td><strong>예제 입력:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.exampleInput}</td>
                    </tr>
                    <tr>
                        <td><strong>예제 출력:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.exampleOutput}</td>
                    </tr>
                    <tr>
                        <td><strong>코멘트:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.comment}</td>
                    </tr>
                    <tr>
                        <td><strong>정 답:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.answer}</td>
                    </tr>
                    <tr>
                        <td><strong>추천수:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.likeCnt}</td>
                    </tr>
                    <tr>
                        <td><strong>조회수:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.viewCnt}</td>
                    </tr>
                    <tr>
                        <td><strong>작성일:</strong></td>
                        <td style={{textAlign: 'center'}}>{question.createTime}</td>
                    </tr>
                    </tbody>
                </Table>
                <div>
                    <strong style={{marginRight: '10px'}}>코멘트:</strong>
                    {comments.length > 0 && (
                        <table className='table table-bordered'>
                            <thead>
                            <tr>
                                <th>댓글</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {comments.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.text}</td>
                                    <td>{v.username}</td>
                                    <td>{v.createTime}</td>
                                    <td><Button className='btn btn-danger btn-sm' onClick={() => DeleteComment(v.id)}>삭제</Button></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <Button className='btn btn-success mt-4' style={{width: '100%'}} onClick={() => navigate('/share/detail/' + question.id)}>상세페이지</Button>
                <Button className='btn btn-danger mt-2' style={{width: '100%'}} onClick={() => deleteQuestion(question.id)}>삭제하기</Button>
            </div>
            <div style={{flex: "1" , overflowY: "scroll", height: '79vh'}}>
                <H2>공유문제 리스트</H2><hr/>
                <Table>
                    <thead className='table-success'>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((v) => (
                        <tr key={v.id} onClick={() =>  setIdAndName(v.id, v.user.name)}>
                            <td>{v.id}</td>
                            <td>{v.question}</td>
                            <td>{v.user.username}</td>
                            <td>{v.create_time}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default ShareCheck;