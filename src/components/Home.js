import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="background-gradient h-screen flex  flex-col justify-center items-center text-center">
      <div className="home-container">
      <h1 className="text-5xl font-bold text-pink-600 mb-4 font-Phudu">CAPTURING | booth</h1>
      
        <h4 className="text-lg text-gray-700 mb-6">
        Welcome to Capturing! Photobooth! Lumen & LifeVoyage.
        </h4>      
          
        <img src="/photobooth1.png" alt="photobooth strip" className="photobooth-strip"/>

        <button onClick={() => navigate("/welcome")} className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600  "
        >START</button>
        <footer className="mt-8 text-sm text-gray-600 text-center font-kanit">
        <p>Vsion 1.0.3</p>
  
</footer>


      </div>
    </div>
    );
  };

export default Home;