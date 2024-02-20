import React, {useEffect, useState} from 'react';
import {Container, Table} from "react-bootstrap";
import styled from "styled-components";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const History = () => {
    const [history, setHistory] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/history/list", {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => setHistory(data))
    }, []);

    const getColor = (type) => {
        switch (type) {
            case '게시물': return '#d3c0f9';
            case '기본문제': return '#f3c4f7';
            case '공유문제': return '#a0c8e0';
            case '유저': return '#f8b7b1';
            default: return '#ffd966';
        }
    }

    return (
        <Container fluid>
            <H2>히스토리</H2><hr/>
            <Table striped className='table-bordered text-center'>
                <thead className='table-success'>
                    <tr>
                        <th>구분</th>
                        <th>이력</th>
                        <th>시간</th>
                    </tr>
                </thead>
                <tbody>
                {history.map((item, index) => (
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