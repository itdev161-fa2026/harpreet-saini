import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, deletePost } from '../services/api';
import { AuthContext } from '../context/AuthContext';


const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id);
      setPost(data);
    };
    fetchPost();
  }, [id]);

  const handleEdit = () => navigate(`/posts/${id}/edit`);
  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      await deletePost(id);
      navigate('/');
    }
  };

  if (!post) return <div>Loading...</div>;

  const canModify = user && post.user._id === user.id;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>By {post.user.name}</p>
      <p>{post.body}</p>
      {canModify && (
        <>
          <button onClick={handleEdit}>Edit Post</button>
          <button onClick={handleDelete}>Delete Post</button>
        </>
      )}
    </div>
  );
};

export default PostDetail;
