import { useState } from 'react';
import './Login.css';
import { toast } from 'react-hot-toast'; // <- import toast

const Login = ({ onLogin, error: authError }) => {
  const [formData, setFormData] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if(!email.trim()) newErrors.email = 'Email is required';
    else if(!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if(!password) newErrors.password='Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if(!validateForm()) return;

    setLoading(true);
    try {
      await onLogin(email, password); // your login function
      toast.success("Logged in successfully!"); // <- success toast
    } catch (err) {
      toast.error(err.message || "Login failed!"); // <- error toast
    }
    setLoading(false);
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {authError && <div className="error-message">{authError}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={email}
            onChange={onChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <button disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
