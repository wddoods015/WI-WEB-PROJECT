import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 
import './MyPage.css';
import { Link } from 'react-router-dom';


const MyPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const loginId = sessionStorage.getItem('id'); 
  const [changeInfo, setChangeInfo] = useState({
    name:'',
    phone:'',
    password:'',
  });

  const [changePw, setChangePw] = useState({
  pw: '',
  newpw: ''
});

const [chkPw, setChkPw] = useState('');
  
useEffect(() => {

  const getUser = async () => {
    try {
  
      const response = await axios.get(`${API_URL}/api/users/${loginId}`, {
        withCredentials: true // 쿠키를 포함하여 요청   
      }); 
     
      if (response.data && response.data.data) {
        console.log(response);
        const { name, loginId, grade, phone } = response.data.data;
        setUserInfo({ name, loginId, grade, phone }); // 사용자 정보 상태 업데이트
       
      } else {
        setError("No data found"); // 데이터가 없을 때 에러 메시지 설정
      }
  
    } catch (error) {
      // 리프레쉬 토큰 요청
     
      if (error.response.status === 401){
        
        try {
          axios.get(`${API_URL}/api/auth/refreshToken`, {
            withCredentials: true
          }).then(async () => {
            
            const response = await axios.get(`${API_URL}/api/users/${loginId}`, {
            withCredentials: true // 쿠키를 포함하여 요청   
            }); 
          //결과 데이터 처리 반복
         
            if (response.data && response.data.data) {
              
              const { name, loginId, grade, phone } = response.data.data;
              setUserInfo({ name, loginId, grade, phone }); // 사용자 정보 상태 업데이트
              
              console.log(userInfo);
            } else {
              
              setError("No data found"); // 데이터가 없을 때 에러 메시지 설정
            }
          });
  
        } catch (error) {
          console.error("Error : refreshToken expired", error);
        }  
      }
      setError(error.message); // API 호출 실패 시 에러 메시지 설정
    }
  };

  getUser(); // getUser 함수 호출
}, []); 

if (!userInfo) {
  return <div>Loading...</div>;
}

// 업데이트할 사용자 정보 onChange 핸들러
const userInfoChange = (e) => {
  const { name, value } = e.target;
  setChangeInfo({
    ...changeInfo,
    [name]: value,
  });
};

console.log('changeInfo:',changeInfo);

// 업데이트할 사용자 비밀번호 onChange 핸들러
const passwordChange = (e) => {
  const { name, value } = e.target;
  setChangePw({
    ...changePw,
    [name]: value,
    loginId:loginId,
  });
}

const chkpwChange = (e) => {
  setChkPw(e.target.value);
}

//------------------------------- 개인정보 update submit ------------------------------------


const UpdateInfo = async () => {
  let response;
  try {
    let response = axios.put(`${API_URL}/api/user${loginId}`,
      changeInfo, 
      {withCredentials: true,});

      if (response.data && response.data.data) {
          console.log('catch 응답:',response.data.data);
    } else {
        console.log('No data found');
    }
  } catch (error) {
    if (error.response && error.statusCode === 401) {
    // Refresh token 요청
   try{
    const newAccessToken = await refreshToken();

    response = await axios.put(`${API_URL}/api/user${loginId}`,
      changeInfo, 
      {
        headers: {
            Authorization: `Bearer ${newAccessToken}`,  // 새로운 토큰으로 인증 헤더 설정
        },withCredentials: true,});
        console.log('catch 응답2:',response.data);
   }  catch (refreshError) {
    console.error('Refresh token error', refreshError);
   
    // 사용자가 로그인 페이지로 리디렉션하거나 경고를 표시할 수 있습니다.
}
    } else {
      console.error('Fetch error', error);
    }
  }};


const UpdatePw = async () => {
  if (chkPw === changePw.newpassword) {

    
      let response = axios.put(`${API_URL}/api/user${loginId}`, changePw)
      .then(response => {
        console.log(response.data);
        alert('정보가 정상적으로 변경되었습니다.');
      })
      .catch(error => {
        console.log('put error: ', error); 
        alert('비밀번호 변경 중 오류가 발생했습니다.');
      });
  
    
  } else {
    alert('새비밀번호가 일치하지 않습니다.');
  }
};

 // 리프레시 토큰 요청하는 함수 - 재사용을 위해 분리,,
 const refreshToken = async () => {
  try {
      const response = await axios.get(`${API_URL}/api/auth/refreshToken`, {
          withCredentials: true,
      });
      console.log('Refresh token response:', response.data);
      // 액세스 토큰 갱신이 성공하면, 해당 액세스 토큰을 사용할 수 있도록 처리
      return response.data.accessToken;  // 새로 발급받은 액세스 토큰 반환
  } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error("Failed to refresh token");
  }
};

const HandleAlert = () => {
  alert(userInfo.name+'님, 계정을 삭제하면 보유하신 마일리지는 전부 삭제됩니다. 그래도 탈퇴하시겠습니까?');
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
        <label>이름 변경<input className='input-section' placeholder={userInfo.name} name='name' value={changeInfo.name} onChange={userInfoChange}/></label>
        <label>연락처 변경<input className='input-section' placeholder={userInfo.phone} name='phone' value={changeInfo.phone} onChange={userInfoChange}/></label>
        <label>비밀번호 <input className='input-section' placeholder='비밀번호 입력' name='password' value={changeInfo.password} onChange={userInfoChange}/></label>
        <button className='submit-login-btn' onClick={UpdateInfo}>비밀번호 인증으로 수정</button>
       <span>비밀번호 재설정</span>
        <label>현재 비밀번호 <input className='input-section' placeholder='현재 비밀번호 입력' name='pw' value={changePw.pw} onChange={passwordChange}/></label>
        <label>새비밀번호 <input className='input-section' placeholder='새 비밀번호 입력' name='newpw' value={changePw.newpw} onChange={passwordChange}/></label>
        <label>새비밀번호 확인 <input className='input-section' placeholder='새 비밀번호 확인' name='chkpw' value={chkPw} onChange={chkpwChange}/></label> 
        <button className='submit-login-btn' onSubmit={UpdatePw}>비밀번호 변경</button>
        <Link to='/MyPage/DelAccount' className='del-account' onClick={HandleAlert}>탈퇴하기</Link>
        </div>
        </div> 
       </div>
    
  );
};

export default MyPage;
