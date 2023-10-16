import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {commentAPI} from "../../../services/CommentService";
import {
    changeVisibleDeleteCommentModal,
    changeVisibleUpdateCommentModal
} from "../../../redux/slices/VisibleModalSlice";

import Moment from 'react-moment';
import * as moment from 'moment';

import MyButton from "../../myButton/MyButton";
import Loader from "../../loader/Loader";
import ErrorModal from "../../modals/error/ErrorModal";
import UpdateCommentModal from "../../modals/updateCooment/UpdateCommentModal";
import DeleteCommentModal from "../../modals/deleteComment/DeleteCommentModal";
import SuccessRespModal from "../../modals/successResp/SuccessRespModal";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import s from './CommentEditor.module.css';
import {Tooltip} from "@mui/material";


const CommentEditor = () => {

    Moment.globalMoment = moment;
    Moment.globalFormat = 'DD-MM-YYYYг. HH:mm';

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    function refreshPage() {
        window.location.reload();
    }

    useEffect(() => {
        if (!userId) {
            localStorage.clear();
            navigate(`/`);
            refreshPage();
        }
    }, [userId]);

    const {data: comments, isLoading, refetch} = commentAPI.useGetForEditorQuery(userId, {count: 1});

    const [emtpyComments, setEmtpyComments] = useState('');

    useEffect(() => {
        if (!comments || comments.length === 0) {
            refetch();
            setEmtpyComments("Ваши комментарии не найдены")
        }
        if (comments && comments.length > 0) {
            setEmtpyComments("")
        }
    }, [comments]);

    const [commentOne, setCommentOne] = useState(false);


    /*открытие модального окна редактирования комментария*/
    const visibleUpdateCommentMod = useSelector(state => state.visibleModal.visibleUpdateCommentModal);
    const [visibleUpdateCommentModal, setVisibleUpdateCommentModal] = useState(false);

    useEffect(() => {
        setVisibleUpdateCommentModal(visibleUpdateCommentMod);
    }, [visibleUpdateCommentMod]);

    const openUpdateComment = (comment) => {
        setCommentOne(comment);
        dispatch(changeVisibleUpdateCommentModal({visibleUpdateCommentModal: true}))
    };


    /*открытие модального окна удаления комментария*/
    const visibleDeleteCommentMod = useSelector(state => state.visibleModal.visibleDeleteCommentModal);
    const [visibleDeleteCommentModal, setVisibleDeleteCommentModal] = useState(false);

    useEffect(() => {
        setVisibleDeleteCommentModal(visibleDeleteCommentMod);
    }, [visibleDeleteCommentMod]);

    const openDeleteComment = (comment) => {
        setCommentOne(comment);
        dispatch(changeVisibleDeleteCommentModal({visibleDeleteCommentModal: true}))
    };


    /*открытие модального окна успешного редактирования/удаления комментария*/
    const visibleSuccessRespMod = useSelector(state => state.visibleModal.visibleSuccessRespModal);
    const [visibleSuccessRespModal, setVisibleSuccessRespModal] = useState(false);

    useEffect(() => {
        setVisibleSuccessRespModal(visibleSuccessRespMod);
    }, [visibleSuccessRespMod]);

    /*открытие модального окна ошибки*/
    const visibleErrModal = useSelector(state => state.visibleModal.visibleErrorModal);
    const [visibleErrorModal, setVisibleErrorModal] = useState(false);

    useEffect(() => {
        setVisibleErrorModal(visibleErrModal);
    }, [visibleErrModal]);

    return (
        <>

            {emtpyComments && <h2 style={{marginLeft: 20, fontStyle:"oblique"}}>{emtpyComments}</h2>}

            {isLoading && <Loader/>}


            {!emtpyComments &&
                <div className={s.comment}>
                    <div className={s.all_comments}>
                        {comments &&
                            comments.map((comment) => (
                                <div key={comment.id} className={s.all_comments_editor}>
                                    <div className={s.comments}>

                                        <div className={s.commentHead}>
                                            <h4>{comment.userName}, &nbsp; </h4>
                                            <Moment>{comment.createdAt}</Moment>
                                        </div>

                                        <span>{comment.description}
                                            <hr/>
                                        </span>

                                    </div>


                                    <div className={s.commentsBtn}>

                                        <MyButton style={{height:35}}
                                            onClick={() => openUpdateComment(comment)}>
                                            <Tooltip componentsProps={{tooltip: {sx: {fontSize: 15, color: "greenyellow"}}}}
                                                     placement="right-end"
                                                     title="Редактировать">
                                            <BorderColorIcon/>
                                            </Tooltip>
                                        </MyButton>

                                        <MyButton style={{marginTop:10, height:35}}
                                                  onClick={() => openDeleteComment(comment)}>
                                            <Tooltip componentsProps={{tooltip: {sx: {fontSize: 15, color: "greenyellow"}}}}
                                                     placement="right-end"
                                                     title="Удалить">
                                                <DeleteForeverIcon/>
                                            </Tooltip>
                                        </MyButton>

                                    </div>

                                </div>
                            ))}
                    </div>

                </div>}


            {visibleUpdateCommentModal && <UpdateCommentModal comment={commentOne}/>}

            {visibleDeleteCommentModal && <DeleteCommentModal comment={commentOne}/>}

            {visibleErrorModal && <ErrorModal/>}

            {visibleSuccessRespModal && <SuccessRespModal/>}
        </>
    );
};

export default CommentEditor;