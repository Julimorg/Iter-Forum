import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import 'home.css'


const Home = () => {
    return (
        <div>
            <h1>Welcome to Iter-Forum!</h1>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default Home;