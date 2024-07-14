import Gun from "gun/gun";
import "gun/sea";
import "gun/axe";

const gun = Gun({
  peers: process.env.API_URL,
});

const createSession = (ethId) => {
  gun.get("sessions").put({
    ethId: ethId,
  });
};

const removeSession = (ethId) => {
  gun.get("sessions").put({
    ethId: null,
  });
};

module.exports = {
  createSession,
  removeSession,
};
