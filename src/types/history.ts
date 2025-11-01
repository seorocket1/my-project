export interface HistoryImage {
  id: string;
  type: 'blog' | 'infographic';
  title?: string;
  content?: string;
  url: string;
  timestamp: number;
  style?: string;
  colour?: string;
}
