import React from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faArrowLeft, faUser, faLock } from "@fortawesome/free-solid-svg-icons";

export default function SignInForm() {
    const route = useRouter();

    const handleBack = () => route.back();

    const handleSubmit = e => {
        e.preventDefault();
    };

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                            <div className="box has-background-white-ter">
                                <button className="button is-success" onClick={handleBack}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="pr-2" /> Back
                                </button>
                                <form onSubmit={handleSubmit}>
                                    <div className="has-text-centered">
                                        <img alt="Hello Word logo" src="/media/logo.png" width="200px" height="200px" />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="Username" className="label">Username</label>
                                        <div className="control has-icons-left">
                                            <input type="text" placeholder="Username" className="input" required />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faUser} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="Password" className="label">Password</label>
                                        <div className="control has-icons-left">
                                            <input type="password" placeholder="Password" className="input" required />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faLock} /> 
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field has-text-centered mt-6">
                                        <button type="submit" className="button is-success">
                                            <FontAwesomeIcon icon={faSignIn} className="pr-2" /> Sign In
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}