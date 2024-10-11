import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyOrder.css';
import Sidebar from '../components/Sidebar';

const MyOrder = () => {
    const [cancelModal, setCancelModal] = useState(false);
    const [refundModal, setRefundModal] = useState(false);
    const [data, setData] = useState([]); // 초기값을 빈 배열로 설정
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const [reason, setReason] = useState('');
    const [requestReasonComment, setRequestReasonComment] = useState('');
    const [orderId, setOrderId] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;
    const loginId = sessionStorage.getItem('id');


  // 데이터 패칭 함수
const fetchData = async () => {
    let response;  // response를 미리 선언 (재사용 가능하게)
    try {
        let response = await axios.post(`${API_URL}/api/orders/shippingList`, { loginId }, {
            withCredentials: true,
        });
        console.log('Initial fetch data:', response.data);  // 전체 응답 로그 확인

        // 데이터가 있는지 확인
        if (response.data && response.data.data) {
            setData(response.data.data);
        } else {
            setError("No data found");
        }
    } catch (error) {
        console.error('Error fetching data:', error);

        // 401: 토큰 만료된 경우
        if (error.response && error.response.status === 401) {
            try {
                console.log("401 error detected, refreshing token...");

                // 리프레시 토큰 요청
                const newAccessToken = await refreshToken();

                // 새롭게 발급받은 액세스 토큰으로 다시 요청
                response = await axios.post(`${API_URL}/api/orders/shippingList`, { loginId }, {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,  // 새로운 토큰으로 인증 헤더 설정
                    },
                    withCredentials: true,
                });

                console.log('Refetched data:', response.data);  // 리프레시 후 응답 확인

                if (response.data && response.data.data) {
                    setData(response.data.data);
                } else {
                    setError("Refetch 후 데이터 없음");
                }
            } catch (refreshError) {
                console.error('Error after refreshing token:', refreshError);
                setError("Failed to refresh token");
            }
        } else {
            setError("Failed to fetch data");
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

//   // data가 업데이트된 후 로그 확인
//   useEffect(() => {
//       console.log('Updated data:', data);
//   }, [data]);
  
  // 컴포넌트 마운트 시 데이터 패칭
  useEffect(() => {
      fetchData();
  }, []);

    // 모달창 열기/닫기 함수들
    const openCancel = (orderId) => {setCancelModal(true); setOrderId(orderId);}
    const closeCancel = () => setCancelModal(false);
    const openRefund = (orderId) => {setRefundModal(true); setOrderId(orderId);}
    const closeRefund = () => setRefundModal(false);
   

    //onchange 핸들러
    const cancelOnChange = (e) => {
        const newReason = e.target.value;  // 최신 reason 값을 가져옴
        setReason(newReason);  // 비동기적으로 상태 업데이트
      };
      
      const cancelCommentOnChange = (e) => {
        setRequestReasonComment(e.target.value);
      }


    
    
  //  취소접수 - 서버에 상태 -> 취소접수로 변경 요청
  const PutCancel = async (e) => {
    e.preventDefault();

    const cancelbody = {
        orderId: orderId,
        status: '취소접수',
        requestReason: reason,
        requestReasonComment: requestReasonComment
    };


    let response; // response 변수를 함수 내에서 선언하여 여러 번 사용할 수 있도록 함.

    try {
        response = await axios.put(
            `${API_URL}/api/orders/${orderId}`,
            cancelbody,
            { withCredentials: true }
        );

        console.log('취소 접수 요청 내역 확인:', cancelbody);
        console.log(response.data.data); // 초기 요청에 대한 응답 처리
        setCancelModal(false);
        fetchData();

    } catch (error) {
        console.log('취소 접수 요청 내역 확인:', cancelbody);
        console.log(error);

        // 401: 토큰 만료된 경우
        if (error.response && error.response.status === 401) {
            try {
                console.log('401 에러 발생, 리프레시 토큰 요청 중...');
                
                // 리프레시 토큰 요청
                const newAccessToken = await refreshToken();

                // 새롭게 발급받은 액세스 토큰으로 다시 요청
                response = await axios.put(
                    `${API_URL}/api/orders/${orderId}`,
                    cancelbody,
                    {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`, // 새 토큰을 Authorization 헤더에 포함
                        },
                        withCredentials: true,
                    }
                );

                console.log('Refetched data:', response.data);  // 리프레시 후 응답 확인
                setCancelModal(false);
                fetchData();
                // 재요청 후 데이터 확인
                if (response.data && response.data.data) {
                    console.log(response.data.data);
                } else {
                    console.log('Refetch 후 데이터 없음');
                }
                
            } catch (refreshError) {
                console.error('Error after refreshing token:', refreshError);
            }
        } else {
            console.log('401 에러가 아닌 다른 에러 발생');
        }
    }
};

//  반품접수 - 서버에 상태 -> 반품접수로 변경 요청
const PutRefund = async (e) => {
    e.preventDefault();

    const Refundbody = {
        orderId: orderId,
        status: status,
        requestReason: reason,
        requestReasonComment: requestReasonComment
    };


    let response; // response 변수를 함수 내에서 선언하여 여러 번 사용할 수 있도록 함.

    try {
        response = await axios.put(
            `${API_URL}/api/orders/${orderId}`,
            Refundbody,
            { withCredentials: true }
        );

        console.log('반품 접수 요청 내역 확인:', Refundbody);
        console.log(response.data.data); // 초기 요청에 대한 응답 처리
        setRefundModal(false);
        fetchData();

    } catch (error) {
        console.log('취소 접수 요청 내역 확인:', Refundbody);
        console.log(error);

        // 401: 토큰 만료된 경우
        if (error.response && error.response.status === 401) {
            try {
                console.log('401 에러 발생, 리프레시 토큰 요청 중...');
                
                // 리프레시 토큰 요청
                const newAccessToken = await refreshToken();

                // 새롭게 발급받은 액세스 토큰으로 다시 요청
                response = await axios.put(
                    `${API_URL}/api/orders/${orderId}`,
                    Refundbody,
                    {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`, // 새 토큰을 Authorization 헤더에 포함
                        },
                        withCredentials: true,
                    }
                );

                console.log('Refetched data:', response.data);  // 리프레시 후 응답 확인
                setRefundModal(false);
                fetchData();
                // 재요청 후 데이터 확인
                if (response.data && response.data.data) {
                    console.log(response.data.data);
                } else {
                    console.log('Refetch 후 데이터 없음');
                }
                
            } catch (refreshError) {
                console.error('Error after refreshing token:', refreshError);
            }
        } else {
            console.log('401 에러가 아닌 다른 에러 발생');
        }
    }
};
    return (
        
        <div className="myorder">
            <Sidebar />
            <div className='myorder-section'>
            {cancelModal && (
                    <div className='cancel-modal'>
                        <form className='cancel-write' onSubmit={PutCancel}>
                            <div className='x-btn-section'>
                                <h4 className='cancel-write-head'>취소접수</h4>
                                <button type="button" onClick={closeCancel}>x</button>
                            </div>
                            <label>
                                <input type="radio" name="cancel-option" value="단순변심" onChange={cancelOnChange}/> 단순변심
                            </label>
                            <label>
                                <input type="radio" name="cancel-option" value="재주문 예정" onChange={cancelOnChange}/> 다른 상품 추가 후 재주문 예정
                            </label> 
                            <label>
                                <input type="radio" name="cancel-option" value="기타사유" onChange={cancelOnChange}/> 기타사유
                            </label>
                            <textarea
                            value={requestReasonComment} 
                            onChange={cancelCommentOnChange}
                            />
                            <button type='submit'>접수</button>
                        </form>
                    </div>
                )}

                {refundModal && (
                    <div className='cancel-modal'>
                        <form className='cancel-write' onSubmit={PutRefund}>
                            <div className='x-btn-section'>
                                <h4 className='cancel-write-head'>반품 & 교환 접수</h4>
                                <button type="button" onClick={closeRefund}>x</button>
                            </div>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="" disabled hidden>접수 구분 선택</option>
                                    <option value="반품접수">반품</option>
                                    <option value="교환접수">교환</option>
                                </select>
                            <label>
                                <input type="radio" name="cancel-option" value="단순변심" onChange={cancelOnChange}/> 단순변심
                            </label>
                            <label>
                                <input type="radio" name="cancel-option" value="배송오류" onChange={cancelOnChange}/> 배송 오류
                            </label> 
                            <label>
                                <input type="radio" name="cancel-option" value="상품 파손" onChange={cancelOnChange}/> 상품 파손
                            </label>
                            <textarea 
                            value={requestReasonComment} 
                            onChange={cancelCommentOnChange}
                            placeholder='사유를 상세하게 작성해주세요.'
                            />
                            <button type='submit'>접수</button>
                        </form>
                    </div>
                )}
                <h2>주문배송조회</h2>
                <div className='myorder-th'>
                    <span className='th-img'></span>
                    <span className='th-item'>상품정보</span>
                    <span className='th-status'>진행상태</span>
                    <span className='th-btn'>구매확정</span>
                </div>

                
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((order) => (
                        <div className='myorder-list' key={order.orderId}>
                            
                                <div className='myorder-date'>
                                    <span>주문일자: {order.orderDate}</span>
                                    <span>주문번호: {order.orderId}</span>
                                    <div className='myorder-btn'>
                                            {order.status === '결제완료' && (
                                                <button className='cancel-btn' onClick={() => openCancel(order.orderId)}>취소접수</button>
                                            )}
                                            {order.status === '배송완료' && (
                                                <button className='cancel-btn' onClick={() => openRefund(order.orderId)}>반품접수</button>
                                            )}
                                        </div>
                                </div>
                               
                                        <>
                                    <ul className='myorder-items'>
                                    {order.items.map((item, itemIndex) => (
                                    <li className='myorder-li' key={itemIndex}>
                                    <Link className='myorder-link' to={`/MyPage/MyOrder/MyOrderDetail/${order.orderId}`}>
                                    <div className='myorder-itemimg'>이미지영역</div>
                                    <div className='myorder-item'>
                                        <p>상품명: {item.orderItem}</p>
                                        <p>수량: {item.quantity}</p>
                                        <p>가격: {item.price}</p>
                                    </div>
                                    <div className='myorder-status'>
                                    <p>{order.status}</p>
                                </div>
                             </Link>
                            </li>
                            ))}
                         </ul>
                        </>
                        </div>
                    ))
                ) : (
                    <div className='myorder-list'>주문내역이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default MyOrder;



// const fetchData = async () => {
//     try {
//         const response = await axios.post(`${API_URL}/api/orders/shippingList`, {loginId }, {
//             withCredentials: true 
//         });
//         console.log(1);
//         console.log('Fetched data:', response.data); // 전체 응답 로그 확인
//         if (response.data && response.data.data) {
//           console.log(2);
//             setData(response.data.data);
//         } else {
//           console.log(3);
//             setError("No data found");
//         }
//     } catch (error) {
//       console.log(4);
//         console.error('Error fetching data:', error);
//         // 401: token expired
//         if (error.response && error.response.status === 401) {
//             try {
//               console.log(5);
//                 await axios.get(`${API_URL}/api/auth/refreshToken`, { withCredentials: true });
//                 const response = await axios.post(`${API_URL}/api/orders/shippingList`, {loginId}, {
//                     withCredentials: true
//                 });
//                 console.log(6);
//                 console.log('Fetched data after token refresh:', response.data); // 전체 응답 로그 확인
//                 if (response.data && response.data.data) {
//                     setData(response.data.data);
//                     console.log(7);
//                 } else {
//                     setError("No data found");
//                     console.log(8);
//                 }
//             } catch (refreshError) {
//               console.log(9);
//                 console.error('Error refreshing token:', refreshError);
//                 setError("Failed to refresh token");
//             }
//         } else {
//             setError("Failed to fetch data");
//         }
//     }
// };