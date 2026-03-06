import { useState } from 'react';
import { API } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import type { CoAuthor } from './CoAuthorsSection';

export interface SubmissionFormData {
  email: string;
  manuscriptTitle: string;
  coAuthors: CoAuthor[];
  tag: string; 
  discipline: string;
  pdfFile: File | null;
  topic: string; // 🔥 新增主题字段
}

interface FormErrors {
  email?: string;
  manuscriptTitle?: string;
  tag?: string; 
  discipline?: string;
  pdfFile?: string;
  coAuthors?: string;
  submit?: string;
}

export function useSubmissionForm() {
  const { user } = useAuth(); // 只需要取邮箱就行了
  const [formData, setFormData] = useState<SubmissionFormData>({
    email: user?.email || '',
    manuscriptTitle: '',
    coAuthors: [],
    tag: '', 
    discipline: '',
    pdfFile: null,
    topic: '', // 🔥 初始化为空字符串，代表“无”
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <K extends keyof SubmissionFormData>(field: K, value: SubmissionFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email / 请输入有效邮箱';
    }
    if (!formData.manuscriptTitle.trim()) {
      newErrors.manuscriptTitle = 'Title is required / 标题不能为空';
    }
    if (!formData.tag) {
      newErrors.tag = 'Please select a tag / 请选择文章分类'; 
    }
    if (!formData.discipline) {
      newErrors.discipline = 'Please select discipline / 请选择学科';
    }
    if (!formData.pdfFile) {
      newErrors.pdfFile = 'Please upload a PDF file / 请上传 PDF 文件';
    }

    // 校验共同作者
    for (let i = 0; i < formData.coAuthors.length; i++) {
      const ca = formData.coAuthors[i];
      if (!ca.name.trim() || !ca.email.trim()) {
        newErrors.coAuthors = `Co-author #${i + 1}: name and email are required / 共同作者 #${i + 1} 的姓名和邮箱为必填`;
        break;
      }
    }

    setErrors(newErrors);
    const firstError = Object.keys(newErrors)[0] as keyof FormErrors | undefined;
    if (firstError) {
      const sectionMap: Record<string, string> = {
        email: 'section-identity',
        manuscriptTitle: 'section-identity',
        coAuthors: 'section-coauthors',
        tag: 'section-tag', 
        discipline: 'section-discipline',
        pdfFile: 'section-payload',
      };
      const sectionId = sectionMap[firstError];
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentStep = (): number => {
    if (formData.pdfFile) return 4;
    if (formData.discipline) return 4;
    if (formData.tag) return 3; 
    if (formData.email || formData.manuscriptTitle) return 2;
    return 1;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    try {
      await API.articles.upload(
        formData.manuscriptTitle,
        formData.tag,           
        formData.discipline,    
        formData.topic,         // 🔥 把 topic 传给 api.ts
        formData.coAuthors,     
        formData.pdfFile!       
      );

      setIsSubmitted(true);
    } catch (error: any) {
      const message = error.message || 'Submission failed / 提交失败，请联系管理员';
      setErrors(prev => ({ ...prev, submit: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    currentStep: getCurrentStep(),
    updateField,
    handleSubmit,
  };
}