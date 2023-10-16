import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {commentAPI} from "../../../services/CommentService";

import {changeVisibleAddCommentModal,
    changeVisibleSuccessRespModal,
    changeSuccessRes} from "../../../redux/slices/VisibleModalSlice";

import MyButton from "../../myButton/MyButton";
import Loader from "../../loader/Loader";
import Modal from "@mui/material/Modal";

import s from './AddCommentModal.module.css';


const AddCommentModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleAddCommentModal);

    const handleClose = () => {
        dispatch(changeVisibleAddCommentModal({visibleAddCommentModal: false}))
    };

    /*добавление комментария*/
    const [description, setDescription] = useState('');
    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [successResp, setSuccessResp] = useState('');

    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const bodyComment = ({userId, description});

    useEffect(() => {
        if (description) {
            setDisabledBtn(false);
        }
        if (!description) {
            setDisabledBtn(true);
        }
    }, [description]);

    useEffect(() => {
        if (userRole === 'ADMIN') {
            setSuccessResp("Комментарий успешно добавлен");
        }
        if (userRole === 'USER') {
            setSuccessResp("Комментарий успешно добавлен и будет опубликован после модерации");
        }
    }, []);

    const [addCommentUser, response] = commentAPI.useAddCommentMutation();

    const addComment = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await addCommentUser(bodyComment);
    };

    const successRes = () => {
        dispatch(changeSuccessRes({successRes: successResp}));
        dispatch(changeVisibleSuccessRespModal({visibleSuccessRespModal: true}));
    };

    useEffect(() => {
        if (response.data === `Комментарий успешно добавлен`) {
            successRes();
            handleClose();
        }
    }, [response]);

    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                {visibleMainMenu &&
                    <>
                        <div className={s.modal_inp}>
                        <textarea
                            placeholder="Добавьте комментарий"
                            value={description}
                            onChange={e => setDescription(e.target.value)}/>
                            <MyButton onClick={() => setDescription('')}
                            style={{marginRight:5}}>
                                <h3>Очистить</h3>
                            </MyButton>
                        </div>

                        <div className={s.modal_btn}>
                            <MyButton disabled={disabledBtn}
                                    onClick={addComment}
                                    style={{borderRadius: 4}}>
                                <h3>Сохранить</h3>
                            </MyButton>

                            <MyButton onClick={handleClose}
                                    style={{borderRadius: 4}}>
                                <h3>Отмена</h3>
                            </MyButton>
                        </div>
                    </>
                }

                {visibleLoader && <Loader/>}

            </div>
        </Modal>
    );
};

export default AddCommentModal;