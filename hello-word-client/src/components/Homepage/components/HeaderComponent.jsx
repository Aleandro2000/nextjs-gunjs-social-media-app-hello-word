import React, { useContext } from "react";
import { ContentContext } from "../../../contexts/LanguageContext";

export default function HeaderComponent() {
    const [content, setContent] = useContext(ContentContext);

    return (
        <div className="container mt-5 p-5">
            <div className="columns is-centered">
                <div className="column">
                    <div className="box has-background-white-ter">
                        <div className="is-size-1">
                            {content["header_title"]}
                        </div>
                        <div className="is-size-4">
                            {content["header_content"]}
                        </div>
                    </div>
                </div>
                <div className="column">
                    <img alt="Cat in space" className="shake" src="/media/catinspace.png" />
                </div>
            </div>
        </div>
    );
}