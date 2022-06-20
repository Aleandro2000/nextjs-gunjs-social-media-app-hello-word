import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getWalletDetails, displayToast } from "../../utils";

export default function NavbarTemplate() {
    const signIn = async e => {
        try {
            const details = await getWalletDetails();
            displayToast("Connection to MetaMask successfully! :)");
        } catch (err) {
            displayToast("Something were wrong or MetaMask is not added! :(", false);
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
                        Home
                    </a>

                    <a className="navbar-item">
                        FAQ
                    </a>

                    <a className="navbar-item">
                        Terms&amp;Conditions
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-success">
                                <strong>
                                    <FontAwesomeIcon icon={faPlus} /> SIGN UP
                                </strong>
                            </a>
                            <button className="button is-success" onClick={signIn}>
                                <strong>
                                    <FontAwesomeIcon icon={faSignIn} /> LOGIN
                                </strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}