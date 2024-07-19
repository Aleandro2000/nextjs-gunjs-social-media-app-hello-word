import React, { useEffect, useState } from "react";
import { ReactDOM } from "react-dom";
import { AuthProvider } from "../src/contexts/AuthenticationContext";
import {
  ContentContext,
  LanguageContext,
} from "../src/contexts/LanguageContext";

import { appContent, language_list } from "../src/l10n";
import { SessionStorage } from "../src/utils";
import "../styles/globals.css";
import "../styles/globals.scss";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

if (
  process.env.NEXT_PUBLIC_ENV !== "production" &&
  typeof window !== "undefined"
) {
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000);
}

export default function MyApp({ Component, pageProps }) {
  const [language, setLanguage] = useState(
    SessionStorage.getItem("lang") ?? language_list[0]
  );
  const [content, setContent] = useState(
    appContent[SessionStorage.getItem("lang")] ?? appContent[language_list[0]]
  );
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return !isSSR ? (
    <LanguageContext.Provider value={[language, setLanguage]}>
      <ContentContext.Provider value={[content, setContent]}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ContentContext.Provider>
    </LanguageContext.Provider>
  ) : null;
}
