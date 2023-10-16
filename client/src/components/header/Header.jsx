import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {changeVisibleLoginModal, changeVisibleLogoutModal} from "../../redux/slices/VisibleModalSlice";
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';
import AuthModals from "../authModals/AuthModals";
import MyButton from "../myButton/MyButton";

import s from './Header.module.css';


const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*открытие модального окна авторизации*/
    const openLoginModal = () => {
        dispatch(changeVisibleLoginModal({visibleLoginModal: true}));
    };

    /*открытие модального окна выхода (logout)*/
    const openLogoutModal = () => {
        dispatch(changeVisibleLogoutModal({visibleLogoutModal: true}));
    };

    /*Проверка авторизации*/
    const authUser = useSelector(state => state.auth.authorization);
    const userName = localStorage.getItem('userName');
    const [welcomeUser, setWelcomeUser] = useState(false);

    useEffect(() => {
        if (authUser || userName) {
            setWelcomeUser(true);
        }
        if (!authUser && !userName) {
            setWelcomeUser(false);
        }
    }, [authUser, userName]);


    return (

        <div>

            <div className={s.header_top}>
                <MyButton style={{marginLeft:5}}
                    onClick={() => navigate(`/`)}>
                    <HouseSidingIcon sx={{marginRight:1}}/>
                    <h3>ГЛАВНАЯ</h3>
                </MyButton>

                <div className={s.headerName}>

                    <h1>
                        <span>ОНЛАЙН &nbsp; ЮРИСТ</span>
                    </h1>

                </div>

                {!welcomeUser && <MyButton style={{marginRight:5}} onClick={openLoginModal}>
                    <AccountCircle/>
                    <h3>Войти</h3>
                </MyButton>}

                {welcomeUser &&
                    <div className={s.entry_user}>
                        <MyButton style={{ marginRight:10 , cursor: "default", pointerEvents: "none"}}>
                            <h3>Привет, {userName}</h3>
                        </MyButton>

                        <MyButton style={{marginRight:5}}
                            onClick={openLogoutModal}>
                            <h3>Выход</h3>
                            <LogoutIcon sx={{marginLeft: 1}}/>
                        </MyButton>
                    </div>}
            </div>

            {<AuthModals/>}

        </div>
    );
};

export default Header;