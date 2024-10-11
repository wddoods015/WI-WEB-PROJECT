import React, { useEffect, useState } from "react";
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './CancelList.css';


const CancelList = () => {

    const [listData, setListData] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [categoryTag, setCategoryTag] = useState('취소접수');
    const API_URL = process.env.REACT_APP_API_URL;
    const loginId = sessionStorage.getItem('id');

    const GetList = async () => {
        let response;
        try {
            let response = await axios.get(`${API_URL}/api/orders/getOrderByRequestAll/${loginId}`, {
                withCredentials: true,
            });
           
            if (response.data && response.data.data) {
                setListData(response.data.data);
            } else {
                console.log('No data found');
            }
        } catch (error) {
            if (error.response && error.statusCode === 401) {
                try {
                    // Refresh token 요청
                   const newAccessToken = await refreshToken();
                
                    // 새롭게 주문 목록 요청
                    response = await axios.get(`${API_URL}/api/orders/getOrderByRequestAll/${loginId}`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`,  // 새로운 토큰으로 인증 헤더 설정
                        },
                        withCredentials: true,
                    });
                   
                    if (response.data && response.data.data) {
                         setListData(response.data.data);
                    console.log('Initial data:', response.statusCode);
                    console.log('Refetched data:', response.data);
                    } else {
                        console.log('Refetch 후 데이터 못 가져옴');
                       
                    }
                } catch (refreshError) {
                    console.error('Refresh token error', refreshError);
                   
                    // 사용자가 로그인 페이지로 리디렉션하거나 경고를 표시할 수 있습니다.
                }
            } else {
               
                console.error('Fetch error', error);
            }
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
console.log('listData:', listData);
    useEffect(() => {
        GetList();
    }, []);
    
     // 클릭 시 호출되는 함수
  const handleRowClick = (orderId) => {
    // 현재 클릭한 문의가 이미 확장된 상태라면 숨기기
    setOrderId(orderId);
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      // 그렇지 않으면 클릭한 문의를 확장
      setExpandedOrderId(orderId);
    }
  };

 // categoryTag 값에 따라 배열 필터링
 const filteredData = listData.filter(item => item.status === categoryTag);

    return (
        <div className="cancel-list">
             <Sidebar />
             <div className="cancel-section">
             <h2 >취소/교환/반품 내역</h2>
             <div className="cancel-category">
             <button className='cancel-category-tag' value="취소접수" onClick={(e) => setCategoryTag(e.target.value)}>취소접수</button>
             /
             <button className='cancel-category-tag' value="교환접수" onClick={(e) => setCategoryTag(e.target.value)}>교환접수</button>
             /
             <button className='cancel-category-tag' value="반품접수" onClick={(e) => setCategoryTag(e.target.value)}>반품접수</button>
             </div>
             <table className="cancel-tb">
                <tr>
                    <th className="cancel-count">종류</th>
                    <th>주문번호</th>
                    <th>총 결제금액</th>
                    <th>접수일자</th>
                    <th>진행상태</th>
                </tr>
                {Array.isArray(filteredData) && filteredData.length > 0 ? (
                    filteredData.map((filteredData) => (
                        <React.Fragment key={filteredData.orderId}>
                        <tr onClick={() => handleRowClick(filteredData.orderId)}>
                        <td>
                           {filteredData.status} 
                        </td>
                        <td>
                        {filteredData.orderId}
                        </td>
                        <td>
                          {filteredData.totalAmount}원 
                        </td>
                        <td>
                         {filteredData.orderDate.slice(0, 10)}
                        </td>
                        <td>
                         취소완료
                        </td>
                    </tr>
                    {expandedOrderId === filteredData.orderId && (
                        <>
                         {filteredData.items.map((items, itemsIndex) => (
                    <tr key={itemsIndex}>
                        <td className='hidden-td'>
                            <img
                            src={`http://43.203.208.22:3080/${items.productName}/${items.image_small}`}
                            alt={items.productName}
                            />
                        </td>
                            <td className='hidden-colspan-td' colSpan={4}>
                           <ul>상품명: {items.productName}</ul>
                        </td>    
                    </tr>
                     ))}
                        </>
                    )}
                   
                       </React.Fragment> 
                    ))
            
                ):(<tr>
                    <td colSpan="5">데이터가 없습니다.</td>
                  </tr>)}
                
             </table>
             </div>
        </div>
    );
};

export default CancelList;