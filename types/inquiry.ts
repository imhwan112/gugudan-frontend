export enum InquiryCategory {
  GENERAL = "GENERAL",
  ACCOUNT = "ACCOUNT",
  BILLING = "BILLING",
  TECHNICAL = "TECHNICAL",
  BUG_REPORT = "BUG_REPORT",
  FEATURE_REQUEST = "FEATURE_REQUEST",
  OTHER = "OTHER",
}

export enum InquiryStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface InquiryReply {
  id: number;
  inquiry_id: number;
  account_id: number;
  content: string;
  is_admin_reply: boolean;
  created_at: string;
}

export interface Inquiry {
  id: number;
  account_id: number;
  category: InquiryCategory;
  title: string;
  content: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface InquiryDetailResponse {
  inquiry: Inquiry;
  replies: InquiryReply[];
}

export interface CreateInquiryRequest {
  category: InquiryCategory;
  title: string;
  content: string;
}

export interface CreateInquiryReplyRequest {
  content: string;
}

export interface UpdateInquiryStatusRequest {
  status: InquiryStatus;
}

export const INQUIRY_CATEGORY_LABELS: Record<InquiryCategory, string> = {
  [InquiryCategory.GENERAL]: "일반 문의",
  [InquiryCategory.ACCOUNT]: "계정 관련",
  [InquiryCategory.BILLING]: "결제/환불",
  [InquiryCategory.TECHNICAL]: "기술 지원",
  [InquiryCategory.BUG_REPORT]: "버그 신고",
  [InquiryCategory.FEATURE_REQUEST]: "기능 요청",
  [InquiryCategory.OTHER]: "기타",
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  [InquiryStatus.PENDING]: "대기중",
  [InquiryStatus.IN_PROGRESS]: "처리중",
  [InquiryStatus.RESOLVED]: "해결됨",
  [InquiryStatus.CLOSED]: "종료됨",
};