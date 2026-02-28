import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // OTP verification
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (cooldown <= 0) { clearInterval(cooldownRef.current); return; }
    cooldownRef.current = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(cooldownRef.current);
  }, [cooldown > 0]);

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
      setCooldown(60);
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setVerifying(true);

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'signup',
    });

    if (err) {
      setVerifyError(err.message);
      setVerifying(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResent(false);
    await supabase.auth.resend({ type: 'signup', email });
    setResent(true);
    setCooldown(60);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-6">📧</span>
          <h2 className="text-3xl font-serif font-bold mb-2">Enter Verification Code</h2>
          <h3 className="chinese-serif text-xl text-charcoal-light mb-4">输入验证码</h3>
          <p className="font-serif text-gray-500 text-sm">
            We've sent a verification code to <strong>{email}</strong>.
          </p>
          <p className="chinese-serif text-gray-400 text-sm">
            请查看邮箱中的验证码。
          </p>
        </div>

        <form onSubmit={handleVerify} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
          {verifyError && (
            <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">
              {verifyError}
            </div>
          )}

          <div>
            <label className="form-label">Verification Code / 验证码</label>
            <input
              className="form-input text-center text-2xl tracking-[0.5em] font-mono"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="00000000"
              required
              maxLength={8}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={verifying || otp.length < 6}
            className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? 'Verifying... / 验证中...' : 'Verify / 验证'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-sm text-accent-gold font-bold hover:underline cursor-pointer disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s / ${cooldown}秒后重发` : 'Resend Code / 重新发送'}
            </button>
            {resent && cooldown > 55 && (
              <p className="text-xs text-green-600 mt-2">Code resent! / 已重新发送！</p>
            )}
          </div>
        </form>
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
