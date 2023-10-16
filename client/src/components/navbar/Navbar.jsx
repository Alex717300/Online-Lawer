import React from 'react';
import {useNavigate} from "react-router-dom";

import s from './Navbar.module.css'


const Navbar = () => {

    const navigate = useNavigate();

    return (
        <>

            <div className={s.navbar}>

                <button onClick={() => navigate(`/serviceslist`)}>
                    <h1>
                        <span>Услуги</span>
                    </h1>
                </button>

                <button onClick={() => navigate(`/contacts`)}>
                    <h1>
                        <span>Контакты</span>
                    </h1>
                </button>

                <button onClick={() => navigate(`/comments`)}>
                    <h1>
                        <span>Комментарии</span>
                    </h1>
                </button>

            </div>

        </>
    );
};

export default Navbar;