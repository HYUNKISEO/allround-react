import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Button, Container, Form} from "react-bootstrap";
import styled from "styled-components";
import ReactQuill from "react-quill";

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
    console.log(post)

    useEffect(() => {
        fetch('http://localhost:8080/board/post/detail/' + id)
            .then(response => response.json())
            .then(data => {
                setPost(data);
            });
    }, []);

    return (
        <Container fluid>
            <H2>{id}번 글 정보</H2><hr/>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>조회수: {post.viewCnt}</p>
                <span>작성일: {post.createTime}</span>
            </div>
            <Form>
                {/* 작성자 정보 */}
                <Form.Group className="mb-3" controlId="formBasicUser">
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
                        readOnly
                        value={post.content}
                        modules={{
                            toolbar: []
                        }}
                    ></ReactQuill>
                </Form.Group>

                <Form.Group style={{marginTop: '6vh', display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        variant="white"
                        className="btn btn-outline-success me-2"
                        onClick={() => {navigate('/board/update/' + id);}}
                    >
                        수정
                    </Button>
                    <Button
                        variant="white"
                        className="btn btn-outline-success me-2"
                        onClick={() => {
                            navigate('/list');
                        }}
                    >
                        목록
                    </Button>
                    <Button
                        variant="white"
                        className="btn btn-outline-danger me-2"
                    >
                        삭제
                    </Button>
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
    );
};

export default Detail;