import React from 'react';
import { Link } from 'react-router-dom'; // for clickable links/navigation
import './PostCard.css'; // import the styles

const PostCard = ({ post }) => {
  // Helper function to format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="post-card">
      <Link to={`/posts/${post._id}`} className="post-card-link">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span className="post-author">By {post.user?.name || 'Unknown'}</span>
          <span className="post-date">{formatDate(post.createDate)}</span>
        </div>
        <p className="post-preview">
          {post.body.substring(0, 150)}
          {post.body.length > 150 ? '...' : ''}
        </p>
        <span className="read-more">Read more →</span>
      </Link>
    </div>
  );
};

export default PostCard;
