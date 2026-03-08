import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GuidelinesGate } from './GuidelinesGate';

describe('GuidelinesGate', () => {
  it('renders the updated covenant content and calls onAgree', async () => {
    const user = userEvent.setup();
    const onAgree = vi.fn();

    render(<GuidelinesGate onAgree={onAgree} />);

    expect(screen.getByRole('heading', { name: /s\.h\.i\.t journal 准入契约 v1\.1/i })).toBeInTheDocument();
    expect(screen.getByText(/本刊为一项面向学术去中心化、学术平权与学术自治的长期性社会实验/i)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'LaTeX Template' })).toHaveAttribute('href', '/SHIT-LaTeX-Template.zip');
    expect(screen.getByRole('link', { name: 'Word Template' })).toHaveAttribute('href', '/SHIT_Word-Template.docx');
    expect(screen.getByRole('link', { name: /详情：投稿准则与要求/i })).toHaveAttribute('href', '/submission-guidelines');
    expect(screen.getByRole('link', { name: /详情：每日录用准则/i })).toHaveAttribute('href', '/daily-recruitment-guidelines');

    await user.click(screen.getByRole('button', { name: /i agree to the covenant/i }));

    expect(onAgree).toHaveBeenCalledTimes(1);
  });
});
