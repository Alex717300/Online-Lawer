import React from 'react';
import {Route, Routes} from "react-router-dom";

import VerificationEmailUserModal from "./components/modals/verificationEmailUser/VerificationEmailUserModal";
import VerificationResetLinkModal from "./components/modals/verificationResetLink/VerificationResetLinkModal";
import CommentEditor from "./components/comment/commentEditor/CommentEditor";
import CommentModeration from "./components/comment/commentModeration/CommentModeration";
import MainPage from "./components/mainPage/MainPage";
import PrivacyPolicy from "./components/privacy_policy/PrivacyPolicy";
import Contacts from "./components/contacts/Contacts";
import AllComments from "./components/comment/comments/AllComments";
import ServicesList from "./components/servicesList/ServicesList";


const AppRouter = () => {

    return (
        <Routes>

            <Route path="/"  element={<MainPage/>}/>
            <Route path="/serviceslist"  element={<ServicesList/>}/>
            <Route path="/contacts"  element={<Contacts/>}/>
            <Route path="/comments"  element={<AllComments/>}/>
            <Route path="/commenteditor"  element={<CommentEditor/>}/>
            <Route path="/privacy"  element={<PrivacyPolicy/>}/>
            <Route path="/commentmoderation"  element={<CommentModeration/>}/>
            <Route path="/activate/:activationLink"  element={<VerificationEmailUserModal/>}/>
            <Route path="/verificationResetLink/:passwordResetLink"  element={<VerificationResetLinkModal/>}/>

        </Routes>
    );
};

export default AppRouter;