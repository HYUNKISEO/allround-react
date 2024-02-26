import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {Button, Container, Form} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import "react-quill/dist/quill.snow.css";
import ReactQuill, {Quill} from "react-quill";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const Write = () => {
    const [post, setPost] = useState({
        userId: 0,
        username: '',
        subject: '',
        content: '',
        category: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const changeValue = (e) => {
        setPost({
            ...post,
            [e.target.name]: e.target.value,
        });
        setErrors({...errors, [e.target.name]: ''})
    };

    const changeValueQuill = (value) => {
        setPost({
            ...post,
            content: value,
        });
        setErrors({...errors, content: ''})
    };

    useEffect(() => {
        const token =localStorage.getItem('token');
        const decode = jwtDecode(token)
        setPost(prevState => ({
            ...prevState,
            username: decode.sub,
            userId: decode.userId
        }))
    }, []);

    const Submit = (e) => {
        e.preventDefault();
        let isValid = true;
        if( !post.category.trim()) {
            isValid = false ;
            setErrors({...errors, category: ' 필수 선택입니다.'});
            return;
        } else if (!post.subject.trim()) {
            isValid = false;
            setErrors({...errors, subject: ' 필수 입력입니다.'});
            return;
        } else if (!post.content.trim() || post.content.trim() == "<p><br></p>") {
            isValid = false;
            setErrors({...errors, content: ' 필수 입력입니다.'});
            return;
        }

        fetch("http://localhost:8080/board/post/save", {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(post)
        })
            .then(response => response.json())
            .then(data => {
                if(data !== null) {
                    alert("작성 성공")
                    navigate(`/board/post/${data.id}`)
                } else {
                    alert('등록 실패!');
                }
            })
    };

    return (
        <Container fluid className="col-md-7">
            <H2>글 쓰기</H2><hr/>
            <Form onSubmit={Submit}>
                <Form.Group className="mb-3" controlId="formBasicCategory">
                    <Form.Label>카테고리</Form.Label>{errors.category && <span className='text-danger'>{errors.category}</span>}
                    <Form.Control as="select" name='category' onChange={changeValue}>
                        <option defaultValue=""> -- 필수로 선택하세요 -- </option>
                        <option value="일반">일반</option>
                        <option value="질문">질문</option>
                        <option value="스터디">스터디</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSubject">
                    <Form.Label>제목</Form.Label>{errors.subject && <span className='text-danger'>{errors.subject}</span>}
                    <Form.Control
                        type="text"
                        placeholder="제목 입력"
                        onChange={changeValue}
                        name='subject'
                    />
                </Form.Group>
                <Form.Group>
                <Form.Label>내용</Form.Label>{errors.content && <span className='text-danger'>{errors.content}</span>}
                <ReactQuill
                    style={{height: '50vh'}}
                    name='content'
                    onChange={changeValueQuill}
                    theme='snow'
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
                    }}>
                </ReactQuill>
                </Form.Group>

                <Form.Group style={{marginTop: '8vh', display: 'flex', justifyContent: 'flex-end'}}>
                    <Button variant='white' className="me-2 btn-outline-success" type="submit">
                        작성완료
                    </Button>
                    <Button
                        variant='white' className="me-2 btn-outline-success"
                        onClick={() => {
                            navigate('/board/list');
                        }}
                    >
                        목록
                    </Button>
                </Form.Group>
            </Form>
        </Container>
    );

};

export default Write;