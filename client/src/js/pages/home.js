import React, { useState, useEffect } from 'react'
import Nav from '../components/nav';

const Home = (props) => {

    useEffect(() => {
        console.log('Home ready');
    }, [])


    return (
        <section>
            <Nav />
            <h1>Home</h1>
        </section>
    )
}

export default Home;