// src/App.js 
import React from "react";
import { BrowserRouter as Router, Route, Routes, Nav } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyLike from "./pages/MyLike";
import MyPage from "./pages/MyPage";
import ShoppingCart from "./pages/ShoppingCart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 설치
import {PrivateRoute} from './components/PrivateRoute';


const App = () => {
  return (    
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MyLike" element={<PrivateRoute element={<ShoppingCart />} />} />
          <Route path="/MyPage" element={<PrivateRoute element={<MyPage />} />} />
          <Route path="/ShoppingCart" element={<PrivateRoute element={<ShoppingCart />} />}  />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} /> 
        </Routes>
      </div>
    </Router>
    
  );
};

export default App;
