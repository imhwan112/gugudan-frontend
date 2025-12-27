"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/api";
import {
  Inquiry,
  InquiryCategory,
  InquiryStatus,
  CreateInquiryRequest,
  INQUIRY_CATEGORY_LABELS,
  INQUIRY_STATUS_LABELS,
} from "@/types/inquiry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MessageCircle, Plus, X } from "lucide-react";

function InquiryPageContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [formData, setFormData] = useState<CreateInquiryRequest>({
    category: InquiryCategory.GENERAL,
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<Inquiry[]>("/api/v1/inquiries/my");
      setInquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryClick = (id: number) => {
    router.push(`/inquiry/${id}`);
  };

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post<Inquiry>("/api/v1/inquiries", formData);
      alert("문의가 등록되었습니다.");
      setFormData({
        category: InquiryCategory.GENERAL,
        title: "",
        content: "",
      });
      setActiveTab("list");
      fetchInquiries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "문의 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeColor = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case InquiryStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case InquiryStatus.RESOLVED:
        return "bg-green-100 text-green-800";
      case InquiryStatus.CLOSED:
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">1:1 문의</CardTitle>
                  <CardDescription>
                    궁금하신 점을 문의해주세요. 빠른 시간 내에 답변드리겠습니다.
                  </CardDescription>
                </div>
                {activeTab === "list" && (
                  <Button onClick={() => setActiveTab("create")} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    새 문의 작성
                  </Button>
                )}
                {activeTab === "create" && (
                  <Button variant="outline" onClick={() => setActiveTab("list")}>
                    <X className="w-4 h-4 mr-2" />
                    목록으로
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* List Tab */}
              {activeTab === "list" && (
                <div>
                  {loading ? (
                    <div className="py-10 text-center text-gray-600">
                      불러오는 중...
                    </div>
                  ) : error ? (
                    <div className="py-10 text-center">
                      <p className="text-sm text-red-600 mb-3">{error}</p>
                      <Button variant="outline" onClick={fetchInquiries}>
                        다시 시도
                      </Button>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="py-10 text-center">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">아직 문의 내역이 없습니다.</p>
                      <Button onClick={() => setActiveTab("create")}>
                        첫 문의 작성하기
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          onClick={() => handleInquiryClick(inquiry.id)}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {INQUIRY_CATEGORY_LABELS[inquiry.category]}
                              </Badge>
                              <Badge className={getStatusBadgeColor(inquiry.status)}>
                                {INQUIRY_STATUS_LABELS[inquiry.status]}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(inquiry.created_at)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {inquiry.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {inquiry.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Create Form */}
              {activeTab === "create" && (
                <form onSubmit={handleCreateInquiry} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      문의 유형
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as InquiryCategory })
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={submitting}
                    >
                      {Object.entries(INQUIRY_CATEGORY_LABELS).map(([category, label]) => (
                        <option key={category} value={category}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제목
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="문의 제목을 입력해주세요"
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      내용
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                      placeholder="문의 내용을 상세히 입력해주세요"
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? "등록 중..." : "문의 등록"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("list")}
                      disabled={submitting}
                    >
                      취소
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <ProtectedRoute>
      <InquiryPageContent />
    </ProtectedRoute>
  );
}