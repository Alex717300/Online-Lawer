import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import TextareaAutosize from 'react-textarea-autosize';



import {commentAPI} from "../../../services/CommentService";
import {
    changeVisibleAddCommentModal,
    changeVisibleErrorEmailModal
} from "../../../redux/slices/VisibleModalSlice";

import Moment from 'react-moment';
import * as moment from 'moment';

import Loader from "../../loader/Loader";
import MyButton from "../../myButton/MyButton";
import AddCommentModal from "../../modals/addComment/AddCommentModal";
import ErrorModal from "../../modals/error/ErrorModal";
import SuccessRespModal from "../../modals/successResp/SuccessRespModal";

import s from './AllComments.module.css';


const AllComments = () => {

    Moment.globalMoment = moment;
    Moment.globalFormat = 'DD-MM-YYYYг. HH:mm';

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*получение всех, прошедших модерацию, комментариев*/
    const {data: comments, isLoading, refetch} = commentAPI.useGetAllCommentsQuery({count: 1});

    const [emtpyComments, setEmtpyComments] = useState('');

    useEffect(() => {
        if (!comments || comments.length === 0) {
            refetch();
            setEmtpyComments("Нет комментариев...")
        }
        if (comments && comments.length > 0) {
            setEmtpyComments("")
        }
    }, [comments]);

    /*Проверка авторизации*/
    const authUser = useSelector(state => state.auth.authorization);
    const userId = localStorage.getItem('userId');
    const isActivated = localStorage.getItem('isActivated');
    const userRole = localStorage.getItem('userRole');
    const [isAuth, setIsAuth] = useState(false);
    const [visibleAddCommentBtn, setVisibleAddCommentBtn] = useState(false);
    const [visibleCommentModerationBtn, setVisibleCommentModerationBtn] = useState(false);

    useEffect(() => {
        if (authUser || userId) {
            setVisibleAddCommentBtn(true);
        }
        if (!authUser && !userId) {
            setVisibleAddCommentBtn(false);
        }
    }, [authUser, userId]);

    useEffect(() => {
        if (visibleAddCommentBtn || isActivated) {
            setIsAuth(true);
        }
        if (!visibleAddCommentBtn || !isActivated) {
            setIsAuth(false);
        }
    }, [visibleAddCommentBtn, isActivated]);

    useEffect(() => {
        if (userRole === "ADMIN") {
            setVisibleCommentModerationBtn(true);
        } else {
            setVisibleCommentModerationBtn(false);
        }
    }, [userRole]);

    /*открытие модального окна добавления комментария*/
    const visibleAddCommentMod = useSelector(state => state.visibleModal.visibleAddCommentModal);
    const [visibleAddCommentModal, setVisibleAddCommentModal] = useState(false);

    useEffect(() => {
        setVisibleAddCommentModal(visibleAddCommentMod);
    }, [visibleAddCommentMod]);

    const openAddCommentModal = () => {
        if (!isAuth) {
            dispatch(changeVisibleErrorEmailModal({visibleErrorEmailModal: true}));
        }
        if (isAuth) {
            dispatch(changeVisibleAddCommentModal({visibleAddCommentModal: true}));
        }
    };

    /*открытие модального окна успешного добавления комментария*/
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


    /*открытие страницы редактирования комментариев*/
    const openCommentEditor = () => {
        if (isAuth) {
            navigate("/commenteditor");
        }
    };

    /*открытие страницы модерации комментариев*/
    const openCommentModeration = () => {
        if (isAuth) {
            navigate("/commentmoderation");
        }
    };



    return (
        <>

            {isLoading && <Loader/>}

            <div className={s.comment}>

                <h1>Комментарии:</h1>
                {emtpyComments && <h3 style={{marginLeft: 15}}>{emtpyComments}</h3>}

                {!emtpyComments &&
                    <div className={s.all_comments}>
                        {comments &&
                            comments.map((comment) => (

                                <div key={comment.id} className={s.comments}>
                                    <div className={s.commentHead}>
                                        <h4>{comment.userName}, &nbsp; </h4>
                                        <Moment>{comment.createdAt}</Moment>
                                    </div>

                                    <TextareaAutosize
                                        readOnly={true}
                                        minRows={1}
                                        maxRows={25}
                                        defaultValue={comment.description}
                                        style={{
                                            resize:"none",
                                            border:"none",
                                            fontSize:20,
                                            fontStyle:"oblique",
                                            fontFamily:"Times New Roman, Times, serif"
                                        }}
                                    />

                                    {/*<textarea
                                        rows={5}
                                        readOnly={true}
                                        value={comment.description}

                                    />*/}

                                    <span>
                                        <hr/>
                                </span>

                                </div>
                            ))
                        }
                    </div>}

                <div className={s.commentsBtn}>
                    {!visibleAddCommentBtn && <h4>Добавлять комментарии могут только авторизованные пользователи</h4>}

                    {visibleAddCommentBtn && <MyButton onClick={openAddCommentModal}>Добавить комментарий</MyButton>}

                    {isAuth && <MyButton onClick={openCommentEditor}>Редактировать / Удалить комментарий</MyButton>}

                    {isAuth && visibleCommentModerationBtn &&
                        <MyButton onClick={openCommentModeration}>Комментарии для модерации</MyButton>}
                </div>

            </div>

            {visibleAddCommentModal && <AddCommentModal/>}

            {visibleErrorModal && <ErrorModal/>}

            {visibleSuccessRespModal && <SuccessRespModal/>}

        </>
    );
};

export default AllComments;