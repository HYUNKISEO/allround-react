import React, {useEffect, useRef, useState} from 'react';
import {json, Link, useNavigate, useParams} from "react-router-dom";
import {Button, Container, Form, Table} from "react-bootstrap";
import styled from "styled-components";
import ReactQuill from "react-quill";
import {jwtDecode} from "jwt-decode";
import "react-quill/dist/quill.snow.css";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const Detail = () => {
    let {id} = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState({});
    const [reset, setReset] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/board/post/detail/' + id)
            .then(response => response.json())
            .then(data => {
                setPost(data);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/board/comment/list", {
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
            postId: id
        });
    };

    const submit = (e) => {
        e.preventDefault()
        if(!comment.text.trim()) {
            alert("내용을 입력해 주세요.")
            return;
        }
        fetch("http://localhost:8080/board/comment/save", {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(comment)
        })
            .then(response => response.json())
            .then(data => {
                if(data != null){
                    alert("작성 성공")
                    setReset(data)
                }
            })
    }

    const deletePost = () => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?")
        if(confirmed) {
            fetch("http://localhost:8080/board/post/delete/" + id, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    if (data == '1') {
                        alert('삭제 성공', data);
                        navigate('/board/list');
                    } else {
                        alert('삭제실패', data);
                    }
                });
        }
    }

    const deleteComment = (check) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?")
        if(confirmed) {
            fetch("http://localhost:8080/board/comment/delete/" + check, {
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

    const token = localStorage.getItem('token')
    const decode = jwtDecode(token)
    const checkId = decode.auth = 'ROLE_ADMIN' || (post.userId === decode.userId)
    const checkId2 = decode.auth = 'ROLE_ADMIN' || (comments.map(c => (c.userId === decode.userId)))

    return (
        <div>
            <Container fluid>
            <H2>{id}번 글 정보</H2><hr/>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>조회수: <strong>{post.viewCnt}</strong></p>
                    <span>작성일: {post.createTime}</span>
                </div>
                <Form>
                    {/* 작성자 정보 */}
                    <Form.Group className="mb-1" controlId="formBasicUser">
                        <Form.Label>작성자</Form.Label>
                        <Form.Control
                            type="text"
                            value={post.username}  // 작성자 정보를 리드온리로 보여줌
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCategory">
                        <Form.Label>카테고리</Form.Label>
                        <Form.Control
                            name='category'
                            value={post.category}
                            readOnly>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicSubject">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="제목 입력"
                            name='subject'
                            readOnly
                            value={post.subject}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>내용</Form.Label>
                        <ReactQuill
                            style={{height: '50vh'}}
                            name='content'
                            theme='snow'
                            readOnly
                            value={post.content}
                            modules={{
                                toolbar: [
                                    [{ 'font': [] }, { 'size': [] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'header': 1 }, { 'header': 2 }, 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'align': [] }],
                                    ['link'],
                                    ['code-block'],
                                ],
                            }}
                        ></ReactQuill>
                    </Form.Group>

                    <Form.Group style={{marginTop: '8vh', display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            variant="white"
                            className="btn btn-outline-success me-2"
                            onClick={() => {
                                navigate('/board/list');
                            }}
                        >
                            목록
                        </Button>
                        {checkId && (
                        <Button
                            variant="white"
                            className="btn btn-outline-success me-2"
                            onClick={() => {navigate('/board/update/' + id);}}
                        >
                            수정
                        </Button>)}
                        {checkId && (
                        <Button
                            variant="white"
                            className="btn btn-outline-danger me-2"
                            onClick={() => deletePost()}
                        >
                            삭제
                        </Button>)}
                        <Button
                            variant="white"
                            className="btn btn-outline-success me-2"
                            onClick={() => {
                                navigate('/board/write');
                            }}
                        >
                            작성
                        </Button>
                    </Form.Group>
                </Form>
            </Container>

            <Container fluid>
                <div className="mb-1 mt-3">
                    <label>댓글: <span><strong>{comments.length}</strong></span> 개</label>

                    <div className="input-group my-2">
                        <Form.Control type="text" name="text" onChange={changeValue}/>
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
                                {checkId2 && (<td><Button type="button" className="btn btn-danger btn-sm" onClick={() => deleteComment(c.id)}>삭제</Button></td>)}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default Detail;