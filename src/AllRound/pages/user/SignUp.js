import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rePassword: '',
        name: '',
        dob: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;

        const idRegex = /^[a-zA-Z0-9]+$/;
        isValid = isValid && (idRegex.test(formData.username) || setErrors({ ...errors, username: '아이디는 영문과 숫자만 입력 가능합니다.' }));

        isValid = isValid && (formData.password === formData.rePassword || setErrors({ ...errors, rePassword: '패스워드가 일치하지 않습니다.' }));

        const numberRegex = /^[0-9]+$/;
        isValid = isValid && (numberRegex.test(formData.phone) && formData.phone.length >= 10 && formData.phone.length <= 11 || setErrors({ ...errors, phone: '전화번호는 10자 이상 11자 이하 숫자만 입력 가능합니다.' }));

        if (!isValid) {
            return;
        }
        // 포스트로 보낼 때 이 부분을 서버에 전송하는 코드
        fetch('http://localhost:8080/user/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                name: formData.name,
                dob: formData.dob,
                phone: formData.phone,
            }),
        })
            .then(response => response.json())
            .then(data => {
                alert("회원가입 성공!")
                navigate("/user/login")
            })
            .catch(error => {
                alert("아이디 중복입니다. 다른 아이디를 활용해 주세요.")
            });
    };

    return (
        <div className='container-fluid' style={{width: '50%', height: '100%', marginTop: '10vh', transform: "scale(1.1)"}}>
            <h2 className='mb-4' style={{fontWeight: "bold", color: "green"}}>회원가입</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>아이디:</Form.Label>
                    <Form.Control type='text' name='username' value={formData.username} onChange={handleChange} required />
                    {errors.username && <div className='text-danger'>{errors.username}</div>}
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>비밀번호:</Form.Label>
                    <Form.Control type='password' name='password' value={formData.password} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>비밀번호 확인:</Form.Label>
                    <Form.Control type='password' name='rePassword' value={formData.rePassword} onChange={handleChange} required />
                    {errors.rePassword && <div className='text-danger'>{errors.rePassword}</div>}
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>이름:</Form.Label>
                    <Form.Control type='text' name='name' value={formData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>생년월일:</Form.Label>
                    <Form.Control type='date' name='dob' value={formData.dob} onChange={handleChange} max={new Date().toISOString().split('T')[0]} required />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>전화번호:</Form.Label>
                    <Form.Control type='tel' name='phone' value={formData.phone} onChange={handleChange} required />
                    {errors.phone && <div className='text-danger'>{errors.phone}</div>}
                </Form.Group>
                <Button variant='success' type='submit'>가입하기</Button>
            </Form>
        </div>
    );
};

export default SignUp;
