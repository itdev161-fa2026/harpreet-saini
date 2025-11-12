import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div className="post-card" onClick={() => navigate(`/posts/${post._id}`)}>
      <h2>{post.title}</h2>
      <p>{post.body.slice(0, 100)}...</p>
      <p>By {post.user?.name}</p>
    </div>
  );
};

export default PostCard;
