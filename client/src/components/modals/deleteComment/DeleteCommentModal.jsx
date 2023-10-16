import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {commentAPI} from "../../../services/CommentService";
import {
    changeVisibleDeleteCommentModal,
    changeVisibleSuccessRespModal,
    changeSuccessRes
} from "../../../redux/slices/VisibleModalSlice";

import MyButton from "../../myButton/MyButton";
import Loader from "../../loader/Loader";
import Modal from "@mui/material/Modal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import s from './DeleteCommentModal.module.css';


const DeleteCommentModal = ({comment}) => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleDeleteCommentModal);

    const handleClose = () => {
        dispatch(changeVisibleDeleteCommentModal({visibleDeleteCommentModal: false}));
    };


    /*удаление комментария*/
    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);

    const [deleteCommentUser, response] = commentAPI.useDeleteCommentMutation();

    const deleteComment = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await deleteCommentUser(comment.id);
    }

    const successRes = () => {
        dispatch(changeSuccessRes({successRes: "Комментарий успешно удален"}));
        dispatch(changeVisibleSuccessRespModal({visibleSuccessRespModal: true}));
    };

    useEffect(() => {
        if (response.data === `Комментарий успешно удален`) {
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
                            <textarea readOnly={true} value={comment.description}/>
                        </div>

                        <div className={s.modal_btn}>
                            <MyButton onClick={deleteComment}>
                                <h3>Удалить этот комментарий</h3>
                                <DeleteForeverIcon/>
                            </MyButton>

                            <MyButton onClick={handleClose}>
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

export default DeleteCommentModal;