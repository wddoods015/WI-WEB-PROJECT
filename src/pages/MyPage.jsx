import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 
import './MyPage.css';
import { Link } from 'react-router-dom';


const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  

useEffect(() => {
  const id = sessionStorage.getItem('id') 

  const getUser = async () => {
    try {
      const response = await axios.get(`http://43.203.208.22:3000/api/users/${id}`, {
        headers: { Authorization: sessionStorage.getItem('accessToken'),
        },
      }); 
     

      if (response.data && response.data.data) {
        const { name, loginId, grade, phone } = response.data.data;
        setUserInfo({ name, loginId, grade, phone }); // 사용자 정보 상태 업데이트
      } else {
        setError("No data found"); // 데이터가 없을 때 에러 메시지 설정
      }
    } catch (error) {
      setError(error.message); // API 호출 실패 시 에러 메시지 설정
    }
  };

  getUser(); // getUser 함수 호출
}, []); // 빈 배열을 의존성 배열로 사용하여 컴포넌트 마운트 시 한 번만 호출됨

if (error) {
  return <div>Error: {error}</div>; // 에러가 발생한 경우 화면에 에러 메시지 표시
}

// userInfo가 null일 때는 로딩 메시지를 표시
if (!userInfo) {
  return <div>Loading...</div>;
}

  return (
      <div className='mypage'>
         <Sidebar />
         <div className='mypage-section'>
         <h1 className='user-name'>{userInfo.name}님 환영합니다.</h1>
         <table className='mypage-tb'>
          <thead>
            <tr>
          <th className='th-Id'>{userInfo.loginId}</th>
          <th className='th-grade'>{userInfo.grade}</th>
          </tr>
          </thead>
        </table>
        <h3 className='update-headline'>회원정보 수정</h3>
       <div className='update-section'>
         
        <label>이름 변경<input className='input-section' value={userInfo.name}/></label>
        <label>연락처 변경<input className='input-section' value={userInfo.phone}/></label>
        <button className='submit-login-btn'>비밀번호 인증으로 수정</button>
        <label>현재 비밀번호 <input className='input-section' placeholder='새 비밀번호입력' /></label>
        <label>새비밀번호 <input className='input-section' placeholder='새 비밀번호입력' /></label>
        <label>새비밀번호 확인 <input className='input-section' placeholder='새 비밀번호 확인' /></label> 
        <button className='submit-login-btn'>비밀번호 변경</button>
        </div>
        <Link className='del-account'>탈퇴하기</Link>
        </div> 
       </div>
    
  );
};

export default MyPage;
