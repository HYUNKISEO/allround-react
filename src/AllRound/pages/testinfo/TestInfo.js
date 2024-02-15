import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Container, Table } from "react-bootstrap";
import {Link} from "react-router-dom";

const H2 = styled.h2`
  color: green;
  font-weight: bold;
  margin-left: 1.6vh;
  /* 여러 다른 스타일 속성들을 추가할 수 있습니다. */
`;

const TestInfo = () => {
    const buttonStyle = {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#2ea93c', // 원하는 색상으로 변경
        color: '#fff', // 글자색을 흰색으로 변경
        textDecoration: 'none',
        borderRadius: '5px',
        marginRight: '10px', // 버튼 사이의 간격 조절을 위해 마진 추가
    };

    const[testinfo, setTestinfo] = useState([]);
    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:8080/testinfo/info')
                .then(response => response.json())
                .then(data => setTestinfo(data))
                .catch(error => console.error('Error fetching test info:', error));
        };
        fetchData();
    }, []);

    const renderTable = (title, data) => {
        const formatDate = (dateString) => {
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);

            return `${year}년\n${month}월 ${day}일`;
        };
        return (
            <div>
                <H2>{title}</H2>
                <Table bordered hover responsive style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace:' pre-wrap'}}>
                    <thead className='table-success'>
                    <tr>
                        <th>자격시험일정</th>
                        <th>필기접수시작</th>
                        <th>필기접수마감</th>
                        <th>필기시험시작</th>
                        <th>필기시험마감</th>
                        <th>필기결과발표</th>
                        {data.some(item => item.pracregstartdt !== null) && <th>실기접수시작</th>}
                        {data.some(item => item.pracregenddt !== null) && <th>실기접수마감</th>}
                        {data.some(item => item.pracexamstartdt !== null) && <th>실기시험시작</th>}
                        {data.some(item => item.pracexamenddt !== null) && <th>실기시험마감</th>}
                        {data.some(item => item.pracpassstartdt !== null) && <th>실기합격발표</th>}
                        {data.some(item => item.pracpassenddt !== null) && <th>실기합격마감</th>}
                        <th>취득자격</th>
                        <th>응시료</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((info, index) => (
                        <tr key={index}>
                            <td>{info.implplannm.substring(0,5) + "\n" + info.implplannm.substring(5)}</td>
                            <td>{formatDate(info.docregstartdt)}</td>
                            <td>{formatDate(info.docregenddt)}</td>
                            <td>{formatDate(info.docexamstartdt)}</td>
                            <td>{formatDate(info.docexamenddt)}</td>
                            <td>{formatDate(info.docpassdt)}</td>
                            {info.pracregstartdt !== null && <td>{formatDate(info.pracregstartdt)}</td>}
                            {info.pracregenddt !== null && <td>{formatDate(info.pracregenddt)}</td>}
                            {info.pracexamstartdt !== null && <td>{formatDate(info.pracexamstartdt)}</td>}
                            {info.pracexamenddt !== null && <td>{formatDate(info.pracexamenddt)}</td>}
                            {info.pracpassstartdt !== null && <td>{formatDate(info.pracpassstartdt)}</td>}
                            {info.pracpassenddt !== null && <td>{formatDate(info.pracpassenddt)}</td>}
                            {index === 0 && (<td rowSpan={data.length}>{info.jmfldnm.substring(0,4) + "\n" + info.jmfldnm.substring(4)}</td>)}
                            {index === 0 && (<td rowSpan={data.length}>{info.contents.replace(/,/g, '\n')}</td>)}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    };

    const infoByCategory = {
        '정보처리기사': testinfo.filter(info => info.jmfldnm === '정보처리기사'),
        '정보처리산업기사': testinfo.filter(info => info.jmfldnm === '정보처리산업기사'),
        '정보처리기능사': testinfo.filter(info => info.jmfldnm === '정보처리기능사'),
    };


    return (
        <div>
            <H2 style={{textAlign: 'center', marginTop: '1.5vh'}}>자격증 시험일정</H2><hr/>
            <Container fluid className='mb-4 d-grid gap-3 text-center'>
                <Link to="https://www.q-net.or.kr/" target="_blank" rel="noopener noreferrer" style={buttonStyle}>시험접수 사이트 큐넷</Link>
                <Link to="/testinfo/book" style={buttonStyle}>추천 책 보러가기</Link>
            </Container>
            <Container fluid>
                {Object.entries(infoByCategory).map(([category, categoryData]) => (
                    renderTable(category, categoryData)
                ))}
            </Container>
        </div>
    );
};


export default TestInfo;