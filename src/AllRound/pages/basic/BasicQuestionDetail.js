import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Container, Form, Table } from 'react-bootstrap';

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;

const BasicQuestionDetail = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const history = useHistory();

    useEffect(() => {
        // 질문의 세부 정보를 가져오는 함수
        const fetchQuestionDetail = async () => {
            try {
                const response = await axios.get(`/basic/questions/${id}`);
                setQuestion(response.data);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        // 댓글 목록을 가져오는 함수
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/basic/questions/${id}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchQuestionDetail();
        fetchComments();
    }, [id]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/basic/questions/${id}/comments`, { text: newComment });
            // 댓글 작성 후 댓글 목록 다시 가져오기
            await fetchComments();
            // 댓글 작성 후 입력 필드 초기화
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`/basic/questions/${id}/comments/${commentId}`);
            // 댓글 삭제 후 댓글 목록 다시 가져오기
            await fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <Container fluid>
            <H2>질문 상세 정보</H2>
            <hr />
            <div>
                <p>제목: {question.title}</p>
                <p>내용: {question.content}</p>
                {/* 댓글 목록 표시 */}
                <div>
                    <h3>댓글</h3>
                    <Form onSubmit={handleSubmitComment}>
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                placeholder="댓글을 작성해주세요."
                                value={newComment}
                                onChange={handleCommentChange}
                            />
                        </Form.Group>
                        <Button type="submit">댓글 작성</Button>
                    </Form>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>작성자</th>
                            <th>내용</th>
                            <th>작성일</th>
                            <th>삭제</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comments.map((comment) => (
                            <tr key={comment.id}>
                                <td>{comment.author}</td>
                                <td>{comment.text}</td>
                                <td>{comment.createdAt}</td>
                                <td>
                                    <Button onClick={() => handleDeleteComment(comment.id)}>
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
};

export default BasicQuestionDetail;
