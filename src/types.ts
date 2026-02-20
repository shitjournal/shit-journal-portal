export interface NewsItem {
  date: string;
  title: string;
  subtitle: string;
  isAnnouncement?: boolean;
}

export interface Article {
  id: string;
  type: 'Original Research' | 'Review' | 'Editorial';
  title: string;
  chineseTitle: string;
  description: string;
  authors: string;
  doi: string;
  imageUrl?: string;
  typeColor?: string;
}

export interface Metric {
  label: string;
  labelCn: string;
  value: string;
  unit?: string;
}
