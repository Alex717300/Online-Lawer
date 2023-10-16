import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {commentAPI} from "../../../services/CommentService";
import {changeVisibleDeleteCommentModal} from "../../../redux/slices/VisibleModalSlice";

import Moment from "react-moment";
import * as moment from "moment";

import MyButton from "../../myButton/MyButton";
import Loader from "../../loader/Loader";
import DeleteCommentModal from "../../modals/deleteComment/DeleteCommentModal";
import ErrorModal from "../../modals/error/ErrorModal";
import SuccessRespModal from "../../modals/successResp/SuccessRespModal";
import ErrorForbiddenModal from "../../modals/error/ErrorForbiddenModal";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import s from './CommentModeration.module.css';


const CommentModeration = () => {

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

    const {data: comments, isLoading, refetch} = commentAPI.useGetForModerationQuery(userId, {count:1});

    const [emtpyComments, setEmtpyComments] = useState('');

    useEffect(() => {
        if (!comments || comments.length === 0) {
            refetch();
            setEmtpyComments("Нет комментариев для модерации")
        }
        if (comments && comments.length > 0) {
            setEmtpyComments("")
        }
    }, [comments]);

    const [commentOne, setCommentOne] = useState(false);

    /*подтверждение, что комментарий прошел модерацию*/
    const [updateAfterModeration] = commentAPI.useUpdateAfterModerationMutation();

    const updateCommentModerationStatus = async (comment) => {
      const commentId = comment.id;
        const bodyComment = ({commentId, userId});
        await updateAfterModeration(bodyComment);
    }


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


    /*открытие модального окна успешного удаления комментария*/
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

    /*открытие модального окна ошибки доступа*/
    const visibleErrorForbiddenMod = useSelector(state => state.visibleModal.visibleErrorForbiddenModal);
    const [visibleErrorForbiddenModal, setVisibleErrorForbiddenModal] = useState(false);

    useEffect(() => {
        setVisibleErrorForbiddenModal(visibleErrorForbiddenMod);
    }, [visibleErrorForbiddenMod]);

    return (
        <div>

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

                                        <MyButton style={{height:30, justifyContent: "center"}}
                                            onClick={() => updateCommentModerationStatus(comment)}>
                                            <h3>Разрешить публикацию</h3>
                                            <BorderColorIcon sx={{marginLeft: 1}}/>
                                        </MyButton>

                                        <MyButton style={{height:30, marginTop:10, justifyContent: "center"}}
                                                  onClick={() => openDeleteComment(comment)}>
                                            <h3>Удалить</h3>
                                            <DeleteForeverIcon sx={{marginLeft: 1}}/>
                                        </MyButton>

                                    </div>

                                </div>
                            ))}
                    </div>

                </div>}

            {visibleDeleteCommentModal && <DeleteCommentModal comment={commentOne}/>}

            {visibleErrorModal && <ErrorModal/>}

            {visibleErrorForbiddenModal && <ErrorForbiddenModal/>}

            {visibleSuccessRespModal && <SuccessRespModal/>}

        </div>
    );
};

export default CommentModeration;