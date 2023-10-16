import React from 'react';
import AppRouter from "./AppRouter";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/header/Header";
import styles from './App.css';

function App() {
    return (
        <div className={styles}>
            <BrowserRouter>
                <Header/>
                <AppRouter/>
            </BrowserRouter>
        </div>
    );
}

export default App;