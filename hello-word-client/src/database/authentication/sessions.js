import "gun/axe";
import "gun/sea";

export const gun = Gun({
  peers: [
    process.env.NEXT_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_URL}/gun`
      : "http://localhost:8081/gun",
  ],
  localStorage: false,
  radisk: false,
  retry: Infinity,
  reconnect: 500,
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
