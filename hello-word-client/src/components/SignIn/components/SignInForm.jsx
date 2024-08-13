import {
  faArrowLeft,
  faLock,
  faSignIn,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { ContentContext } from "../../../contexts/LanguageContext";
import { useAnalyticsFunctions } from "../../../utils/analyticsFunctions";
import { logger, displayToast } from "../../../utils";

export default function SignInForm() {
  const [content] = useContext(ContentContext);
  const { login } = useContext(AuthenticationContext);
  const { recordEngagement } = useAnalyticsFunctions();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const result = await login(values.username, values.password);
        if (result) {
          recordEngagement("login", values.username, 0);
          router.push("/dashboard/page");
        } else {
          logger("Login failed");
          displayToast("Login failed", false);
        }
      } catch (err) {
        logger("Login error:", err);
        displayToast("Login error", false);
      } finally {
        setLoading(false);
      }
    },
    validationSchema: yup.object({
      username: yup.string().required(content["usernameRequiredText"]),
      password: yup.string().required(content["passwordRequiredText"]),
    }),
  });

  const handleBack = () => router.replace("/");

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
                  <center>
                    <img
                      alt="Hello Word logo"
                      src="/media/logo.png"
                      width="200px"
                      height="200px"
                    />
                  </center>
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
                    {formik.errors.username && formik.touched.username && (
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
                    {formik.errors.password && formik.touched.password && (
                      <div className="has-text-danger is-size-7">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <div className="field has-text-centered mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="button is-success"
                    >
                      <FontAwesomeIcon icon={faSignIn} className="pr-2" />{" "}
                      {loading ? "Loading..." : content["signin"]}
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
