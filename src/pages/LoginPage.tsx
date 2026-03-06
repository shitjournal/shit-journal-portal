import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API } from '../lib/api'; 
import { REGISTRATION_CLOSED } from '../lib/maintenanceConfig';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (cooldown <= 0) { clearInterval(cooldownRef.current); return; }
    cooldownRef.current = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(cooldownRef.current);
  }, [cooldown > 0]);

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

  // 🔥 2. 发送重置密码验证码
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.auth.sendCode(email, 'reset');
      setResetStep('otp');
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || '发送失败，请检查邮箱');
    }
    setLoading(false);
  };

  // 🔥 3. 障眼法：因为我们的后端是把“验证码+新密码”一起提交的，所以这一步只做前端跳转
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // 直接进入输入新密码步骤（验证码存在 state 里，下一步一起发给后端）
    setResetStep('password');
  };

  // 🔥 4. 终极一击：连带验证码和新密码一起发给后端
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
    try {
      await API.auth.resetPassword(email, newPassword, otp.trim());
      // 密码重置成功！
      setResetStep('done');
    } catch (err: any) {
      setError(err.message || '重置失败，验证码可能不正确');
      // 如果报错，可以让人退回到输入验证码的步骤
      setResetStep('otp'); 
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResent(false);
    try {
      await API.auth.sendCode(email, 'reset');
      setResent(true);
      setCooldown(60);
    } catch (err) {}
  };

  const exitForgotMode = () => {
    setForgotMode(false);
    setResetStep('email');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setResent(false);
    setCooldown(0);
  };

  // --------------------------------------------------------------------------
  // 下方的 UI 渲染部分一字不改，完美兼容！
  // --------------------------------------------------------------------------
  if (forgotMode) {
    if (resetStep === 'done') {
      return (
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <img src="/LOGO2.png" alt="构石" className="w-16 h-16 inline-block mb-2" />
          <h2 className="text-2xl font-serif font-bold mb-3">Password Updated</h2>
          <h3 className="chinese-serif text-lg text-charcoal-light mb-6">密码已更新</h3>
          <button onClick={exitForgotMode} className="px-8 py-3 bg-accent-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-colors shadow-md">
            Go to Login / 去登录
          </button>
        </div>
      );
    }

    if (resetStep === 'password') {
      return (
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <img src="/LOGO2.png" alt="构石" className="w-16 h-16 inline-block mb-2" />
            <h2 className="text-3xl font-serif font-bold mb-1">Set New Password</h2>
            <h3 className="chinese-serif text-xl text-charcoal-light">设置新密码</h3>
          </div>
          <form onSubmit={handleSetPassword} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            {error && <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">{error}</div>}
            <div>
              <label className="form-label">New Password / 新密码</label>
              <div className="relative">
                <input className="form-input pr-10" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters / 至少6位" required minLength={6} autoFocus />
                <button type="button" onClick={() => setShowNewPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal text-sm cursor-pointer" tabIndex={-1}>{showNewPassword ? '🙈' : '👁'}</button>
              </div>
            </div>
            <div>
              <label className="form-label">Confirm Password / 确认密码</label>
              <div className="relative">
                <input className="form-input pr-10" type={showNewPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowNewPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal text-sm cursor-pointer" tabIndex={-1}>{showNewPassword ? '🙈' : '👁'}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
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
            <p className="font-serif text-gray-500 text-sm">We've sent a verification code to <strong>{email}</strong>.</p>
            <p className="chinese-serif text-gray-400 text-sm">请查看邮箱中的验证码。</p>
          </div>
          <form onSubmit={handleVerifyOtp} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            {error && <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">{error}</div>}
            <div>
              <label className="form-label">Verification Code / 验证码</label>
              <input className="form-input text-center text-2xl tracking-[0.5em] font-mono" type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="000000" required maxLength={8} autoFocus />
            </div>
            <button type="submit" disabled={loading || otp.length < 6} className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Verifying... / 验证中...' : 'Verify / 验证'}
            </button>
            <div className="text-center">
              <button type="button" onClick={handleResend} disabled={cooldown > 0} className="text-sm text-accent-gold font-bold hover:underline cursor-pointer disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed">
                {cooldown > 0 ? `Resend in ${cooldown}s / ${cooldown}秒后重发` : 'Resend Code / 重新发送'}
              </button>
              {resent && cooldown > 55 && <p className="text-xs text-green-600 mt-2">Code resent! / 已重新发送！</p>}
            </div>
            <p className="text-center"><button type="button" onClick={exitForgotMode} className="text-sm text-accent-gold font-bold hover:underline">Back to Login / 返回登录</button></p>
          </form>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <img src="/LOGO2.png" alt="构石" className="w-16 h-16 inline-block mb-2" />
          <h2 className="text-3xl font-serif font-bold mb-1">Reset Password</h2>
          <h3 className="chinese-serif text-xl text-charcoal-light">重置密码</h3>
        </div>
        <form onSubmit={handleSendOtp} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
          {error && <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">{error}</div>}
          <div>
            <label className="form-label">Email / 邮箱</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.shit@email.com" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Sending... / 发送中...' : 'Send Code / 发送验证码'}
          </button>
          <p className="text-center text-sm text-gray-500"><button type="button" onClick={exitForgotMode} className="text-accent-gold font-bold hover:underline">Back to Login / 返回登录</button></p>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <img src="/LOGO2.png" alt="构石" className="w-16 h-16 inline-block mb-2" />
        <h2 className="text-3xl font-serif font-bold mb-1">Authenticate Your Bowels</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">肠道身份验证</h3>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
        {error && <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">{error}</div>}
        <div>
          <label className="form-label">Email / 邮箱</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.shit@email.com" required />
        </div>
        <div>
          <label className="form-label">Password / 密码</label>
          <div className="relative">
            <input className="form-input pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal text-sm cursor-pointer" tabIndex={-1}>{showPassword ? '🙈' : '👁'}</button>
          </div>
          <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-gray-400 hover:text-accent-gold mt-1 float-right">Forgot Password? / 忘记密码？</button>
        </div>
        <button type="submit" disabled={loading} className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Authenticating... / 验证中...' : 'Log In / 登录'}
        </button>
        {REGISTRATION_CLOSED ? (
          <p className="text-center text-sm text-gray-400"><Link to="/register" className="hover:text-accent-gold transition-colors">注册通道暂时关闭 / Registration temporarily closed</Link></p>
        ) : (
          <p className="text-center text-sm text-gray-500">Don't have an account?{' '}<Link to="/register" className="text-accent-gold font-bold hover:underline">Register / 注册</Link></p>
        )}
      </form>
    </div>
  );
};