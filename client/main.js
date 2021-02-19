import React from 'react';
import { render } from 'react-dom';
import App from "./App";
import { BrowserRouter } from "react-router-dom";

//Styles
import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);