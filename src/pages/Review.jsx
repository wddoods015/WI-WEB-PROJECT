import React, {useState, useEffect} from "react";
import './Review.css'
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Review = () => {
const API_URL = process.env.REACT_APP_API_URL;
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL; 
const loginId = sessionStorage.getItem('id');    
const [modalOpen, setModalOpen] = useState(false); 
const [reviewTag, setReviewTag] = useState('작성 가능한 리뷰');
// 조회할 리뷰 리스트 담을 상태
const [reviewList, setReviewList] = useState([]);
const [unwrittenList, setUnwrittenList] = useState([]);
const [reviews, setReviews] = useState([{
  comment: "",
  rating: "",
  reviewId: unwrittenList.reviewId,
  image: {
    
  }
}]);

const OpenModal = () => {
    setModalOpen(true);
};

const closeModal = () => {
    setModalOpen(false);
};

const tagClick = (e) => {
    setReviewTag(e.target.value); 
    };


// 작성한 리뷰 조회 get요청 
const getReviewList = async () => {
  
    try {
        const response = await axios.get(`${API_URL}/api/reviews/myReviewList/${loginId}`, {
            withCredentials: true // 쿠키를 포함하여 요청  
          });
          console.log('조회데이터확인', response.data.data);
          setReviewList(response.data.data);
    } catch (error) {
        console.log(' catch Error getting reviewlist:', error);
        if (error.response.status === 401){
            try {
                const newAccessToken = await refreshToken();
                const refreshRes = await axios.get(`${API_URL}/api/reviews/myReviewList/${loginId}`, {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,  // 새로운 토큰으로 인증 헤더 설정
                    },
                    withCredentials: true,
                });
                  setReviewList(refreshRes.data.data);
                  console.log('토큰처리후조회데이터확인', refreshRes.data.data);
            } catch (refreshError) {
                console.error('Error after refreshing token:', refreshError);
                console.log("Failed to refresh token");
            }
    } else {
        console.log("Failed to fetch data");
    }
};
};

// 미작성한 리뷰 조회 get요청 
const getUnwrittenList = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/reviews/getAvailableReviewItem/${loginId}`, {
            withCredentials: true // 쿠키를 포함하여 요청  
          });
          console.log('미작성조회데이터확인', response.data.data);
          setUnwrittenList(response.data.data);
    } catch (error) {
        console.log(' catch Error getting reviewlist:', error);
        if (error.response.status === 401){
            try {
                const newAccessToken = await refreshToken();
                const refreshRes = await axios.get(`${API_URL}/api/reviews/getAvailableReviewItem/${loginId}`, {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,  // 새로운 토큰으로 인증 헤더 설정
                    },
                    withCredentials: true,
                });
                setUnwrittenList(refreshRes.data.data);
                  console.log('토큰처리후조회미작성데이터확인', refreshRes.data.data);
            } catch (refreshError) {
                console.error('Error after refreshing token:', refreshError);
                console.log("Failed to refresh token");
            }
    } else {
        console.log("Failed to fetch data");
    }
};
};

useEffect(() => {
    getUnwrittenList();
    getReviewList();
    
}, []);

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


// 미작성한 리뷰 작성 post 요청 

const reviewOnchange = (e) => {
  setReviews(e.target.value);
};

const  postReview = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/reviews/`,{
      withCredentials: true,
  });
    console.log('리뷰 post 응답', response.data.data);
  } catch (error) {

  }
};

    return (
        <div className="review">
            <Sidebar/>
            <div className="review-section">
            <h1>리뷰</h1>
            <div className="review-category">
            <button className='review-category-tag' value='작성 가능한 리뷰' onClick={tagClick}>작성 가능한 리뷰</button> / <button className='review-category-tag' value="내 리뷰" onClick={tagClick}>내 리뷰</button>
            </div>
            
            {modalOpen && (
              <div className="modal-bg">
                {unwrittenList.map((unwrittenReview, index) => (
            <form className="review-form" onSubmit={postReview}>
            <button onClick={closeModal} className="review-x-btn">x</button>    
            <div className="item-div">
            <img 
              src={`${IMAGE_URL}/${unwrittenReview.productName}/${unwrittenReview.image_small}`} 
              alt={unwrittenReview.productName} 
              className="review-image"
            />
             <div> 
             <div>{unwrittenReview.description}</div>
              가격: {unwrittenReview.price} / 수량: {unwrittenReview.quantity}
              </div>
            </div>
            <div className="rate-div">
               <span>상품은 어떠셨나요?</span> 
               <select className="rate-select" value={reviews.rating} onChange={reviewOnchange}>
               <option value="별점 입력" selected disabled hidden>별점 입력</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
               </select>
            </div>
            <div><input type="file"/></div>
            <div className="txtarea-div">
                <textarea
                placeholder="상품은 어떠셨나요? 후기를 공유해주세요 : )"
                value={reviews.comment}
                className="review-txtarea"
                />
                </div>
            <button>등록하기</button>
            </form>
            ))} 
            </div>)}

            {reviewTag === '작성 가능한 리뷰' ? 
           
  <ul className="review-ul">
     {unwrittenList.map((unwrittenReview, index) => (
    <li className="review-li" key={index}>
      <div className="review-div-1">
        <div>
        <img 
              src={`${IMAGE_URL}/${unwrittenReview.productName}/${unwrittenReview.image_small}`} 
              alt={unwrittenReview.productName} 
              className="review-image"
            />
        </div>
      </div>
      <div className="review-div-2">
        <h5>{unwrittenReview.productName}</h5>
      </div>
      <div className="review-div-3">
        <button className="review-btn" onClick={OpenModal}>작성</button>
        
      </div>
    </li>
     ))} 
  </ul>
: 
  <ul className="review-ul">
    {reviewList.map((review, index) => (
      <li className="review-li" key={index}>
        <div className="review-div-1">
          <div>
            <img 
              src={`${IMAGE_URL}/${review.productName}/${review.image_small}`} 
              alt={review.productName} 
              className="review-image"
            />
          </div>
          <div>{review.productName}</div>
          <div className="help-count-div">
            <span>👍 {review.helpCount}</span>
            <span>👎 {review.noHelpCount}</span>
          </div>
        </div>
        <div className="review-div-2">
          <span>{review.comment}</span>
          <div>평점: {review.rating}점</div>
        </div>
        <div className="review-div-3">
          <button className="review-btn">수정</button>
          <button className="review-btn">삭제</button>
          <span>{review.date}</span>
        </div>
      </li>
    ))}
  </ul>
}
            </div> 
                
        </div>
    );
};

export default Review;