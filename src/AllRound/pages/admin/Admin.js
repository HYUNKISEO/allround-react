import React from 'react';
import {Tab, Tabs} from "react-bootstrap";
import UserCheck from "./UserCheck";
import BasicCheck from "./BasicCheck";
import ShareCheck from "./ShareCheck";
import BoardCheck from "./BoardCheck";
import History from "./History";
import TestinfoCheck from "./testinfoCheck";

const Admin = () => {

    return (
        <div>
            <Tabs justify='content-center' className='mt-3'>
                <Tab title='문제관리' eventKey='basic'>
                    <BasicCheck/>
                </Tab>
                <Tab title='공유관리' eventKey='share'>
                    <ShareCheck/>
                </Tab>
                <Tab title='게시판관리' eventKey='board'>
                    <BoardCheck/>
                </Tab>
                <Tab title='시험일정' eventKey='testinfo'>
                    <TestinfoCheck/>
                </Tab>
                <Tab title='유저관리' eventKey='user'>
                    <UserCheck/>
                </Tab>
                <Tab title='히스토리' eventKey='history'>
                    <History/>
                </Tab>
            </Tabs>
        </div>
    );
};

export default Admin;