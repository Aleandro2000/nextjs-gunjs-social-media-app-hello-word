import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ContentContext } from "../../../contexts/LanguageContext";

export default function HeaderComponent() {
  const [content, setContent] = useContext(ContentContext);

  return (
    <div className="container mt-5 p-5">
      <div className="columns is-centered">
        <div className="column">
          <div className="box has-background-white-ter">
            <div className="is-size-1">{content["header_title"]}</div>
            <div className="is-size-4">{content["header_content"]}</div>
            <div className="has-text-centered">
              <a className="button is-success mt-5">
                <strong>
                  <FontAwesomeIcon icon={faInfoCircle} />{" "}
                  {content["header_button_text"]}
                </strong>
              </a>
            </div>
          </div>
        </div>
        <div className="column">
          <img
            alt={content["accessibility_cat_space"]}
            className="shake"
            src="/media/catinspace.png"
          />
        </div>
      </div>
    </div>
  );
}
