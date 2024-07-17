import React from "react";
import withAuth from "../../src/HOCs/withAuth";
import PostsPage from "../../src/components/Posts/PostsPage";

function Posts() {
	return <PostsPage />;
}

export default withAuth(Posts);
