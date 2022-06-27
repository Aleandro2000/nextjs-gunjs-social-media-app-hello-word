import React, { useContext, useState } from "react";
import CryptoJS from "crypto-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getWalletDetails, displayToast, SessionStorage } from "../../utils";
import { ContentContext, LanguageContext } from "../../contexts/LanguageContext";
import { language_list, appContent } from "../../l10n";
import { useRouter } from "next/router";

export default function NavbarTemplate() {
    const [language, setLanguage] = useContext(LanguageContext);
    const [content, setContent] = useContext(ContentContext);
    const [active, setActive] = useState(false);

    const route = useRouter();

    const handleOpenMenu = () => setActive(!active);

    const signIn = async () => {
        try {
            const details = await getWalletDetails();
            if (details.result[0]) {
                SessionStorage.setItem("adr", CryptoJS.AES.encrypt(details.result[0], process.env.NEXT_PUBLIC_SECRET_KEY));
                route.push("/signin");
                displayToast(content["metamask_message_success"]);
            } else displayToast(content["metamask_message_fail"], false);
        } catch (err) {
            displayToast(content["metamask_message_fail"], false);
        }
    };

    const changeLanguage = language => () => {
        SessionStorage.setItem("lang", language);
        setLanguage(language ?? "en");
        setContent(appContent[language] ?? appContent["en"]);
    };

    return (
        <nav className="container navbar box has-background-white-ter p-0" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <img alt="Hello Word logo" className="navbar-item" src="/media/logo.png" width="112px" height="112px" />

                <a role="button" onClick={handleOpenMenu} className={`navbar-burger ${active ? "burger is-active" : ""}`} aria-label="menu" aria-expanded="false" data-target="navbar">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbar" className={`navbar-menu ${active ? "is-active" : ""}`}>
                <div className="navbar-start">
                    <a className="navbar-item">
                        {content["navbar_home"]}
                    </a>

                    <a className="navbar-item">
                        {content["navbar_faq"]}
                    </a>

                    <a className="navbar-item">
                        {content["navbar_terms"]}
                    </a>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                            {language}
                        </a>
                        <center className="navbar-dropdown">
                            {
                                language_list.map((item, key) => {
                                    return (
                                        <button className="button navbar-item is-clickable is-fullwidth" key={key} onClick={changeLanguage(item)}>
                                            {item}
                                        </button>
                                    );
                                })
                            }
                        </center>
                    </div>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-success">
                                <strong>
                                    <FontAwesomeIcon icon={faPlus} /> {content["navbar_signup"]}
                                </strong>
                            </a>
                            <button className="button is-success" onClick={signIn}>
                                <strong>
                                    <FontAwesomeIcon icon={faSignIn} /> {content["navbar_login"]}
                                </strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}