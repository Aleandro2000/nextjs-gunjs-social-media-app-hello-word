import React from "react";

export default function SignInForm() {
    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                            <form action="" className="box">
                                <div className="has-text-centered">
                                    <img alt="Hello Word logo" src="/media/logo.png" width="200px" height="200px" />
                                </div>
                                <div className="field">
                                    <label htmlFor="Username" className="label">Username</label>
                                    <div className="control has-icons-left">
                                        <input type="text" placeholder="Username" className="input" required />
                                        <span className="icon is-small is-left">
                                            <i className="fa fa-envelope"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="Password" className="label">Password</label>
                                    <div className="control has-icons-left">
                                        <input type="password" placeholder="Password" className="input" required />
                                        <span className="icon is-small is-left">
                                            <i className="fa fa-lock"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="field has-text-centered mt-6">
                                    <button className="button is-success">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}