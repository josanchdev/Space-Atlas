import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Shield, GraduationCap, Building } from 'lucide-react'
import '../styles/scientistAuth.css'

export default function ScientistAuthPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    orcid: '',
    institution: ''
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [validationSuccess, setValidationSuccess] = useState({})

  // Lista de dominios académicos válidos
  const academicDomains = [
    '.edu', '.ac.uk', '.edu.es', '.unam.mx', '.csic.es', 
    '.edu.au', '.edu.br', '.edu.ar', '.ac.jp', '.edu.cn',
    '.ac.in', '.edu.co', '.ac.nz', '.edu.pe', '.edu.cl',
    '.edu.mx', '.ac.cr', '.edu.uy', '.ac.za', '.edu.sg'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Validar en tiempo real
    if (name === 'email' && value && !isLogin) {
      validateEmail(value)
    }
    if (name === 'orcid' && value && !isLogin) {
      validateORCID(value)
    }
  }

  const validateEmail = (email) => {
    const isAcademic = academicDomains.some(domain => email.toLowerCase().includes(domain))
    
    if (!isAcademic) {
      setValidationErrors(prev => ({
        ...prev,
        email: 'Email must be from an academic institution (.edu, .ac.uk, etc.)'
      }))
      setValidationSuccess(prev => ({ ...prev, email: false }))
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
      setValidationSuccess(prev => ({ ...prev, email: true }))
    }
  }

  const validateORCID = (orcid) => {
    // Formato ORCID: 0000-0002-1825-0097
    const orcidRegex = /^(\d{4}-){3}\d{3}[\dX]$/
    
    if (!orcidRegex.test(orcid)) {
      setValidationErrors(prev => ({
        ...prev,
        orcid: 'Invalid ORCID format (e.g., 0000-0002-1825-0097)'
      }))
      setValidationSuccess(prev => ({ ...prev, orcid: false }))
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.orcid
        return newErrors
      })
      setValidationSuccess(prev => ({ ...prev, orcid: true }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones finales
    if (!isLogin) {
      validateEmail(formData.email)
      validateORCID(formData.orcid)
      
      if (formData.password !== formData.confirmPassword) {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }))
        return
      }
      
      if (Object.keys(validationErrors).length > 0) {
        return
      }
    }

    // Guardar científico en localStorage
    const userData = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      orcid: formData.orcid,
      institution: formData.institution,
      role: 'scientist',
      isLoggedIn: true
    }
    
    localStorage.setItem('currentUser', JSON.stringify(userData))
    
    console.log('Scientist logged in:', userData)
    
    // Redirigir a la página principal
    navigate('/')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      orcid: '',
      institution: ''
    })
    setValidationErrors({})
    setValidationSuccess({})
  }

  return (
    <div className="scientist-auth-wrapper">
      {/* Background con estrellas */}
      <div className="scientist-auth-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="scientist-auth-container">
        <div className="scientist-auth-card">
          {/* Logo y título */}
          <div className="scientist-auth-header">
            <div className="scientist-auth-logo">
              <GraduationCap size={28} className="logo-icon" />
            </div>
            <h1 className="scientist-auth-title">
              {isLogin ? 'Scientist Access' : 'Scientific Community Registration'}
            </h1>
            <p className="scientist-auth-subtitle">
              {isLogin 
                ? 'Access your research workspace' 
                : 'Join our verified scientific community'}
            </p>
          </div>

          {/* Información de requisitos */}
          {!isLogin && (
            <div className="verification-info">
              <Shield size={16} />
              <div>
                <strong>Verification Required:</strong>
                <ul>
                  <li>Institutional email (.edu, .ac.uk, etc.)</li>
                  <li>Valid ORCID iD</li>
                  <li>Institutional affiliation</li>
                </ul>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form className="scientist-auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={18} />
                Institutional Email
                {!isLogin && <span className="required-badge">Required</span>}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${validationErrors.email ? 'input-error' : ''} ${validationSuccess.email ? 'input-success' : ''}`}
                placeholder="researcher@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {validationErrors.email && (
                <span className="validation-message error">❌ {validationErrors.email}</span>
              )}
              {validationSuccess.email && !isLogin && (
                <span className="validation-message success">✓ Valid email</span>
              )}
              {!isLogin && (
                <span className="helper-text">Must be from .edu, .ac.uk, etc.</span>
              )}
            </div>

            {!isLogin && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="orcid" className="form-label">
                    <Shield size={18} />
                    ORCID iD
                    <span className="required-badge">Required</span>
                  </label>
                  <input
                    type="text"
                    id="orcid"
                    name="orcid"
                    className={`form-input ${validationErrors.orcid ? 'input-error' : ''} ${validationSuccess.orcid ? 'input-success' : ''}`}
                    placeholder="0000-0002-1825-0097"
                    value={formData.orcid}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                  {validationErrors.orcid && (
                    <span className="validation-message error">❌ Invalid format</span>
                  )}
                  {validationSuccess.orcid && (
                    <span className="validation-message success">✓ Valid</span>
                  )}
                  <span className="helper-text">
                    Get at <a href="https://orcid.org" target="_blank" rel="noopener noreferrer">orcid.org</a>
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="institution" className="form-label">
                    <Building size={18} />
                    Institution
                  </label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    className="form-input"
                    placeholder="MIT"
                    value={formData.institution}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className={!isLogin ? "form-row" : "form-group"}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock size={18} />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <Lock size={18} />
                    Confirm Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <span className="validation-message error">{validationErrors.confirmPassword}</span>
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn">
              <GraduationCap size={18} />
              {isLogin ? 'Sign In' : 'Register as Scientist'}
            </button>
          </form>

          {/* Toggle entre login y registro */}
          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account?" : 'Already registered?'}
              <button type="button" onClick={toggleMode} className="toggle-btn">
                {isLogin ? 'Register here' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Link de vuelta */}
          <div className="back-link">
            <button type="button" onClick={() => navigate('/')} className="link-btn">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
