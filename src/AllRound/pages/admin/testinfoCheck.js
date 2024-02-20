import React from 'react';
import TestInfo from "../testinfo/TestInfo";
import {Button} from "react-bootstrap";

const TestinfoCheck = () => {

    const dataChange = () => {
        fetch("http://localhost:8080/testinfo/executeAutoSave")
            .then(response => response.text())
            .then(data => data);
    }

    return (
        <div className='text-center'>
            <div className='text-danger' style={{fontSize: '4vh'}}>데이터 최신화 및 데이터 문제시에만 눌러주세요</div>
            <Button className='btn-danger mb-3 btn-lg container-fluid' onClick={() => {dataChange()}}>데이터정리</Button>
            <h2 style={{ fontWeight: 'bold' }}>🡻🡻서비스 페이지🡻🡻</h2><hr />
            <div style={{ height: '70vh', overflow: 'hidden', position: 'relative' }}>
                <div style={{ transform: 'translateY(-200px)' }}>
                    <TestInfo />
                </div>
            </div>
        </div>
    );
};

export default TestinfoCheck;
