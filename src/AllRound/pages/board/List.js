import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import styled from "styled-components";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const List = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/board/post/list", {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => {setPosts(data)})
    }, []);

    return (
        <div>
            <H2>게시글 목록</H2>
            <hr/>
            <Container fluid>
            <Table className='text-center'>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>카테고리</th>
                    <th>제목</th>
                    <th>작성자</th>
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
                        <td>{post.username}</td>
                        <td>{post.viewCnt}</td>
                        <td>{post.createdDate}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            </Container>
        </div>
    );
};

export default List;