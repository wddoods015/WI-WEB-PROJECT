import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './MyOrder.css';

const MyOrderDetail = () => {
    const [detailData, setDetailData] = useState(null); // 초기값을 null로 설정
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    const { orderid } = useParams(); // orderId를 구조 분해 할당하여 가져옵니다.
    
    // console.log(orderId);

    const fetchDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/orders/shippingDetail/${orderid}`, {
                withCredentials: true 
            });
            console.log(1);
            console.log(response.data.data);
            setDetailData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            // 401: token expired
            if (error.response && error.response.status === 401) {
                try {
                    await axios.get(`${API_URL}/api/auth/refreshToken`, {
                        withCredentials: true
                    });
                    const response = await axios.get(`${API_URL}/api/orders/shippingDetail/${orderid}`, {
                        withCredentials: true
                    });
                    setDetailData(response.data.data);
                } catch (refreshError) {
                    console.error("Error refreshing token:", refreshError);
                    setError("Failed to refresh token");
                }
            } else {
                setError("Failed to fetch data");
            }
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [orderid]); // orderId가 바뀔 때마다 데이터를 다시 가져오도록 설정
    console.log('주문상세',detailData);
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='myorder-detail'>  
            <Sidebar />
            <div className='detail-info'>
                <h2>주문배송조회 상세내역</h2>
                <div className='detail-item-info'>
                    <h4 className='sub-head'>주문상품정보</h4>
                    {detailData ? (
                        <>
                            <ul className='myorder-list'>
                                <div className='myorder-date'>
                                    <span>주문일자: {detailData.orderDate}</span>
                                    <span>주문번호: {detailData.orderId}</span>
                                </div>
                                {detailData.items.map((item, index) => (
                                    <li className='myorder-li' key={index}>
                                        <ul className='myorder-itemimg'>
                                            <img
                                                src={item.image_small}
                                                alt={item.productName}
                                            />
                                            이미지영역
                                        </ul>
                                        <ul className='myorder-item'>
                                            <p>상품명: {item.productName}</p>
                                            <p>수량: {item.quantity}</p>
                                            <p>가격: {item.price}원</p>
                                        </ul>
                                    </li>
                                ))}
                            </ul>
    
                            <div className='buyer-info'>
                                <h4 className='sub-head'>구매자정보</h4>
                                <table className='info-tb'>
                                    <tbody>
                                        <tr>
                                            <td>주문자</td>
                                            <th>{detailData.name || "이름 없음"}</th>
                                            <td>휴대폰 번호</td>
                                            <th>{detailData.phone || "번호 없음"}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
    
                            <div className='payments-info'>
                                <h4 className='sub-head'>결제정보</h4>
                                <table className='info-tb'>
                                    <tbody>
                                    <tr>
    <td>상품금액:</td>
    <th>
        {detailData.items.map((item, index) => (
            <div key={index}>
                {item.productName}: {item.price} * {item.quantity} = {item.price * item.quantity}원
            </div>
        ))}
       
    </th>
    <td rowSpan={2}>총 결제금액: </td>
    <th rowSpan={2}>{detailData.items.reduce((total, item) => total + (item.price * item.quantity), 0)}원원</th>
</tr>
                                        {/* <tr>
                                            <td>배송비:</td>
                                            <th>{detailData.deliveryFee || "0원"}</th>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
    
                            <div className='shipping-info'>
                                <h4 className='sub-head'>배송지정보</h4>
                                <table className='info-tb'>
                                    <tbody>
                                        <tr>
                                            <td>받는사람</td>
                                            <th>{detailData.Receiver || "이름 없음"}</th>
                                        </tr>
                                        <tr>
                                            <td>휴대폰 번호</td>
                                            <th>{detailData.phone || "번호 없음"}</th>
                                        </tr>
                                        <tr>
                                            <td>주소</td>
                                            <th>{detailData.Address1} / {detailData.Address2}</th>
                                        </tr>
                                        <tr>
                                            <td>배송요청사항</td>
                                            <th>{detailData.request || "요청사항 없음"}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div>주문 상세정보가 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
    
};

export default MyOrderDetail;
