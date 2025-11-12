import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createPost } from '../services/api';
import PostForm from '../components/PostForm';


const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (title, body) => {
    try {
      setError(null);
      setLoading(true);
      const newPost = await createPost(title, body);
      navigate(`/posts/${newPost._id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to create post.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      {error && <div className="error-message">{error}</div>}
      <PostForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate('/')} loading={loading} />
    </div>
  );
};

export default CreatePost;
