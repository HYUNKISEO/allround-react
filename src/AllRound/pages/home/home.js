import React from 'react';
import {useNavigate} from "react-router-dom";
import './home.css'

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className='main'>
            <div className='container'>
                <div className='text-container'>
                    <p className='back'>A</p>
                    <p className='front'>문제풀이와 커뮤니티를<br/> 한곳에 담다. AllRound</p>
                </div>
                <button className='custom-button' onClick={() => {navigate('/user/login')}}>Let`s Go!</button>
            </div>
        </div>
    );
};

export default Home;