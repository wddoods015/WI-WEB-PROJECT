import React, {useState} from "react";
import './Review.css'
import Sidebar from "../components/Sidebar";

const Review = () => {
    
const [modalOpen, setModalOpen] = useState(false); 
const [reviewTag, setReviewTag] = useState('작성 가능한 리뷰');


const OpenModal = () => {
    setModalOpen(true);
};

const closeModal = () => {
    setModalOpen(false);
};

const tagClick = (e) => {
    setReviewTag(e.target.value); 
    };

    return (
        <div className="review">
            <Sidebar/>
            <div className="review-section">
            <h1>리뷰</h1>
            <div className="review-category">
            <button className='review-category-tag' value='작성 가능한 리뷰' onClick={tagClick}>작성 가능한 리뷰</button> / <button className='review-category-tag' value="내 리뷰" onClick={tagClick}>내 리뷰</button>
            </div>
            {modalOpen && (<div className="modal-bg">
            <form className="review-form">
            <button onClick={closeModal}>x</button>    
            <div>상품정보</div>
            <div>상품은 어떠셨나요?</div>
            <div><input type="file"/></div>
            <div><textarea/></div>
            <button>등록하기</button>
            </form>
            </div>)}
            
            {reviewTag === '작성 가능한 리뷰' ?   
            <ul className="review-ul">
                <li className="review-li">
                <div className="review-div-1">
                    상품정보
                </div>
                <div className="review-div-2">
                </div>
                <div className="review-div-3">
                <button className="review-btn" onClick={OpenModal}>작성</button>
                </div>
                </li>
            </ul>
            : <ul className="review-ul">
            <li className="review-li">
                <div className="review-div-1">
                    상품정보
                </div>
                <div className="review-div-2">
                    2024.08.15
                </div>
                <div className="review-div-3">
                    <button className="review-btn">삭제</button>
                </div>
            </li>
            </ul>}
       
            </div> 
        </div>
    );
};

export default Review;