import {
  faArrowLeft,
  faLock,
  faSignIn,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import * as yup from "yup";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { ContentContext } from "../../../contexts/LanguageContext";
import { useAnalyticsFunctions } from "../../../utils/analyticsFunctions";
import { passwordRegex } from "../../../utils/regex";

export default function SignUpForm() {
  const [content] = useContext(ContentContext);
  const { register } = useContext(AuthenticationContext);
  const { recordNewUser } = useAnalyticsFunctions();

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        const result = await register(values.username, values.password);
        if (result) {
          recordNewUser(); // Record new user in analytics
          router.push("/dashboard/page");
        } else {
          console.error("Registration failed");
        }
      } catch (err) {
        console.error("Registration error:", err);
      }
    },
    validationSchema: yup.object({
      username: yup.string().required(content["usernameRequiredText"]),
      password: yup
        .string()
        .trim()
        .matches(passwordRegex)
        .required(content["passwordRequiredText"]),
      confirmPassword: yup
        .string()
        .trim()
        .required(content["ConfirmPasswordRequiredText"])
        .oneOf(
          [yup.ref("password"), null],
          content["wrongConfirmPasswordText"]
        ),
    }),
  });

  const handleBack = () => router.back();

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <div className="box has-background-white-ter">
                <button className="button is-success" onClick={handleBack}>
                  <FontAwesomeIcon icon={faArrowLeft} className="pr-2" />{" "}
                  {content["back_text"]}
                </button>
                <form onSubmit={formik.handleSubmit}>
                  <div className="has-text-centered">
                    <img
                      alt="Hello Word logo"
                      src="/media/logo.png"
                      width="200px"
                      height="200px"
                    />
                  </div>
                  <div className="field">
                    <label
                      htmlFor={content["auth_username_text"]}
                      className="label"
                    >
                      {content["auth_username_text"]}
                    </label>
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={content["auth_username_text"]}
                        className="input"
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                    </div>
                    {formik.errors.username && (
                      <div className="has-text-danger is-size-7">
                        {formik.errors.username}
                      </div>
                    )}
                  </div>
                  <div className="field">
                    <label
                      htmlFor={content["auth_password_text"]}
                      className="label"
                    >
                      {content["auth_password_text"]}
                    </label>
                    <div className="control has-icons-left">
                      <input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={content["auth_password_text"]}
                        className="input"
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    {formik.errors.password && (
                      <div className="has-text-danger is-size-7">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <div className="field">
                    <label
                      htmlFor={content["auth_confirm_password_text"]}
                      className="label"
                    >
                      {content["auth_confirm_password_text"]}
                    </label>
                    <div className="control has-icons-left">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={content["auth_confirm_password_text"]}
                        className="input"
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    {formik.errors.confirmPassword && (
                      <div className="has-text-danger is-size-7">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  <div className="field has-text-centered mt-6">
                    <button type="submit" className="button is-success">
                      <FontAwesomeIcon icon={faSignIn} className="pr-2" />{" "}
                      {content["signup"]}
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
