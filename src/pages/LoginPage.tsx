import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

type ResetStep = 'email' | 'otp' | 'password' | 'done';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset password state
  const [resetStep, setResetStep] = useState<ResetStep>('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resent, setResent] = useState(false);

  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (err) {
      setError(err.message === 'Signups not allowed for otp'
        ? 'No account found with this email / 未找到此邮箱对应的账号'
        : err.message);
    } else {
      setResetStep('otp');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'email',
    });

    if (err) {
      setError(err.message);
    } else {
      setResetStep('password');
    }
    setLoading(false);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters / 密码至少6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match / 两次密码不一致');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });

    if (err) {
      setError(err.message);
    } else {
      // Sign out so user logs in fresh with new password
      await supabase.auth.signOut();
      setResetStep('done');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResent(false);
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setResent(true);
  };

  const exitForgotMode = () => {
    setForgotMode(false);
    setResetStep('email');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setResent(false);
  };

  // --- Forgot password flow ---
  if (forgotMode) {
    if (resetStep === 'done') {
      return (
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <span className="text-6xl block mb-6">💩</span>
          <h2 className="text-2xl font-serif font-bold mb-3">Password Updated</h2>
          <h3 className="chinese-serif text-lg text-charcoal-light mb-6">密码已更新</h3>
          <button
            onClick={exitForgotMode}
            className="px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-colors shadow-md"
          >
            Go to Login / 去登录
          </button>
        </div>
      );
    }

    if (resetStep === 'password') {
      return (
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <span className="text-6xl block mb-4">💩</span>
            <h2 className="text-3xl font-serif font-bold mb-1">Set New Password</h2>
            <h3 className="chinese-serif text-xl text-charcoal-light">设置新密码</h3>
          </div>

          <form onSubmit={handleSetPassword} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="form-label">New Password / 新密码</label>
              <input
                className="form-input"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 6 characters / 至少6位"
                required
                minLength={6}
                autoFocus
              />
            </div>

            <div>
              <label className="form-label">Confirm Password / 确认密码</label>
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating... / 更新中...' : 'Update Password / 更新密码'}
            </button>
          </form>
        </div>
      );
    }

    if (resetStep === 'otp') {
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

          <form onSubmit={handleVerifyOtp} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">
                {error}
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
              disabled={loading || otp.length < 6}
              className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying... / 验证中...' : 'Verify / 验证'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-accent-gold font-bold hover:underline cursor-pointer"
              >
                Resend Code / 重新发送
              </button>
              {resent && (
                <p className="text-xs text-green-600 mt-2">Code resent! / 已重新发送！</p>
              )}
            </div>

            <p className="text-center">
              <button
                type="button"
                onClick={exitForgotMode}
                className="text-sm text-accent-gold font-bold hover:underline"
              >
                Back to Login / 返回登录
              </button>
            </p>
          </form>
        </div>
      );
    }

    // resetStep === 'email'
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <span className="text-6xl block mb-4">💩</span>
          <h2 className="text-3xl font-serif font-bold mb-1">Reset Password</h2>
          <h3 className="chinese-serif text-xl text-charcoal-light">重置密码</h3>
        </div>

        <form onSubmit={handleSendOtp} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">
              {error}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending... / 发送中...' : 'Send Code / 发送验证码'}
          </button>

          <p className="text-center text-sm text-gray-500">
            <button
              type="button"
              onClick={exitForgotMode}
              className="text-accent-gold font-bold hover:underline"
            >
              Back to Login / 返回登录
            </button>
          </p>
        </form>
      </div>
    );
  }

  // --- Normal login ---
  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <span className="text-6xl block mb-4">💩</span>
        <h2 className="text-3xl font-serif font-bold mb-1">Authenticate Your Bowels</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">肠道身份验证</h3>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">
            {error}
          </div>
        )}

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
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setForgotMode(true)}
            className="text-xs text-gray-400 hover:text-accent-gold mt-1 float-right"
          >
            Forgot Password? / 忘记密码？
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Authenticating... / 验证中...' : 'Log In / 登录'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-gold font-bold hover:underline">
            Register / 注册
          </Link>
        </p>
      </form>
    </div>
  );
};
