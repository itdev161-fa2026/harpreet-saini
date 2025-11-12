import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../services/api";
import { AuthContext } from "../context/AuthProvider"; // make sure path matches
import PostCard from "../components/PostCard";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {}; // ✅ safe destructure
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <h1>Recent Posts</h1>
      {user && (
        <button onClick={() => navigate("/posts/create")}>
          Create New Post
        </button>
      )}
      {posts.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  );
};

export default HomePage;
