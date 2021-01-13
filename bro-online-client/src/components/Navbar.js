import React from 'react';
import LogOutBtn from "./LogOutBtn";
import { Link } from 'react-router-dom';
import "./Navbar.css";

// TODO style via fb-clone OR like the social ape???
function Navbar() {
    return (
        <div>
            <Link to="/">Home</Link>
            <LogOutBtn />
        </div>
    )
}

export default Navbar;