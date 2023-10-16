import React from 'react';
import {useNavigate} from "react-router-dom";

import Navbar from "../navbar/Navbar";
import law from '../../static/law5.jpg';
import MyButton from "../myButton/MyButton";

import s from "./MainPage.module.css";


const MainPage = () => {

    const navigate = useNavigate();

    return (
        <div className={s.mainPage}>

                <ul className={s.align}>
                    <li>
                        <figure className={s.book}>

                            {/* -- Front --*/}

                            <ul className={s.hardcover_front}>
                                <li >
                                    <div className={s.coverDesign}>
                                        <img src={law} alt={''}/>
                                    </div>
                                </li>
                                <li></li>
                            </ul>

                            {/* -- Pages --*/}

                            <ul className={s.page}>
                                <li></li>
                                <li>
                                    <Navbar/>
                                </li>
                                <li></li>
                                <li></li>
                                <li></li>

                            </ul>

                            {/* -- Back --*/}

                            <ul className={s.hardcover_back}>
                                <li></li>
                                <li></li>
                            </ul>
                            <ul className={s.book_spine}>
                                <li></li>
                                <li></li>
                            </ul>

                            <figcaption>
                                <h2>Навигация по сайту</h2>
                            </figcaption>

                        </figure>
                    </li>
                </ul>

            <MyButton style={{float:"right", marginRight:5}}
                      onClick={() => navigate(`/privacy`)}>
                <h4>Политика обработки персональных данных</h4>
            </MyButton>

        </div>
    );
};

export default MainPage;