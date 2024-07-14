import React, { useContext, useEffect, useState } from "react";
import { gun } from "../../database/authentication/authentication";
import {
  logout,
  removeAccount,
} from "../../database/authentication/authentication";
import { uuid } from "uuidv4";
import { useRouter } from "next/router";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

export default function DashboardPage() {
  const [posts, setPosts] = useState({});
  const [newPost, setNewPost] = useState("");
  const [, setAuthentication] = useContext(AuthenticationContext);
  const router = useRouter();

  useEffect(() => {
    const postsRef = gun?.get("posts");
    postsRef?.map().on((post, id) => {
      setPosts((prevPosts) => ({
        ...prevPosts,
        [id]: { ...post, id },
      }));
    });
  }, []);

  const addPost = () => {
    const postsRef = gun?.get("posts");
    const id = uuid();
    postsRef
      ?.get(id)
      .put({ content: newPost, createdAt: Date.now(), author: user });
    setNewPost("");
  };

  const deletePost = (id) => {
    if (posts[id].author !== user)
      return alert("You can only delete your own posts.");
    gun?.get("posts").get(id).put(null);
    setPosts((prevPosts) => {
      const updatedPosts = { ...prevPosts };
      delete updatedPosts[id];
      return updatedPosts;
    });
  };

  const editPost = (id, content) => {
    if (posts[id].author !== user)
      return alert("You can only edit your own posts.");
    gun
      ?.get("posts")
      .get(id)
      .put({ content, updatedAt: Date.now(), author: user });
  };

  const handleLogout = () => {
    logout();
    setAuthentication();
    router.replace("/");
  };

  const handleRemoveAccount = async () => {
    removeAccount(username, true);
    setAuthentication();
    router.replace("/");
  };

  return (
    <div className="container">
      <div className="control">
        <button className="button is-link" onClick={handleLogout}>
          Logout
        </button>
        <button className="button is-danger" onClick={handleRemoveAccount}>
          Remove Account
        </button>
      </div>
      <h1 className="title my-5">DASHBOARD</h1>
      <div>
        <div className="field">
          <label className="label">New Post</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write a new post..."
            />
          </div>
          <div className="control my-5">
            <button className="button is-primary" onClick={addPost}>
              Add Post
            </button>
          </div>
        </div>
        <ul>
          {Object.keys(posts).map((id) => (
            <li key={id} className="box">
              <input
                className="input"
                type="text"
                value={posts[id].content}
                onChange={(e) => editPost(id, e.target.value)}
                disabled={posts[id].author !== user}
              />
              {posts[id].author === user && (
                <button
                  className="button is-danger"
                  onClick={() => deletePost(id)}
                >
                  Delete
                </button>
              )}
              <p>
                <strong>Author:</strong> {posts[id].author}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
