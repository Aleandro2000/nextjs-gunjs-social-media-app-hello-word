// pages/FriendsRequest.jsx
import React, { useContext, useState } from "react";
import "gun/sea";
import "./styles/FriendsRequest.module.css";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Navbar from "./components/Navbar";

export default function FriendsRequestPage() {
  const [user, setUser] = useState(null);
  const { gun } = useContext(AuthenticationContext);
  const [currentUser, setCurrentUser] = useState("");
  const [newFriend, setNewFriend] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Send friend request
  const sendFriendRequest = (e) => {
    e.preventDefault();

    if (!user || !newFriend || newFriend === currentUser) return;

    // Check if already sent
    if (sentRequests.some((req) => req.to === newFriend)) {
      alert("Request already sent to this user");
      return;
    }

    // Check if already friends
    if (friends.some((friend) => friend.username === newFriend)) {
      alert("Already friends with this user");
      return;
    }

    // Store in sender's data
    user.get("sentRequests").set({ to: newFriend, status: "pending" });

    // Store in recipient's data (in a real app, you'd need to handle this differently)
    gun.get(`~@${newFriend}`).once((userPub) => {
      if (!userPub) {
        alert("User not found");
        return;
      }

      gun
        .user(userPub)
        .get("receivedRequests")
        .set({ from: currentUser, status: "pending" });
    });

    setNewFriend("");
  };

  // Accept friend request
  const acceptRequest = (request) => {
    if (!user) return;

    // Update received request status
    user
      .get("receivedRequests")
      .get(request.id)
      .put({ from: request.from, status: "accepted" });

    // Add to friends list
    user.get("friends").set({ username: request.from });

    // Update sender's sent request and add to their friends list
    gun.get(`~@${request.from}`).once((userPub) => {
      if (!userPub) return;

      const senderUser = gun.user(userPub);
      senderUser
        .get("sentRequests")
        .map()
        .once((req, id) => {
          if (req && req.to === currentUser) {
            senderUser
              .get("sentRequests")
              .get(id)
              .put({ to: currentUser, status: "accepted" });
          }
        });

      senderUser.get("friends").set({ username: currentUser });
    });

    // Update state
    setReceivedRequests((prev) => prev.filter((req) => req.id !== request.id));
    setFriends((prev) => [...prev, { username: request.from }]);
  };

  // Decline friend request
  const declineRequest = (request) => {
    if (!user) return;

    // Update received request status
    user
      .get("receivedRequests")
      .get(request.id)
      .put({ from: request.from, status: "declined" });

    // Update sender's sent request
    gun.get(`~@${request.from}`).once((userPub) => {
      if (!userPub) return;

      const senderUser = gun.user(userPub);
      senderUser
        .get("sentRequests")
        .map()
        .once((req, id) => {
          if (req && req.to === currentUser) {
            senderUser
              .get("sentRequests")
              .get(id)
              .put({ to: currentUser, status: "declined" });
          }
        });
    });

    // Update state
    setReceivedRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  // Cancel sent request
  const cancelRequest = (request) => {
    if (!user) return;

    // Remove from sent requests
    user.get("sentRequests").get(request.id).put(null);

    // Remove from recipient's received requests
    gun.get(`~@${request.to}`).once((userPub) => {
      if (!userPub) return;

      const recipientUser = gun.user(userPub);
      recipientUser
        .get("receivedRequests")
        .map()
        .once((req, id) => {
          if (req && req.from === currentUser) {
            recipientUser.get("receivedRequests").get(id).put(null);
          }
        });
    });

    // Update state
    setSentRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  // Remove friend
  const removeFriend = (friend) => {
    if (!user) return;

    // Remove from friends list
    user.get("friends").get(friend.id).put(null);

    // Remove from the other user's friends list
    gun.get(`~@${friend.username}`).once((userPub) => {
      if (!userPub) return;

      const friendUser = gun.user(userPub);
      friendUser
        .get("friends")
        .map()
        .once((f, id) => {
          if (f && f.username === currentUser) {
            friendUser.get("friends").get(id).put(null);
          }
        });
    });

    // Update state
    setFriends((prev) => prev.filter((f) => f.id !== friend.id));
  };

  return (
    <div
      style={{ backgroundColor: "#131313", minHeight: "100vh", width: "100%" }}
    >
      <section className="hero is-success">
        <div className="hero-body">
          <p className="title">Friend Request System</p>
        </div>
      </section>

      <div className="container is-fluid mt-5">
        <div className="columns">
          <div className="column is-half">
            {/* Welcome and Send Request Section */}
            <div className="box has-background-dark-custom mb-5">
              <h2 className="title is-4 has-text-success-custom">Welcome!</h2>

              <div className="mb-5">
                <h3
                  className="title is-5 has-text-white"
                  style={{ marginBottom: "25px" }}
                >
                  Send Friend Request
                </h3>
                <form onSubmit={sendFriendRequest}>
                  <div className="field has-addons">
                    <div className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        value={newFriend}
                        onChange={(e) => setNewFriend(e.target.value)}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="control">
                      <button type="submit" className="button is-success">
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Sent Requests */}
              <div>
                <h3 className="title is-5 has-text-white">Sent Requests</h3>
                <div className="table-container">
                  <table className="table is-fullwidth is-striped">
                    <thead>
                      <tr>
                        <th>To</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sentRequests.length > 0 ? (
                        sentRequests.map((request, index) => (
                          <tr key={index}>
                            <td>{request.to}</td>
                            <td>
                              <span
                                className={`tag ${
                                  request.status === "pending"
                                    ? "is-warning"
                                    : request.status === "accepted"
                                      ? "is-success"
                                      : "is-danger"
                                }`}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td>
                              {request.status === "pending" && (
                                <button
                                  onClick={() => cancelRequest(request)}
                                  className="button is-small is-danger is-light"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="has-text-centered has-text-grey"
                          >
                            No sent requests
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Friends List */}
            <div className="box has-background-dark-custom">
              <h3 className="title is-5 has-text-success-custom">Friends</h3>
              <div className="table-container">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {friends.length > 0 ? (
                      friends.map((friend, index) => (
                        <tr key={index}>
                          <td>{friend.username}</td>
                          <td>
                            <button
                              onClick={() => removeFriend(friend)}
                              className="button is-small is-danger is-light"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="has-text-centered has-text-grey"
                        >
                          No friends yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Received Requests */}
          <div className="column is-half">
            <div className="box has-background-dark-custom">
              <h3 className="title is-5 has-text-success-custom">
                Received Requests
              </h3>
              <div className="table-container">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivedRequests.length > 0 ? (
                      receivedRequests.map((request, index) => (
                        <tr key={index}>
                          <td>{request.from}</td>
                          <td>
                            <span
                              className={`tag ${
                                request.status === "pending"
                                  ? "is-warning"
                                  : request.status === "accepted"
                                    ? "is-success"
                                    : "is-danger"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {request.status === "pending" && (
                              <div className="buttons are-small">
                                <button
                                  onClick={() => acceptRequest(request)}
                                  className="button is-success is-light"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => declineRequest(request)}
                                  className="button is-danger is-light"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="has-text-centered has-text-grey"
                        >
                          No received requests
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
