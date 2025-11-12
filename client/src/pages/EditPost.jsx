import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PostForm from '../components/PostForm';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        if (data.user._id !== user.id) {
          setError("You don't have permission to edit this post.");
          setLoading(false);
          return;
        }
        setPost(data);
      } catch (err) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleSubmit = async (title, body) => {
    try {
      setSubmitting(true);
      await updatePost(id, title, body);
      navigate(`/posts/${id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to update post.';
      setError(errorMsg);
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error && !post) return <div>{error}</div>;

  return (
    <PostForm
      mode="edit"
      initialData={post}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/posts/${id}`)}
      loading={submitting}
    />
  );
};

export default EditPost;
