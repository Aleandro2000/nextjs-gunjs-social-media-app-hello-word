import Gun from "gun/gun";
import "gun/sea";
import "gun/axe";
import { displayToast } from "../../utils";

export const gun = Gun({
  peers: process.env.API_URL,
});
export const user = gun.user().recall({ sessionStorage: true });

const register = async (username, password, consoleLog) => {
  try {
    if (username && password) {
      const result = await user.create(username, password, (ack) => {
        consoleLog ? console.log(ack) : null;
        ack.err ? displayToast(ack.err, false) : displayToast("SUCESS!");
      });
      await user.get("alias").put(username);
      return result;
    }
    displayToast("ERROR!", false);
    return null;
  } catch (err) {
    displayToast("ERROR!", false);
    return null;
  }
};

const login = async (username, password, consoleLog) => {
  try {
    if (username && password)
      return await user.auth(username, password, (ack) => {
        consoleLog ? console.log(ack) : null;
        if (ack.err) displayToast(ack.err, false);
        else displayToast("SUCCESS!");
      });
    displayToast("ERROR!", false, false);
    return null;
  } catch (err) {
    displayToast("ERROR!", false, false);
    return null;
  }
};

export const logout = () => {
  user.leave();
};

export const removeAccount = (username, consoleLog) => {
  if (username)
    user.delete(username, (ack) => {
      consoleLog ? console.log(ack) : null;
    });
  else displayToast("ERROR!", false, false);
};

module.exports = {
  register,
  login,
  logout,
  removeAccount,
};
