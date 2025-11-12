import { useState, useEffect } from 'react';
import './PostForm.css';

const PostForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        body: initialData.body || '',
      });
    }
  }, [initialData]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.body.trim()) newErrors.body = 'Body is required';
    else if (formData.body.trim().length < 10) newErrors.body = 'Body must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData.title.trim(), formData.body.trim());
  };

  return (
    <div className="post-form">
      <h2>{mode === 'create' ? 'Create New Post' : 'Edit Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className={errors.title ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Body</label>
          <textarea
            name="body"
            value={formData.body}
            onChange={onChange}
            className={errors.body ? 'input-error' : ''}
            rows="12"
            disabled={loading}
          />
          {errors.body && <span className="field-error">{errors.body}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Post' : 'Save Changes')}
          </button>
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
