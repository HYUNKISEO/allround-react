import React, {useEffect, useState} from 'react';

const TestInfo = () => {
    const[testinfo, setTestinfo] = useState([]);
console.log(testinfo)
    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:8080/testinfo/info')
                .then(response => response.json())
                .then(data => setTestinfo(data))
                .catch(error => console.error('Error fetching test info:', error));
        };
        fetchData();
    }, []);

    const renderTable = (title, data) => {
        return (
            <div>
                <h2>{title}</h2>
                <table border="1">
                    <thead>
                    <tr>
                        <th>응시료</th>
                        <th>필기시험마감</th>
                        <th>필기시험시작</th>
                        <th>필기결과발표</th>
                        <th>필기접수마감</th>
                        <th>필기접수시작</th>
                        <th>자격시험일정</th>
                        <th>취득자격증명</th>
                        <th>실기시험마감</th>
                        <th>실기시험시작</th>
                        <th>실기합격마감</th>
                        <th>실기합격발표</th>
                        <th>실기접수마감</th>
                        <th>실기접수시작</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((info, index) => (
                        <tr key={index}>
                            <td>{info.contents}</td>
                            <td>{info.docexamenddt}</td>
                            <td>{info.docexamstartdt}</td>
                            <td>{info.docpassdt}</td>
                            <td>{info.docregenddt}</td>
                            <td>{info.docregstartdt}</td>
                            <td>{info.implplannm}</td>
                            <td>{info.jmfldnm}</td>
                            <td>{info.pracexamenddt}</td>
                            <td>{info.pracexamstartdt}</td>
                            <td>{info.pracpassenddt}</td>
                            <td>{info.pracpassstartdt}</td>
                            <td>{info.pracregenddt}</td>
                            <td>{info.pracregstartdt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const infoByCategory = {
        '정보처리기사': testinfo.filter(info => info.jmfldnm === '정보처리기사'),
        '정보처리산업기사': testinfo.filter(info => info.jmfldnm === '정보처리산업기사'),
        '정보처리기능사': testinfo.filter(info => info.jmfldnm === '정보처리기능사'),
    };

    return (
        <div>
            {Object.entries(infoByCategory).map(([category, categoryData]) => (
                renderTable(category, categoryData)
            ))}
        </div>
    );
};


export default TestInfo;