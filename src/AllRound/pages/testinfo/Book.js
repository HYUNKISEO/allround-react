import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {Button, Card, CardImg, Container, Image, Modal} from 'react-bootstrap';
import {Link} from "react-router-dom";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const Book = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [keyword, setKeyword] = useState('정보처리기사');
    useEffect(() => {
        handleButtonClick(keyword);
        setKeyword(keyword)
    }, [keyword]);

    const handleButtonClick = (selectedKeyword) => {
        // 서버로 전송할 데이터
        const requestData = {
            keyword: selectedKeyword,
        };

        // fetch를 사용하여 서버에 POST 요청 보내기
        fetch('http://localhost:8080/testinfo/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                setBooks(data.items);
            })
            .catch((error) => console.error('Error fetching book list:', error));
    };

    const openModal = (book) => {
        setSelectedBook(book);
    };

    const closeModal = () => {
        setSelectedBook(null);
    };

    return (
        <div>
            <Container fluid>
                <H2>최신서적 리스트</H2>
                <hr />
                <div className="d-grid gap-2">
                    <Button className='btn-success' onClick={() => handleButtonClick('정보처리기사')}>정보처리기사</Button>
                    <Button className='btn-success' onClick={() => handleButtonClick('정보처리산업기사')}>정보처리산업기사</Button>
                    <Button className='btn-success' onClick={() => handleButtonClick('정보처리기능사')}>정보처리기능사</Button>
                </div>
                <hr/>
            </Container>

            <Container fluid className="d-flex flex-wrap justify-content-center">
                {books.map((book, index) => (
                    <div key={index} className="col-md-2 m-4 text-center" style={{cursor: 'pointer'}}>
                        <Card onClick={() => openModal(book)}>
                            <CardImg variant='top' src={book.image}/>
                            <Card.Body className="text-center">
                                <Card.Title>{book.title}</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </Container>

            <Modal show={selectedBook !== null} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: 'green', fontWeight: 'bold'}}>서적 상세정보</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{whiteSpace:' pre-wrap'}}>
                    <strong className='mb-3 text-success'>책이름</strong>
                    <p>{selectedBook?.title}</p><hr/>
                    <strong className='mb-3 text-success'>저자</strong>
                    <p>{selectedBook?.author.replace(/\^/g, "  ")}</p><hr/>
                    <strong className='mb-3 text-success'>가격</strong>
                    <p>{selectedBook?.discount.substring(0,2) + ',' + selectedBook?.discount.substring(2)}원</p><hr/>
                    <strong className='mb-3 text-success'>출간일</strong>
                    <p>{selectedBook?.pubdate.substring(0,4) + '년 ' + selectedBook?.pubdate.substring(4,6) + '월 ' + selectedBook?.pubdate.substring(6,8) + '일'}</p><hr/>
                    <strong className='mb-3 text-success'>출판사</strong>
                    <p>{selectedBook?.publisher}</p><hr/>
                    <strong className='mb-3 text-success'>구매처</strong>
                    <Link to={selectedBook?.link} target="_blank" rel="noopener noreferrer" className='ms-5'>네이버 쇼핑</Link><hr/>
                    <strong className='mb-3 text-success'>책설명</strong>
                    <p>{selectedBook?.description}</p><hr/>
                    <Image src={selectedBook?.image}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={closeModal}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default Book;
