import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useAnalyticsFunctions } from "../../utils/analyticsFunctions";
import FilterBar from "./components/FilterBar";
import NewPostForm from "./components/NewPostForm";
import Post from "./components/Post";
import { useProfanityChecker } from "glin-profanity";
import { logger, displayToast } from "../../utils";

const PostsPage = () => {
  const [posts, setPosts] = useState({});
  const [filter, setFilter] = useState({ type: "all", query: "" });
  const { authentication, gun } = useContext(AuthenticationContext);
  const { recordNewPost } = useAnalyticsFunctions();
  const { checkTextAsync } = useProfanityChecker({
    allLanguages: true
  });

  useEffect(() => {
    if (!gun) return;

    const postsRef = gun.get("posts");
    postsRef.map().on((post, id) => {
      if (post) {
        setPosts((prevPosts) => ({
          ...prevPosts,
          [id]: { ...post, id, comments: {} },
        }));

        gun
          .get("posts_comments")
          .get(id)
          .map()
          .on((comment, commentId) => {
            if (comment) {
              setPosts((prevPosts) => ({
                ...prevPosts,
                [id]: {
                  ...prevPosts[id],
                  comments: {
                    ...prevPosts[id].comments,
                    [commentId]: comment,
                  },
                },
              }));
            }
          });
      } else {
        setPosts((prevPosts) => {
          const newPosts = { ...prevPosts };
          delete newPosts[id];
          return newPosts;
        });
      }
    });

    return () => {
      postsRef.off();
      gun.get("posts_comments").off();
    };
  }, [gun]);

  const addPost = async (newPost) => {
    try {
      if ((await checkTextAsync(newPost.content)).containsProfanity) {
        displayToast("Ooops! The post may violate general ethics!", false);
        return;
      }
      if (!authentication || !authentication.username) {
        logger("Username not available");
        return;
      }
      const id = Gun.text.random();
      const postData = {
        content: newPost.content,
        createdAt: Date.now(),
        author: newPost.isAnonymous ? "Anonymous" : authentication.username,
        points: 0,
        image: newPost.image ? URL.createObjectURL(newPost.image) : null,
        scheduleDate: newPost.scheduleDate,
      };
      gun.get("posts").get(id).put(postData);
      recordNewPost(authentication.username, id, newPost.content);
  
      setPosts((prevPosts) => ({
        [id]: { ...postData, id, comments: {} },
        ...prevPosts,
      }));
    } catch (err) {
      displayToast("ERROR! Something is wrong!", false);
      logger(err);
    }
  };

  const handleVote = (postId, voteType) => {
    console.log(`Vote ${voteType} for post ${postId}`);
  };

  const handleFilterChange = (filterType, searchQuery = "") => {
    setFilter({ type: filterType, query: searchQuery });
  };

  const filteredPosts = useMemo(() => {
    let result = Object.values(posts);

    result.sort((a, b) => b.createdAt - a.createdAt);

    switch (filter.type) {
    case "my":
      result = result.filter(
        (post) => post.author === authentication.username
      );
      break;
    case "search":
      if (filter.query) {
        const lowercaseQuery = filter?.query?.toLowerCase();
        result = result.filter(
          (post) =>
            post?.content?.toLowerCase().includes(lowercaseQuery) ||
              post?.author?.toLowerCase().includes(lowercaseQuery)
        );
      }
      break;
    default:
      break;
    }

    return result;
  }, [posts, filter, authentication.username]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Posts</h1>
      {authentication.username && <NewPostForm onAddPost={addPost} />}
      <FilterBar
        onFilterChange={handleFilterChange}
        activeFilter={filter.type}
      />
      {filteredPosts.map((post) => (
        <Post key={post.id} post={post} onVote={handleVote} />
      ))}
    </div>
  );
};

export default PostsPage;
