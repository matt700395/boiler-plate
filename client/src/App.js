import './App.css';
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';



import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";



function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route exact path="/" element = {<LandingPage />} />
          <Route exact path="/login" element = {<LoginPage />} />
          <Route exact path="/register" element = {<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

