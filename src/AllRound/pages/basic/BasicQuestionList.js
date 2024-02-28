import React, { useState, useEffect } from 'react';
import { Container, Table, Pagination } from 'react-bootstrap';
import {Link, useParams} from "react-router-dom";

const BasicQuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [pageNumber, setPageNumber] = useState(1); // 현재 활성화된 페이지 번호
    const pageSize = 5; // 페이지 당 데이터 수

    const [totalCount, setTotalCount] = useState(0); // 총 데이터 수

    useEffect(() => {
        fetchQuestions();
    }, [pageNumber]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:8080/basic/questions/list?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
            });
            const data = await response.json();
            setQuestions(data.content); // 페이징된 데이터 설정
            setTotalCount(data.totalElements); // 총 데이터 수 설정
        } catch (error) {
            console.error('Error fetching questions: ', error);
        }
    };

    // 페이지 번호를 업데이트하는 함수
    const handlePageChange = (newPageNumber) => {
        setPageNumber(newPageNumber);
    };

    // 전체 페이지 수를 계산
    const totalPages = Math.ceil(totalCount / pageSize);

    // 페이지 번호를 5개씩 묶어서 표시
    const renderPageNumbers = () => {
        const pages = [];
        const maxPage = Math.min(totalPages, pageNumber + 4); // 최대 페이지 번호 계산
        for (let i = pageNumber; i <= maxPage; i++) {
            pages.push(
                <Pagination.Item key={i} active={i === pageNumber} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }
        return pages;
    };

    return (
        <Container>
            <h1 className="text-center my-4">문제 목록</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>제목</th>
                    <th>설명</th>
                    <th>입력 예시</th>
                    <th>출력 예시</th>
                </tr>
                </thead>
                <tbody>
                {questions.map((question, index) => (
                    <tr key={question.questionId}>
                        <td>{(pageNumber - 1) * pageSize + index + 1}</td>
                        <td><Link to={`/basic/question/save/${question.questionId}`}>{question.title}</Link></td>
                        <td>{question.description}</td>
                        <td>{question.example_Input}</td>
                        <td>{question.example_Output}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1} />
                {renderPageNumbers()}
                <Pagination.Next onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === totalPages} />
            </Pagination>
        </Container>
    );
};

export default BasicQuestionList;
