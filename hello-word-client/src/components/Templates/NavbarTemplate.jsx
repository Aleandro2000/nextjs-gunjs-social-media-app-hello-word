import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getWalletDetails, displayToast } from "../../utils";
import { ContentContext, LanguageContext } from "../../contexts/LanguageContext";
import language_list from "../../l10n/language_list";

export default function NavbarTemplate() {
    const [language, setLanguage] = useContext(LanguageContext);
    const [content, setContent] = useContext(ContentContext);

    const signIn = async e => {
        try {
            const details = await getWalletDetails();
            details ? displayToast(content["metamask_message_success"]) : displayToast(content["metamask_message_fail"], false);
        } catch (err) {
            displayToast(content["metamask_message_fail"], false);
        }
    };

    return (
        <nav className="container navbar box has-background-white-ter p-0" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <img alt="Hello Word logo" className="navbar-item" src="/media/logo.png" width="112px" height="112px" />

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbar" className="navbar-menu">
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
                        <div className="navbar-dropdown">
                            {
                                language_list.map((item, key) => {
                                    return (
                                        <a className="navbar-item" key={key}>
                                            {item}
                                        </a>
                                    );
                                })
                            }
                        </div>
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