import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters / 密码至少6位');
      return;
    }

    setLoading(true);
    const { error: err, needsConfirmation } = await signUp(email, password, displayName);
    if (err) {
      setError(err);
      setLoading(false);
    } else if (needsConfirmation) {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">📧</span>
        <h2 className="text-3xl font-serif font-bold mb-2">Check Your Email!</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light mb-6">请查看邮箱！</h3>
        <p className="font-serif text-gray-500 mb-2">
          We've sent a confirmation link to <strong>{email}</strong>.
        </p>
        <p className="chinese-serif text-gray-400 mb-8">
          点击邮件中的链接完成注册。
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all"
        >
          Go to Login / 去登录
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <span className="text-6xl block mb-4">💩</span>
        <h2 className="text-3xl font-serif font-bold mb-1">Join the Movement</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">加入排泄运动</h3>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">
            {error}
          </div>
        )}

        <div>
          <label className="form-label">Display Name / 昵称 <span className="text-gray-400 text-xs normal-case tracking-normal">（不建议用真名）</span></label>
          <input
            className="form-input"
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="e.g. 拉屎侠"
            required
          />
        </div>

        <div>
          <label className="form-label">Email / 邮箱</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your.shit@email.com"
            required
          />
        </div>

        <div>
          <label className="form-label">Password / 密码</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters / 至少6位"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering... / 注册中...' : 'Register / 注册'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-gold font-bold hover:underline">
            Log In / 登录
          </Link>
        </p>
      </form>
    </div>
  );
};
