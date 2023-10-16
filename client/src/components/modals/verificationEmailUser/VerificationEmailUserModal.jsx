import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authAPI} from "../../../services/AuthService";
import {useNavigate, useParams} from "react-router-dom";
import {changeVisibleVerificationEmailUserModal} from "../../../redux/slices/VisibleModalSlice";

import Loader from "../../loader/Loader";
import Modal from "@mui/material/Modal";

import s from "./VerificationEmailUserModal.module.css";


const VerificationEmailUserModal = () => {

    const {activationLink} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleVerificationEmailUserModal);

    const handleClose = () => {
        dispatch(changeVisibleVerificationEmailUserModal({visibleVerificationEmailUserModal:false}))
    };

    const [visibleMainMenu, setVisibleMainMenu] = useState(false);
    const [visibleLoader, setVisibleLoader] = useState(false);


    /*отправка ссылки активации на сервер для подтверждения*/
    const [verificationEmailUser, response] = authAPI.useActivateLinkUserMutation();
    const [textRes, setTextRes] = useState('');

    useEffect(() => {
        if (activationLink) {
            setVisibleMainMenu(false);
            setVisibleLoader(true);
            verificationEmailUser(activationLink)
        }

    }, [activationLink]);

    useEffect(() => {
        if (response.status === `rejected`) {
            setVisibleLoader(false);
            setVisibleMainMenu(true);
            if (response.error.data) {
                setTextRes(response.error.data);
            }
            if (!response.error.data) {
                setTextRes("Непредвиденная ошибка");
            }
        }
        if (response.data) {
            setVisibleLoader(false);
            setVisibleMainMenu(true);
            localStorage.setItem('isActivated', true);
            setTextRes(response.data);
        }
    }, [response]);

    function refreshPage(){
        window.location.reload();
    }

    useEffect(() => {
        if (!open) {
            navigate(`/`);
            refreshPage();
        }

    }, [open]);

    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                {visibleMainMenu &&
                    <div>
                   <h3>{textRes}</h3>
                    <button onClick={handleClose}>OK</button>
                    </div>
                }

                {visibleLoader && <Loader/>}

            </div>
        </Modal>
    );
};

export default VerificationEmailUserModal;