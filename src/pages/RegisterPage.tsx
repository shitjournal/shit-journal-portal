import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// 🔥 1. 彻底移除 supabase，接入咱们的兵工厂
import { API } from '../lib/api'; 
import { REGISTRATION_CLOSED } from '../lib/maintenanceConfig';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // 🔥 2. 第一步：点击注册时，先向后端请求发送验证码
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters / 密码至少6位');
      return;
    }

    setLoading(true);
    try {
      // 呼叫后端 API 发送验证码
      await API.auth.sendCode(email, 'register');
      setSuccess(true); // 切换到输入验证码的 UI
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || '发送验证码失败');
    }
    setLoading(false);
  };

  // 🔥 3. 第二步：用户填好验证码，连同表单一起正式发起注册
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setVerifying(true);

    // 调用我们在 AuthContext 里写好的 signUp，它带了第四个参数 otp！
    const { error: err } = await signUp(email, password, displayName, otp.trim());

    if (err) {
      setVerifyError(err);
      setVerifying(false);
    } else {
      // 注册成功，后端会自动下发 Token 并存入 localStorage，直接放行进主城！
      navigate('/dashboard');
    }
  };

  // 🔥 4. 重发验证码
  const handleResend = async () => {
    if (cooldown > 0) return;
    setResent(false);
    try {
      await API.auth.sendCode(email, 'register');
      setResent(true);
      setCooldown(60);
    } catch (err) {}
  };

  // --------------------------------------------------------------------------
  // 下方的 UI 渲染部分一字不改，完美兼容！
  // --------------------------------------------------------------------------
  if (REGISTRATION_CLOSED) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <img src="/LOGO2.png" alt="构石" className="w-16 h-16 inline-block mb-2" />
          <h2 className="text-3xl font-serif font-bold mb-2">Registration Closed</h2>
          <h3 className="chinese-serif text-xl text-charcoal-light">注册通道暂时关闭</h3>
        </div>
        <div className="bg-white p-8 border border-gray-200 shadow-sm">
          <div className="font-serif text-charcoal leading-relaxed space-y-4 text-sm">
            <p>各位未来的石友：</p>
            <p>我们目前正在进行系统维护与升级。为了确保新用户能够获得完整的使用体验，<strong className="underline decoration-accent-gold decoration-2 underline-offset-4">注册通道暂时关闭</strong>。</p>
            <p>投稿和评论功能也在维护中，待全部功能恢复后，注册将同步重新开放。感谢你的耐心等待！</p>
          </div>
          <div className="mt-8 space-y-3">
            <Link to="/login" className="block w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg text-center">
              已有账号？前往登录 / Log In
            </Link>
            <Link to="/submit" className="block w-full py-4 border border-gray-300 text-charcoal text-xs font-bold uppercase tracking-[0.2em] hover:border-accent-gold hover:text-accent-gold transition-colors text-center">
              前往留言板 / Message Board
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-6">📧</span>
          <h2 className="text-3xl font-serif font-bold mb-2">Enter Verification Code</h2>
          <h3 className="chinese-serif text-xl text-charcoal-light mb-4">输入验证码</h3>
          <p className="font-serif text-gray-500 text-sm">We've sent a verification code to <strong>{email}</strong>.</p>
          <p className="chinese-serif text-gray-400 text-sm">请查看邮箱中的验证码。</p>
        </div>
        <form onSubmit={handleVerify} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
          {verifyError && <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">{verifyError}</div>}
          <div>
            <label className="form-label">Verification Code / 验证码</label>
            <input className="form-input text-center text-2xl tracking-[0.5em] font-mono" type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="000000" required maxLength={8} autoFocus />
          </div>
          <button type="submit" disabled={verifying || otp.length < 6} className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {verifying ? 'Verifying... / 验证中...' : 'Verify / 验证'}
          </button>
          <div className="text-center">
            <button type="button" onClick={handleResend} disabled={cooldown > 0} className="text-sm text-accent-gold font-bold hover:underline cursor-pointer disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed">
              {cooldown > 0 ? `Resend in ${cooldown}s / ${cooldown}秒后重发` : 'Resend Code / 重新发送'}
            </button>
            {resent && cooldown > 55 && <p className="text-xs text-green-600 mt-2">Code resent! / 已重新发送！</p>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <img src="/LOGO2.png" alt="构石" className="w-16 h-16 inline-block mb-2" />
        <h2 className="text-3xl font-serif font-bold mb-1">Join the Movement</h2>
        <h3 className="chinese-serif text-xl text-charcoal-light">加入排泄运动</h3>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
        {error && <div className="p-3 bg-red-50 border border-science-red text-science-red text-sm font-bold">{error}</div>}
        <div>
          <label className="form-label">Display Name / 昵称 <span className="text-gray-400 text-xs normal-case tracking-normal">（不建议用真名）</span></label>
          <input className="form-input" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. 拉屎侠" required />
        </div>
        <div>
          <label className="form-label">Email / 邮箱</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.shit@email.com" required />
        </div>
        <div>
          <label className="form-label">Password / 密码</label>
          <div className="relative">
            <input className="form-input pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters / 至少6位" required minLength={6} />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal text-sm cursor-pointer" tabIndex={-1}>{showPassword ? '🙈' : '👁'}</button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Registering... / 注册中...' : 'Register / 注册'}
        </button>
        <p className="text-center text-sm text-gray-500">Already have an account?{' '}<Link to="/login" className="text-accent-gold font-bold hover:underline">Log In / 登录</Link></p>
      </form>
    </div>
  );
};