import React, { useEffect, useState } from "react";
import { ReactDOM } from "react-dom";
import { ContentContext, LanguageContext } from "../src/contexts/LanguageContext";
import { AuthenticationContext } from "../src/contexts/AuthenticationContext";

import { language_list, en, fr, de } from "../src/l10n";
import "../styles/globals.scss";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    const axe = require("react-axe");
    axe(React, ReactDOM, 1000);
}

export default function MyApp({ Component, pageProps }) {
    const [language, setLanguage] = useState(language_list[0]);
    const [content, setContent] = useState({});
    const [authentication, setAuthentication] = useState();

    useEffect(() => {
        switch(language) {
        case "en":
            setContent(en);
            break;
        case "fr":
            setContent(fr);
            break;
        case "de":
            setContent(de);
            break;
        }
    },[language, content, authentication]);

    return (
        <LanguageContext.Provider value={[language, setLanguage]}>
            <ContentContext.Provider value={[content, setContent]}>
                <AuthenticationContext.Provider value={[authentication, setAuthentication]}>
                    <Component {...pageProps} />
                </AuthenticationContext.Provider>
            </ContentContext.Provider>
        </LanguageContext.Provider>
    );
}
