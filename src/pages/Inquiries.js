import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 
import './pages.css';

// 추가할것, 해당 유저만 접근가능하게, post, get 로직, 등록시 테이블 추가되도록


const Inquiries = () => {
    const [open, setOpen] = useState(false); // 모달창 오픈 상태
    const [inquiries, setInquiries] = useState([]);
    const [inquiryId, setInquiryId] = useState('');
    const [inquiryCategory, setInquiryCategory] = useState('');
    const [inquiryTitle, setInquiryTitle] = useState(''); 
    const [userComment, setUserComent] =useState(''); 
    const [productID, setProductID] =useState('');
    const loginId = sessionStorage.getItem('id') 


    // 문의 작성 데이터 상태   
    const categoryOnChange = (e) => {
        setInquiryCategory(e.target.value);
    };

    const titleOnChange = (e) => {
        setInquiryTitle(e.target.value);
    };

    const comentOnChange = (e) => {
        setUserComent(e.target.value);
    };
    
    const productIDOnChange = (e) => {
        setProductID(e.target.value);
    };

    let body = {
        inquiryCategory: inquiryCategory,
        inquiryTitle: inquiryTitle,
        userComment: userComment,
        productId:productID,
        loginId: loginId,
    }

   // 문의 데이터 post 하기
    const handleSubmit = async (e) => { 
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://43.203.208.22:3000/api/productInquiries', // URL
                body,         // 요청 본문
                { headers: { 'Content-Type': 'application/json' } } // 요청 설정
            );
    
            // 응답 처리
           // console.log(body);
            console.log(response.data);
            alert('문의가 등록되었습니다.');
            setInquiryId(response.data.inquiryId);

        } catch (error) {
            // 오류 처리
            console.error('Error submitting inquiry:', error);
        }
    };

    useEffect(() => {
        const getInquiry = async () => {
            try {
                const res = await axios.get( `http://43.203.208.22:3000/api/productInquiries/${inquiryId}`)
                console.log(res.data[0]);
                setInquiries(res.data[0]);
            } catch (error) {
                console.error('get오류:', error);
            }
        };
        getInquiry();
    }, [inquiryId]); // inquiryId가 변경될 때마다 실행
    


    const modalOpen = () => {
        setOpen(!open);
    };

    return (
        <div className='Qnamantoman'>
            <Sidebar />
            <div className='qna'>
                <h1>1:1 문의내역</h1>
                <p>한번 등록한 상담내용은 수정이 불가능합니다.</p>
                <button className='modal-open' onClick={modalOpen}> {open ? '닫기' : '작성하기'}</button>
                {open && (
                    <div className='qna-modal'>
                        <form className='qna-writie' onSubmit={handleSubmit}>
                            <select name="inquiryCategory" value={inquiryCategory} onChange={categoryOnChange}>
                            <option value="구매관련문의">구매관련문의</option>
                            <option value="일반상담문의">일반상담문의</option>
                            <option value="기타문의">기타문의</option>
                            </select>
                            <label>주문 번호</label>
                            <input className='qna-title' name="productID" value={productID} onChange={productIDOnChange} placeholder='주문번호를 입력하세요.'></input>
                            <label>문의 제목</label>
                            <input className='qna-title' name="inquiryTitle" value={inquiryTitle} onChange={titleOnChange} placeholder='문의제목을 입력해주세요.'></input>
                            <label>문의내용</label>
                            <textarea className='qna-content' name="userComment" value={userComment} onChange={comentOnChange} placeholder='문의내용을 입력해주세요.'></textarea>
                            <button type="submit" className='qna-submit'>등록하기</button>
                        </form>
                    </div>
                )}
                
                <table className='qna-table'>
                    <thead>
                        <tr>
                            <th>상담구분</th>
                            <th>상담제목</th>
                            <th>작성일</th>
                            <th>답변유무</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{inquiries.inquiryCategory}</td>
                            <td>{inquiries.inquiryTitle}</td>
                            <td>{inquiries.inquiryDate}</td>
                            <td>YES</td>
                            <td><button>X</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inquiries;
