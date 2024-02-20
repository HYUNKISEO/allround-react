import React, {useEffect, useState} from 'react';
import {Col, Container, Row, Table} from "react-bootstrap";
import styled from "styled-components";
import Detail from "../board/Detail";
import Detailprops from "./Detailprops";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const BoardCheck = () => {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8080/board/post/admin`, {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => {
                setPosts(data);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setPosts([]); // 에러 시 빈 배열로 설정
            });
    }, [post]);

    const handleId = (id) => {
        setPost(id)
    }
    return (
        <Container fluid>
            <Row>
                <Col className='col-6'>
                    <H2>{post}번 글 정보</H2><hr/>
                    <div style={{ overflowY: "scroll", height: '79vh' }}>
                    {post && <Detailprops id={post} />}
                    </div>
                </Col>

                <Col className='col-6'>
                    <H2>게시글 목록</H2><hr/>
                    <div style={{ overflowY: "scroll", height: '79vh' }}>
                    <Table className='text-center' hover>
                        <thead className='table-success' style={{ position: "sticky", top: 0, zIndex: 1 }}>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>생성일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {posts.map(post => (
                            <tr key={post.id} onClick={() => handleId(post.id)}>
                                <td>{post.id}</td>
                                <td>{post.subject}</td>
                                <td>{post.user.username}</td>
                                <td>{post.create_time}</td>
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

export default BoardCheck;