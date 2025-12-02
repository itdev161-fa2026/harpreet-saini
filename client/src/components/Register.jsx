import { useState } from 'react';
import './Register.css';
import { toast } from 'react-hot-toast'; // <- import toast
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister, error: authError }) => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <- navigate after successful registration

  const { name, email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if(!name.trim()) newErrors.name = 'Name is required';
    if(!email.trim()) newErrors.email = 'Email is required';
    else if(!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if(!password) newErrors.password='Password is required';
    else if(password.length<6) newErrors.password='Password must be at least 6 chars';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if(!validateForm()) return;

    setLoading(true);
    try {
      await onRegister(name, email, password); // <- call your register function
      toast.success("Registered successfully!"); // <- success toast
      navigate("/login"); // redirect to login page
    } catch (err) {
      toast.error(err.message || "Registration failed!"); // <- error toast
    }
    setLoading(false);
  };

  return (
    <div className="register-form">
      <h2>Create an Account</h2>
      <p className="register-subtitle">Join our blog community</p>
      {authError && <div className="error-message">{authError}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={name} onChange={onChange} className={errors.name?'input-error':''}/>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={email} onChange={onChange} className={errors.email?'input-error':''}/>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} className={errors.password?'input-error':''}/>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <button disabled={loading}>{loading?'Creating Account...':'Register'}</button>
      </form>
    </div>
  );
};

export default Register;
