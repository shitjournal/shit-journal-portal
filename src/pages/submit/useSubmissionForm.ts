import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { CoAuthor } from './CoAuthorsSection';

export interface SubmissionFormData {
  email: string;
  manuscriptTitle: string;
  authorName: string;
  institution: string;
  socialMedia: string;
  coAuthors: CoAuthor[];
  viscosity: string;
  file: File | null;
}

interface FormErrors {
  email?: string;
  manuscriptTitle?: string;
  authorName?: string;
  institution?: string;
  viscosity?: string;
  file?: string;
  coAuthors?: string;
  submit?: string;
}

export function useSubmissionForm() {
  const [formData, setFormData] = useState<SubmissionFormData>({
    email: '',
    manuscriptTitle: '',
    authorName: '',
    institution: '',
    socialMedia: '',
    coAuthors: [],
    viscosity: '',
    file: null,
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

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Name is required / 笔名不能为空';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email / 请输入有效邮箱';
    }
    if (!formData.manuscriptTitle.trim()) {
      newErrors.manuscriptTitle = 'Title is required / 标题不能为空';
    }
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required / 单位不能为空';
    }
    if (!formData.viscosity) {
      newErrors.viscosity = 'Please select viscosity / 请选择粘度';
    }
    if (!formData.file) {
      newErrors.file = 'Please upload a file / 请上传文件';
    }

    // Validate co-authors that have been partially filled
    for (let i = 0; i < formData.coAuthors.length; i++) {
      const ca = formData.coAuthors[i];
      if (!ca.name.trim() || !ca.email.trim()) {
        newErrors.coAuthors = `Co-author #${i + 1}: name and email are required / 共同作者 #${i + 1} 的姓名和邮箱为必填`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentStep = (): number => {
    if (formData.file) return 3;
    if (formData.viscosity) return 3;
    if (formData.email || formData.manuscriptTitle || formData.authorName) return 2;
    return 1;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    try {
      const file = formData.file!;
      const submissionId = crypto.randomUUID();
      const ext = file.name.split('.').pop() || 'docx';

      // Use author name + email as filename
      const safeName = formData.authorName.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_');
      const safeEmail = formData.email.replace(/[@.]/g, '_');
      const filePath = `${submissionId}/${safeName}_${safeEmail}.${ext}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('manuscripts')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`File upload failed / 文件上传失败: ${uploadError.message}`);
      }

      // Insert submission record
      const { error: dbError } = await supabase
        .from('submissions')
        .insert({
          id: submissionId,
          email: formData.email,
          manuscript_title: formData.manuscriptTitle,
          author_name: formData.authorName,
          institution: formData.institution,
          social_media: formData.socialMedia || null,
          co_authors: formData.coAuthors.length > 0 ? formData.coAuthors : [],
          viscosity: formData.viscosity,
          file_path: filePath,
          file_name: file.name,
          file_size_bytes: file.size,
        });

      if (dbError) {
        throw new Error(`Database error / 数据库错误: ${dbError.message}`);
      }

      setIsSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed / 提交失败';
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
