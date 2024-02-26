import React, {useEffect, useState} from 'react';
import {Container, FormSelect, Table} from "react-bootstrap";
import styled from "styled-components";
import {useSelector} from "react-redux";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const History = () => {
    const [history, setHistory] = useState([])
    const [selectedType, setSelectedType] = useState(''); // 추가된 부분
    const fetchHistoryData = () => {
        fetch("http://localhost:8080/history/list", {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setHistory(data))
            .catch(error => console.error('Error fetching history data:', error));
    };

    useEffect(() => {
        // 초기 렌더링 시 데이터 불러오기
        fetchHistoryData();

        // 15초마다 데이터를 갱신
        const intervalId = setInterval(() => {
            fetchHistoryData();
        }, 15000);

        // 컴포넌트가 언마운트되면 clearInterval로 인터벌 제거
        return () => clearInterval(intervalId);
    }, []);

    const getColor = (type) => {
        switch (type) {
            case '게시물': return '#d3c0f9';
            case '기본문제': return '#f3c4f7';
            case '공유문제': return '#a0c8e0';
            case '유저': return '#f8b7b1';
            case '추천누적': return '#ffd966';
            default: return ;
        }
    }

    return (
        <Container fluid>
            <H2>히스토리</H2>
            <div style={{textAlign: 'center', fontWeight: 'bold'}}>※<span style={{color: 'gray'}}>15초 마다 자동 갱신 됩니다.</span></div><hr/>
            <label style={{fontWeight:"bold", fontSize: '2.5vh', marginLeft: '5vh'}}>구분별 조회</label>
            <FormSelect onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
                <option value="">전체</option>
                <option value="게시물">게시물</option>
                <option value="기본문제">기본문제</option>
                <option value="공유문제">공유문제</option>
                <option value="유저">유저</option>
                <option value="추천누적">추천누적</option>
                {/* 추가적인 이력 유형이 있으면 여기에 추가 */}
            </FormSelect>
            <Table striped className='table-bordered text-center mt-3'>
                <thead className='table-success'>
                    <tr>
                        <th>구분</th>
                        <th>이력</th>
                        <th>시간</th>
                    </tr>
                </thead>
                <tbody>
                {history
                    .filter(item => !selectedType || item.type === selectedType)
                    .map((item, index) => (
                    <tr key={index}>
                        <td style={{backgroundColor: getColor(item.type), color:"white",fontSize: "2vh", width: "15vh"}}>{item.type}</td>
                        <td style={{fontWeight: 'bold'}}>{item.content}</td>
                        <td style={{fontWeight: 'bold'}}>{item.create_time}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

        </Container>
    );
};

export default History;