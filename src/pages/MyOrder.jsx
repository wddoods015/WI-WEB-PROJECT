import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import './MyOrder.css';
import Sidebar from '../components/Sidebar';

//데이터 패칭 함수
const fetchData = async () => {
    const loginId = sessionStorage.getItem('id'); 

    try {
        const response = await axios.post('http://43.203.208.22:3000/api/orders/shippingList/',
            {loginId: loginId}
        );
       // console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
}


const MyOrder = () => {
    // useQuery 훅 사용 
   
    const { data, isLoading, error } = useQuery({
        queryKey: ['order'],
        queryFn: fetchData
      });
   //console.log('data:',data);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="myorder">
            <Sidebar />
            <div className='myorder-section'>
                <h2>주문배송조회</h2>
                <div className='myorder-th'>
                    <span className='th-img'></span>
                    <span className='th-item'>상품정보</span>
               
                    <span className='th-status'>진행상태</span>
                    <span>구매확정 및 리뷰</span>
                </div>   
            {data && data.map((order, index) => (
             <Link className='myorder-link' to={`/MyPage/MyOrder/MyOrderDetail/${order.orderId}`} >
   <div className='myorder-list'>
   <div className='myorder-date' key={index}>
       <span>주문일자:{order.orderDate}</span>
       <span>주문번호:{order.orderId}</span>
   </div>
   {order.items.map((item) => 
   <li className='myorder-li' key={index}>
    <ul className='myorder-itemimg'>이미지영역</ul>
   <ul className='myorder-item' >
       <p>상품명:{item.orderItem}</p>
       <p>수량:{item.quantity}</p>
       <p>가격:{item.price}</p>
   </ul>
  
   <ul className='myorder-status'>{order.status}</ul>
   <ul className='myorder-status'>{order.status === '준비중' ? (
        <ul><button>취소접수</button></ul>
      ) : order.status === 'done' ? (
        <ul><button>Review 버튼</button></ul>
      ) : null}</ul>
</li>
)}  
        </div>
        </Link>
            ))}
            </div>
        </div>
    );
}

export {fetchData, MyOrder};

