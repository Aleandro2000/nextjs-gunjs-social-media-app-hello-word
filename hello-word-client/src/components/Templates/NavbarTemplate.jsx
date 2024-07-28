import React, { useContext, useState } from "react";
import CryptoJS from "crypto-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getWalletDetails, displayToast, SessionStorage } from "../../utils";
import {
  ContentContext,
  LanguageContext,
} from "../../contexts/LanguageContext";
import { language_list, appContent } from "../../l10n";
import { useRouter } from "next/router";
import { logger } from "../../utils";

export default function NavbarTemplate() {
  const [language, setLanguage] = useContext(LanguageContext);
  const [content, setContent] = useContext(ContentContext);
  const [active, setActive] = useState(false);

  const route = useRouter();

  const handleOpenMenu = () => setActive(!active);

  const redirect = (path) => async () => {
    try {
      const details = await getWalletDetails();
      if (details.result[0]) {
        SessionStorage.setItem(
          "adr",
          CryptoJS.AES.encrypt(
            details.result[0],
            process.env.NEXT_PUBLIC_SECRET_KEY
          )
        );
        await route.push(path);
        displayToast(content["metamask_message_success"]);
      } else displayToast(content["metamask_message_fail"], false);
    } catch (err) {
      logger(err);
      displayToast(content["metamask_message_fail"], false);
    }
  };

  const changeLanguage = (language) => () => {
    SessionStorage.setItem("lang", language);
    setLanguage(language ?? "en");
    setContent(appContent[language] ?? appContent["en"]);
  };

  return (
    <nav
      className="container navbar box has-background-white-ter p-0"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <img
          alt="Hello Word logo"
          className="navbar-item"
          src="/media/logo.png"
          width="112px"
          height="112px"
        />

        <a
          role="button"
          onClick={handleOpenMenu}
          className={`navbar-burger ${active ? "burger is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar" className={`navbar-menu ${active ? "is-active" : ""}`}>
        <div className="navbar-start">
          <span className="navbar-item has-text-weight-bold">
            {content["navbar_home"]}
          </span>
          <div className="navbar-item has-dropdown is-hoverable">
            <a href="#!" className="navbar-link">
              {language?.toUpperCase()}
            </a>
            <center className="navbar-dropdown">
              {language_list.map((item, key) => {
                return (
                  <button
                    className="button navbar-item is-clickable is-fullwidth"
                    key={key}
                    onClick={changeLanguage(item)}
                  >
                    {item?.toUpperCase()}
                  </button>
                );
              })}
            </center>
          </div>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button
                className="button is-success"
                onClick={redirect("/signup")}
              >
                <strong>
                  <FontAwesomeIcon icon={faPlus} /> {content["signup"]}
                </strong>
              </button>
              <button
                className="button is-success"
                onClick={redirect("/signin")}
              >
                <strong>
                  <FontAwesomeIcon icon={faSignIn} /> {content["signin"]}
                </strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
