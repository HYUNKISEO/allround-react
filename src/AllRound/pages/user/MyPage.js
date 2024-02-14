import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import styled from "styled-components";


const UserInfoRow = ({ label, value }) => (
    <tr>
        <th style={{ whiteSpace: 'nowrap', letterSpacing: '0.2rem', textAlign: 'center', fontSize: '2vh'}}>{label}</th>
        <td className='p-2' style={{ textAlign: 'center', fontSize: '2vh'}} >{label === '연 락 처' ? value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : value}</td>
    </tr>
);

const H2 = styled.h2`
  text-align: center;
  color: green;
  font-weight: bold;
  /* 여러 다른 스타일 속성들을 추가할 수 있습니다. */
`;

const ROW = styled.div`
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    border-left: 1px solid #ddd;
    height: 90vh;
    margin-left: -1px; /* 선의 두께의 절반만큼 왼쪽으로 이동하여 정중앙에 위치하도록 조절 */
    margin-top: 60px;
  `;

const MyPage = () => {
    const [user, setUser] = useState({
        id:null,
        username:'',
        name: '',
        dob:'',
        phone:'',
        createdTime:''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        // 토큰을 디코딩하여 username 추출
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;
        console.log(decodedToken)

        fetch(`http://localhost:8080/user/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
                // 다른 필요한 헤더도 추가할 수 있음
            }
        })
            .then(response => response.json())
            .then(data => {
                setUser({
                    id: data.id,
                    username: data.username,
                    name: data.name,
                    dob: data.dob,
                    phone: data.phone,
                    createdTime: data.create_time
                })
            })
    }, []);

    return (
        <Container fluid className='mt-4'>
            <Row>
                <Col sm={6}>
                    <H2>회원 정보</H2>
                    <hr/>
                    <Table  bordered hover className='mt-3'>
                        <tbody>
                        <UserInfoRow label="회원번호" value={user.id} />
                        <UserInfoRow label="아 이 디" value={user.username} />
                        <UserInfoRow label="이&nbsp;&nbsp;&nbsp;&nbsp;름" value={user.name} />
                        <UserInfoRow label="생년월일" value={user.dob} />
                        <UserInfoRow label="연 락 처" value={user.phone} />
                        <UserInfoRow label="가 입 일" value={user.createdTime} />
                        </tbody>
                    </Table>
                    <div className='d-grid gap-2'>
                        <Button variant="success text-white">
                            회원 수정
                        </Button>
                        <Button variant="danger" >
                            회원 탈퇴
                        </Button>
                    </div>

                    <H2 className='mt-3'>기본문제 현황</H2>
                    <hr/>

                </Col>
                <ROW className="vertical-line"></ROW>
                <Col sm={6}>
                    <Row>
                        <Col>
                            <H2>나의 게시글 목록</H2>
                        </Col>
                    </Row>

                    <Row>
                        <Col style={{ marginTop: '20px' }}>
                            <H2>나의 공유문제 목록</H2>
                            {/* 문제 목록을 표시하는 부분 (추후 구현 필요) */}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default MyPage;