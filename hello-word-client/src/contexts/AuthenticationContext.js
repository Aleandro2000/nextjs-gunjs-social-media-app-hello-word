import Gun from "gun/gun";
import "gun/sea";
import React, { createContext, useEffect, useState } from "react";
import { displayToast } from "../utils";
import { logger } from "ethers";

export const AuthenticationContext = createContext();

export function AuthProvider({ children }) {
  const [authentication, setAuthentication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gun, setGun] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const gunInstance = Gun({
      peers: [process.env.NEXT_PUBLIC_URL ?? "http://localhost:8081/"],
    });
    setGun(gunInstance);
    const userInstance = gunInstance.user().recall({ sessionStorage: true });
    setUser(userInstance);

    const checkAuth = async () => {
      try {
        await userInstance.recall({ sessionStorage: true });
        if (userInstance.is) {
          const alias = await userInstance.get("alias").then();
          const authData = {
            user: userInstance,
            username: alias,
          };
          setAuthentication(authData);
          localStorage.setItem("auth", JSON.stringify(authData));
        } else {
          setAuthentication(null);
          localStorage.removeItem("auth");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthentication(null);
        localStorage.removeItem("auth");
      }
      setLoading(false);
    };

    // Check if there's auth data in localStorage
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuthentication(JSON.parse(storedAuth));
      setLoading(false);
    } else {
      checkAuth();
    }
  }, []);

  const register = async (username, password) => {
    if (!user) return null;

    try {
      if (username && password) {
        const result = await user.create(username, password, (ack) => {
          ack?.err ? displayToast(ack?.err, false) : displayToast("SUCCESS!");
        });
        await user.get("alias").put(username);
        const authData = { user, username };
        setAuthentication(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
        return result;
      }
      displayToast("ERROR!", false);
      return null;
    } catch (err) {
      displayToast("ERROR!", false);
      return null;
    }
  };

  const login = async (username, password) => {
    if (!user) return null;

    try {
      if (username && password) {
        return await user.auth(username, password, async (ack) => {
          if (ack?.err) {
            displayToast(ack?.err, false);
          } else {
            displayToast("SUCCESS!");
            await user.recall({ sessionStorage: true });
            const alias = await user.get("alias").then();
            const authData = { user, username: alias };
            setAuthentication(authData);
            localStorage.setItem("auth", JSON.stringify(authData));
          }
        });
      }
      displayToast("ERROR!", false);
      return null;
    } catch (err) {
      displayToast("ERROR!", false);
      return null;
    }
  };

  const changePassword = async (username, password, newPassword) => {
    if (!gun.user()) return null;

    try {
      if (username && password && newPassword) {
        gun.user().auth(username, password, async (ack) => {
          if (ack.err) {
            displayToast(ack.err, false);
            return;
          }

          const user = gun.user();
          const { pub, priv } = await Gun.SEA.pair();

          user.auth(username, password, async (ack) => {
            if (ack.err) {
              displayToast(ack.err, false);
              return;
            }

            const encryptedPassword = await Gun.SEA.encrypt(newPassword, priv);

            user.get("sea").put({ pub, priv });
            user.get("password").put(encryptedPassword);

            displayToast("Password changed successfully!", true);
            await user.recall({ sessionStorage: true });

            const alias = await user.get("alias").then();
            const authData = { user, username: alias };
            setAuthentication(authData);
            localStorage.setItem("auth", JSON.stringify(authData));
          });
        });
      } else {
        displayToast("Invalid input!", false);
        return null;
      }
    } catch (err) {
      displayToast("ERROR!", false);
      logger(err);
      return null;
    }
  };

  const logout = () => {
    if (!user) return;

    user.leave();
    sessionStorage.clear();
    setAuthentication(null);
    localStorage.removeItem("auth");
  };

  const removeAccount = () => {
    if (!user) {
      displayToast("ERROR!", false);
      return;
    }

    const { username } = JSON.parse(localStorage.getItem("auth"));

    user.delete(username, sessionStorage.getItem("adr"), (ack) => {
      if (ack?.err) {
        displayToast(ack?.err, false);
      } else {
        sessionStorage.clear();
        setAuthentication(null);
        localStorage.removeItem("auth");
      }
    });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        authentication,
        loading,
        register,
        login,
        logout,
        removeAccount,
        changePassword,
        gun,
        user,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
