import React from 'react';

export const TopUtilityBar: React.FC = () => (
  <div className="w-full bg-white border-b border-gray-200 py-1.5 px-4 lg:px-8 flex justify-end items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
    <a className="hover:text-science-red transition-colors" href="#">Log In<span className="hidden sm:inline"> / 登录</span></a>
    <a className="hover:text-science-red transition-colors" href="#">Register<span className="hidden sm:inline"> / 注册</span></a>
    <a className="hover:text-science-red transition-colors" href="#">Subscribe<span className="hidden sm:inline"> / 订阅</span></a>
  </div>
);
