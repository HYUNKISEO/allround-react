import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Button, Container, Pagination, Table} from "react-bootstrap";
import styled from "styled-components";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const List = () => {
    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [sortOption, setSortOption] = useState('기본'); // 정렬 옵션 추가
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/board/post/list?pageNumber=${pageNumber}&pageSize=12&sort=${sortOption}`, {
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
    }, [pageNumber, sortOption]);

    const WritePage = () => {
        navigate('/board/write');
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handlePageChange = (newPageNumber) => {
        const parsedNumber = parseInt(newPageNumber, 10)
        if(!isNaN(parsedNumber) && newPageNumber !== pageNumber) {
            setPageNumber(newPageNumber);
        }
    };


    return (
        <div>
            <H2>게시글 목록</H2>
            <hr/>
            <Container fluid>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {posts.length > 0 && <p>총 게시물: <strong>{posts[0].totalCount}</strong></p>}
                    <span>
                        <span>정렬: </span>
                         <select value={sortOption} onChange={handleSortChange}>
                            <option value="기본">기본</option>
                            <option value="조회순">조회순</option>
                            <option value="일반">일반</option>
                            <option value="질문">질문</option>
                            <option value="스터디">스터디</option>
                         </select>
                    </span>
                </div>
            <Table className='text-center'>
                <thead className='table-success'>
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
                        <td>{post.createTime}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant='white' className="me-2 btn-outline-success " onClick={WritePage} >
                        작성
                    </Button>
                </div>

                {posts.length > 0 && posts[0]?.totalCount && (
                    <Pagination
                        className="mt-3"
                        size="md"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Pagination.Prev
                            onClick={() => handlePageChange(pageNumber - 1)}
                            disabled={pageNumber === 0}
                        />
                        {[...Array(Math.ceil(posts[0].totalCount / 12)).keys()].map((number) => (
                            <Pagination.Item
                                key={number + 1}
                                active={number === pageNumber}
                                onClick={(event) => handlePageChange(Number(event.target.text) - 1)}
                            >
                                {number + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(pageNumber + 1)}
                            disabled={pageNumber === Math.ceil(posts[0].totalCount / 12) - 1}
                        />
                    </Pagination>
                )}
            </Container>
        </div>
    );
};

export default List;