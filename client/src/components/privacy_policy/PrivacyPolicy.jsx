import React from 'react';

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import {Document, Page, pdfjs} from 'react-pdf';
import privacy from "../../static/PrivacyPolicyDoc.pdf";
import MyButton from "../myButton/MyButton";

import s from './PrivacyPolicy.module.css';


const PrivacyPolicy = () => {

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    return (

        <>

            <a style={{textDecoration: "none"}} href={privacy} download>
                <MyButton style={{marginTop: 15, marginLeft:5}}>
                    <h3> Скачать PDF </h3>
                </MyButton>
            </a>

            <div className={s.policydoc}>


                <h1>Политика обработки персональных данных:</h1>

                <div className={s.privacy_policydoc}>
                    <Document file={privacy}>
                        <Page width={1000} pageNumber={1}/>
                    </Document>
                </div>
            </div>

        </>
    )
}

export default PrivacyPolicy;
