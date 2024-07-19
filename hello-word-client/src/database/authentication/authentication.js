import "gun/axe";
import Gun from "gun/gun";
import "gun/sea";
import { displayToast, logger } from "../../utils";

export const gun = Gun({
  peers: process.env.NEXT_PUBLIC_URL ?? "http://localhost:8081/",
});

export const user = gun.user().recall({ sessionStorage: true });

const register = async (username, password) => {
  try {
    if (username && password) {
      const result = await user.create(username, password, (ack) => {
        ack.err ? displayToast(ack.err, false) : displayToast("SUCCESS!");
      });
      await user.get("alias").put(username);
      return result;
    }
    displayToast("ERROR!", false);
    return null;
  } catch (err) {
    logger(err);
    displayToast("ERROR!", false);
    return null;
  }
};

const login = async (username, password) => {
  try {
    console.log("username", username);
    if (username && password) {
      console.log("user", user);
      return await user.auth(username, password, (ack) => {
        if (ack.err) displayToast(ack.err, false);
        else {
          displayToast("SUCCESS!");
          user.recall({ sessionStorage: true });
        }
      });
    }
    displayToast("ERROR!", false, false);
    return null;
  } catch (err) {
    logger(err);
    displayToast("ERROR!", false, false);
    return null;
  }
};

export const logout = () => {
  user.leave();
  sessionStorage.clear();
};

export const removeAccount = (username) => {
  if (username)
    user.delete(username, (ack) => {
      sessionStorage.clear();
    });
  else displayToast("ERROR!", false, false);
};

module.exports = {
  register,
  login,
  logout,
  removeAccount,
};
