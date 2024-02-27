import React, {useEffect, useState} from 'react';
import {Button, Container, Table} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const SList = () => {
    const [question, setQuestion] = useState([]);
    const [recommendedMap, setRecommendedMap] = useState({});
    const [like, setLike] = useState({});
    const [sortOption, setSortOption] = useState('기본');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decode = jwtDecode(token);

        fetch("http://localhost:8080/share/question/list", {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        })
            .then(response => response.json())
            .then(data => {
                setQuestion(data)
                data.forEach(item => {
                    if (item.userIds && item.userIds.includes(decode.userId)) {
                        setRecommendedMap((prev) => ({
                            ...prev,
                            [item.id]: true,
                        }));
                        setLike(item.id)
                    }
                })
            })
    }, [like]);

    const handleRecommendationToggle = (id, recommended) => {
        const token = localStorage.getItem('token');
        const decode = jwtDecode(token);

        if(!recommended) {
            fetch(`http://localhost:8080/share/like/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    userId: decode.userId,
                    questionId: id,
                })
            })
                .then(response => response.json())
                .then(data => {
                    setLike(data.id)
                    setRecommendedMap((prev) => ({
                        ...prev,
                        [id]: true,
                    }));
                            })
        } else {
            fetch(`http://localhost:8080/share/like/delete`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    userId: decode.userId,
                    questionId: id
                })
            })
                .then(response => response.text())
                .then(data => {
            setRecommendedMap((prev) => ({
                ...prev,
                [id]: false,
            }));
            setLike(0);
                })
        }
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const sortQuestions = () => {
        let sortedQuestions = [...question];

        if (sortOption === '조회순') {
            sortedQuestions.sort((a, b) => b.viewCnt - a.viewCnt);
        } else if (sortOption === '추천순') {
            sortedQuestions.sort((a, b) => {
                // 만약 추천 수가 같으면 id를 최신순으로 정렬
                if (b.likeCnt !== a.likeCnt) {
                    return b.likeCnt - a.likeCnt;
                }
                return b.id - a.id; // 추천 수가 같으면 id를 최신순으로 정렬
            });
        } else {
            sortedQuestions.sort((a, b) => b.id - a.id)
        }

        setQuestion(sortedQuestions);
    };

    useEffect(() => {
        sortQuestions();
    }, [sortOption]);



    return (
        <Container fluid>
            <H2>공유문제 리스트</H2><hr/>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {question.length > 0 && <p>총 게시물: <strong>{question.length}</strong></p>}
                <span>
                        <span>정렬: </span>
                         <select value={sortOption} onChange={handleSortChange}>
                            <option value="">기본</option>
                            <option value="조회순">조회순</option>
                            <option value="추천순">추천순</option>
                         </select>
                </span>
            </div>
            <Table className='table text-center align-middle mt-3' >
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>추천</th>
                    <th>조회수</th>
                    <th>작성자</th>
                    <th>생성일</th>
                </tr>
                </thead>
                <tbody>
                {question.map(v => (
                    <tr key={v.id}>
                        <td>{v.id}</td>
                        <td><Link to={`/share/detail/${v.id}`}>{v.question}</Link></td>
                        <td   style={{ cursor: 'pointer', lineHeight: '0.7'}}
                              onClick={() => handleRecommendationToggle(v.id, recommendedMap[v.id])}>
                            {recommendedMap[v.id] ? <img src='https://cdn-icons-png.flaticon.com/512/4369/4369505.png' alt='star' style={{blockSize: '2.5vh'}}/> : <img src='https://cdn-icons-png.flaticon.com/512/5708/5708819.png' alt='star' style={{blockSize: '2.5vh'}}/> }<br/><span style={{fontSize: '1.5vh', color: 'darkgray'}}>{v.likeCnt} </span></td>
                        <td>{v.viewCnt}</td>
                        <td>{v.user.username}</td>
                        <td style={{width: '25vh'}}>{v.create_time}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='white' className="me-2 btn-outline-success " onClick={() => navigate('/share/write')} >
                    작성
                </Button>
            </div>
        </Container>
    );
};

export default SList;