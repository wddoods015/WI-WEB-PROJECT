import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 
import './Notice.css';



const Notice = () => {

    const [rowOpen, setRowOpen] = useState(false);
    
    const handleRowOpen = () => {
      setRowOpen(!rowOpen);
    };

    return (
        <div className='notice'>
            <Sidebar />
            <div className='ntc'>
            <h2 className='notice-headline'>공지사항</h2>
            <table className='notice-table'>
                <thead>
                <tr>
                    <th>
                        번호
                    </th>
                    <th className='notice-title'>
                        제목
                    </th>
                    <th>
                        등록일
                    </th>
                </tr>
                </thead>
                <tbody>
                    <tr onClick={handleRowOpen}>
                    <td>
                        1
                    </td>
                    <td>
                        쇼핑몰 종료 안내
                    </td>
                    <td>
                        2024-08-27
                    </td>
                    </tr>
                    {rowOpen && (<tr>
                    <td colSpan="3" className='notice-content'>
                      wi입니다. 더 나은 혜택과 서비스를 제공해 드리기 위해 노력하겠습니다.
감사합니다.
                    </td>
                    </tr>)}
                </tbody>

            </table>
            </div>
        </div>
    );
};

export default Notice;