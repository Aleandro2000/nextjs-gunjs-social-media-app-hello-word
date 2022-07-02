import React, { useContext } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faArrowLeft, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { register } from "../../../database/authentication";
import { passwordRegex } from "../../../utils/regex";
import { ContentContext } from "../../../contexts/LanguageContext";

export default function SignUpForm() {
    const [content, setContent] = useContext(ContentContext);
    const route = useRouter();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: values => {
            register(values.username, values.password);
        },
        validationSchema: yup.object({
            username: yup.string().required(content["usernameRequiredText"]),
            password: yup.string().trim().matches(passwordRegex).required(content["passwordRequiredText"]),
            confirmPassword: yup.string().trim().required("Please confirm your password").oneOf([yup.ref("password"), null], "Passwords don't match."),
        }),
    });

    const handleBack = () => route.back();

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
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="has-text-centered">
                                        <img alt="Hello Word logo" src="/media/logo.png" width="200px" height="200px" />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="Username" className="label">Username</label>
                                        <div className="control has-icons-left">
                                            <input
                                                type="text"
                                                name="username"
                                                value={formik.values.username}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Username"
                                                className="input" />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faUser} />
                                            </span>
                                        </div>
                                        {formik.errors.username && (
                                            <div className="has-text-danger is-size-7">{formik.errors.username}</div>
                                        )}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="Password" className="label">Password</label>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password"
                                                name="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Password"
                                                className="input" />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faLock} /> 
                                            </span>
                                        </div>
                                        {formik.errors.password && (
                                            <div className="has-text-danger is-size-7">{formik.errors.password}</div>
                                        )}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="Confirm Password" className="label">Confirm Password</label>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formik.values.confirmPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Confirm Password"
                                                className="input" />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faLock} /> 
                                            </span>
                                        </div>
                                        {formik.errors.confirmPassword && (
                                            <div className="has-text-danger is-size-7">{formik.errors.confirmPassword}</div>
                                        )}
                                    </div>
                                    <div className="field has-text-centered mt-6">
                                        <button type="submit" className="button is-success">
                                            <FontAwesomeIcon icon={faSignIn} className="pr-2" /> Sign Up
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