export enum FAQCategory {
  GENERAL = "GENERAL",
  ACCOUNT = "ACCOUNT",
  BILLING = "BILLING",
  TECHNICAL = "TECHNICAL",
  SERVICE = "SERVICE",
  OTHER = "OTHER",
}

export interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  is_published: boolean;
  display_order: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFAQRequest {
  category: FAQCategory;
  question: string;
  answer: string;
  is_published?: boolean;
  display_order?: number;
}

export interface UpdateFAQRequest {
  category?: FAQCategory;
  question?: string;
  answer?: string;
  is_published?: boolean;
  display_order?: number;
}

export const FAQ_CATEGORY_LABELS: Record<FAQCategory, string> = {
  [FAQCategory.GENERAL]: "일반",
  [FAQCategory.ACCOUNT]: "계정",
  [FAQCategory.BILLING]: "결제",
  [FAQCategory.TECHNICAL]: "기술",
  [FAQCategory.SERVICE]: "서비스",
  [FAQCategory.OTHER]: "기타",
};