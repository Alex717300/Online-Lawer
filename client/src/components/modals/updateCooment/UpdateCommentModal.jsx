import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    changeSuccessRes,
    changeVisibleUpdateCommentModal,
    changeVisibleSuccessRespModal
} from "../../../redux/slices/VisibleModalSlice";
import {commentAPI} from "../../../services/CommentService";

import MyButton from "../../myButton/MyButton";
import Modal from "@mui/material/Modal";
import Loader from "../../loader/Loader";

import s from './UpdateCommentModal.module.css';


const UpdateCommentModal = ({comment}) => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleUpdateCommentModal);

    const handleClose = () => {
        dispatch(changeVisibleUpdateCommentModal({visibleUpdateCommentModal: false}));
    };

    /*редактирование комментария*/
    const commentId = comment.id
    const [description, setDescription] = useState(comment.description);
    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [successResp, setSuccessResp] = useState('');

    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const bodyComment = ({commentId, userId, description});

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
            setSuccessResp("Комментарий успешно изменен");
        }
        if (userRole === 'USER') {
            setSuccessResp("Комментарий успешно изменен и будет опубликован после модерации");
        }
    }, []);

    const [updateCommentUser, response] = commentAPI.useUpdateCommentMutation();

    const updateComment = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await updateCommentUser(bodyComment);
    };

    const successRes = () => {
        dispatch(changeSuccessRes({successRes: successResp}));
        dispatch(changeVisibleSuccessRespModal({visibleSuccessRespModal: true}));
    };

    useEffect(() => {
        if (response.data === `Комментарий успешно изменен`) {
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
                                    onClick={updateComment}
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

export default UpdateCommentModal;