import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MonacoEditor from 'react-monaco-editor';
import { useParams } from 'react-router-dom';
import './Write.css';
import { jwtDecode } from 'jwt-decode'; // 수정: import 문 오타 수정

const BasicQuestionWrite = () => {

    const { questionId } = useParams();
    const [userId, setUserId] = useState('');
    const [code, setCode] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [randomValue1, setRandomValue1] = useState('');
    const [randomValue2, setRandomValue2] = useState('');
    const [randomChar, setRandomChar] = useState('');
    const [questionDetails, setQuestionDetails] = useState({
        title: '',
        description: '',
        example_Input: '',
        example_Output: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/basic/questions/getRandomValue?questionId=${questionId}`);
                setRandomValue1(response.data.randomNumber1);
                setRandomValue2(response.data.randomNumber2);
                setRandomChar(response.data.randomChar);

                const questionDetailsResponse = await axios.get(`http://localhost:8080/basic/questions/${questionId}`);
                setQuestionDetails(questionDetailsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            }
        };

        if (questionId) { // 수정: questionId가 존재할 때만 fetchData 함수 호출
            fetchData();
        }
    }, [questionId]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token); // 수정: jwtDecode 함수 사용
            setUserId(decodedToken.userId);
        }
    }, []);

    const save = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/basic/questions/save/${questionId}/${userId}`, {
                code,
                randomNumber1: randomValue1,
                randomNumber2: randomValue2,
                randomChar,
            });
            setResult(response.data);
            setError('');
            setModalOpen(true);
        } catch (error) {
            console.error('Error executing code:', error);
            setError('Failed to execute code');
            setResult('');
        }
    };


    const closeModal = () => setModalOpen(false);

    return (
        <div className="container-fluid coding-test-container">
            <div className="row">
                <div className="col-md-6 problem-container">
                    <h1 className="text-center coding-test-title">{questionDetails.title}</h1>
                    <div className="problem">
                        <p>{questionDetails.description}</p>
                    </div>
                    <div className="example">
                        <h3>입력 예시:</h3>
                        <p>{questionDetails.example_Input}</p>
                        <h3>출력 예시:</h3>
                        <p>{questionDetails.example_Output}</p>
                    </div>
                </div>
                <div className="col-md-6 code-editor-container">
                    <MonacoEditor
                        height="600px"
                        language="java"
                        value={code}
                        onChange={setCode}
                        options={{ minimap: { enabled: false } }}
                    />
                    <div className="text-center mt-3">
                        <button className="btn btn-primary execute-button" onClick={save}>
                            코드 실행
                        </button>
                    </div>
                </div>
            </div>

            <div className={`modal ${modalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: modalOpen ? 'block' : 'none' }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">실행 결과</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {error ? <div className="alert alert-danger result-error">{error}</div> : <pre className="result-text">{result}</pre>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>닫기</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-backdrop ${modalOpen ? 'show' : ''}`} style={{ display: modalOpen ? 'block' : 'none' }}></div>
        </div>
    );
};

export default BasicQuestionWrite;
