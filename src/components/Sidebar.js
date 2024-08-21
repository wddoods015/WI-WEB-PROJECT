// 경로 // src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";


const Sidebar = () => {
    return (
        <nav className="sidebar">
            <ul className="side-links">
            <li>
                <Link to="/">주문배송조희</Link>
                </li>
                <li>
                <Link to="/">취소/교환/반품 내역</Link>
                </li>  
                <li>
                <Link to="/">회원정보 수정</Link>
                </li>  
                <li>
                <Link to="Inquiries">1:1 문의내역</Link>
                </li>
                <li>
                <Link to="/">상품Q&A 내역</Link>
                </li>
                <li>
                <Link to="/">공지사항</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;