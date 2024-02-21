import React, {useEffect, useState} from 'react';
import {Card, CardImg, Container} from "react-bootstrap";
import styled from "styled-components";

const H2 = styled.h2`
  margin-top: 1.5vh;
  text-align: center;
  color: green;
  font-weight: bold;
`;
const Tutorial = () => {
    const [video, setVideo] = useState([]);
    const [keyword, setKeyword] = useState('java');

    useEffect(() => {
        handleButtonClick(keyword);
        setKeyword(keyword)
    }, [keyword]);

    const handleButtonClick = (selectedKeyword) => {
        // 서버로 전송할 데이터
        const requestData = {
            keyword: selectedKeyword,
        };

        fetch("http://localhost:8080/tutorial/list", {
            method: "POST",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => setVideo(data.items))
    }

    function renderButton(label, iconUrl) {
        return (
            <button className='btn btn-outline-dark me-2 flex-grow-1' style={{width: '10vh'}}
            onClick={() => handleButtonClick(label)}>
                <img src={iconUrl} style={{ width: '7vh', height: '7vh' }} alt="Icon Image" />
                <br/><strong>{label}</strong>
            </button>
        );
    }

    return (
        <Container fluid>
            <H2>튜토리얼 강의</H2>
            <div style={{textAlign: "center", fontWeight: "bold", lineHeight: '0.7'}}>
                <p>기본강의는 <span style={{backgroundColor: 'lightgreen'}}>Java</span>로 설정되어 있습니다.</p>
                <p>버튼을 누르면 <span style={{backgroundColor: 'lightgreen'}}>해당 언어</span>로 변경됩니다.</p>
                <p><span className='text-danger'>YOUTUBE</span> <span style={{backgroundColor: 'lightgreen'}}>인기영상</span> 기준으로 설정되어 있습니다.</p>
            </div>
            <hr/>
            <div className='d-flex'>
                {renderButton('JAVA', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg')}
                {renderButton('SpringBoot', 'https://media.licdn.com/dms/image/D4D12AQEICFOK-z0akA/article-cover_image-shrink_720_1280/0/1656604745399?e=2147483647&v=beta&t=-Fjm5QYiJOJNzJ89xGv9VYPNxMNxqIX4jscMWXB6VaM')}
                {renderButton('JPA', 'https://t1.daumcdn.net/cfile/tistory/2266984A57CA822131')}
                {renderButton('MySQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg')}
                {renderButton('JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg')}
                {renderButton('HTML', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-plain.svg')}
                {renderButton('CSS', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-plain.svg')}
                {renderButton('React', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg')}
            </div>
            <hr/>

            <Container fluid className="d-flex flex-wrap justify-content-center">
                {video.map((v, index) => (
                    <div key={index} className="m-5 text-center" >
                        <Card style={{width: "720px", height: '500px'}}>
                                <iframe id="ytplayer" type="text/html" width="720" height="405"
                                        src={`https://www.youtube.com/embed/${v.id.videoId}`}
                                        frameBorder="0" allowFullScreen>
                                </iframe>
                            <Card.Body>
                                <Card.Title>{v.snippet.title}</Card.Title>
                                <Card.Text>{v.snippet.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </Container>
        </Container>
    );
};

export default Tutorial;