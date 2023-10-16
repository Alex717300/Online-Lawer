import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {changeCheckedAgree} from "../../redux/slices/AuthSlice";
import {
    changeVisibleChangePasswordModal,
    changeVisibleLoginModal,
    changeVisibleRegistrationModal,
    changeVisibleResetPasswordModal,
    changeVisibleSendNumberPhoneModal
} from "../../redux/slices/VisibleModalSlice";

import CheckIcon from '@mui/icons-material/Check';

import soglasie from "../../static/soglasie-na-obrabotku-personalnyh-dannyh.pdf";

import s from './AgreeWithPolicy.module.css';


const AgreeWithPolicy = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const checked = useSelector(state => state.auth.checkedAgree);

    const handleChange = () => {
        dispatch(changeCheckedAgree({checkedAgree: !checked}))
    };

    const closeAllModals = () => {
        dispatch(changeVisibleSendNumberPhoneModal({visibleSendNumberPhoneModal: false}));
        dispatch(changeVisibleResetPasswordModal({visibleResetPasswordModal: false}));
        dispatch(changeVisibleChangePasswordModal({visibleChangePasswordModal: false}));
        dispatch(changeVisibleLoginModal({visibleLoginModal: false}));
        dispatch(changeVisibleRegistrationModal({visibleRegistrationModal: false}));
    }

    return (
        <div className={s.agree_policy}>

            {!checked &&
                <button className={s.check_without_icon}
                        onClick={handleChange}>
                </button>}

            {checked &&
                <button className={s.check_icon}
                    onClick={handleChange}>
                <CheckIcon />
            </button>}

            <div className={s.policy_text}>
                <p>&nbsp;  &nbsp;Я даю&nbsp;</p>
                <a href={soglasie} download>Согласие на обработку персональных данных</a>
                <p>&nbsp;и соглашаюсь с &nbsp;</p>
                <p className={s.policyLink}
                   onClick={() => closeAllModals(navigate(`/privacy`))}>Политикой обработки персональных данных</p>
            </div>
        </div>
    );
};

export default AgreeWithPolicy;