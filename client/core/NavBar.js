import React from 'react';
import {Link} from 'react-router-dom';

function NavBar(props) {
    return (
        <div>
            <Link to="/signin">Sign In</Link>
        </div>
    );
}

export default NavBar;