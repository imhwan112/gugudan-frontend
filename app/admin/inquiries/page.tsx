"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/api";
import {
  Inquiry,
  InquiryDetailResponse,
  InquiryReply,
  InquiryStatus,
  CreateInquiryReplyRequest,
  UpdateInquiryStatusRequest,
  INQUIRY_CATEGORY_LABELS,
  INQUIRY_STATUS_LABELS,
} from "@/types/inquiry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Send } from "lucide-react";

function AdminInquiriesContent() {
  const { user, isLoading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedReplies, setSelectedReplies] = useState<InquiryReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "ALL">("ALL");

  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<Inquiry[]>("/api/v1/inquiries/admin/all");
      setInquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiryDetail = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<InquiryDetailResponse>(`/api/v1/inquiries/${id}`);
      setSelectedInquiry(data.inquiry);
      setSelectedReplies(data.replies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 상세를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInquiry) return;

    if (!replyContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSubmittingReply(true);

    try {
      const request: CreateInquiryReplyRequest = {
        content: replyContent,
      };

      await api.post(`/api/v1/inquiries/${selectedInquiry.id}/replies`, request);
      alert("답변이 등록되었습니다.");
      setReplyContent("");
      fetchInquiryDetail(selectedInquiry.id);
      fetchInquiries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "답변 등록에 실패했습니다.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleUpdateStatus = async (status: InquiryStatus) => {
    if (!selectedInquiry) return;

    try {
      const request: UpdateInquiryStatusRequest = { status };
      await api.patch(`/api/v1/inquiries/${selectedInquiry.id}/status`, request);
      alert("상태가 변경되었습니다.");
      fetchInquiryDetail(selectedInquiry.id);
      fetchInquiries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "상태 변경에 실패했습니다.");
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

  const filteredInquiries =
    filterStatus === "ALL"
      ? inquiries
      : inquiries.filter((inq) => inq.status === filterStatus);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">문의 관리</h1>
            <p className="text-gray-600 mt-1">고객 문의를 확인하고 답변을 작성할 수 있습니다</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>문의 목록</CardTitle>
                  <CardDescription>
                    총 {filteredInquiries.length}건
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Status Filter */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterStatus("ALL")}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md border-2 transition ${
                        filterStatus === "ALL"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      전체
                    </button>
                    {Object.entries(INQUIRY_STATUS_LABELS).map(([status, label]) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status as InquiryStatus)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md border-2 transition ${
                          filterStatus === status
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

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
                  ) : filteredInquiries.length === 0 ? (
                    <div className="py-10 text-center text-gray-600">
                      문의가 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {filteredInquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          onClick={() => fetchInquiryDetail(inquiry.id)}
                          className={`border rounded-lg p-3 cursor-pointer transition ${
                            selectedInquiry?.id === inquiry.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {INQUIRY_CATEGORY_LABELS[inquiry.category]}
                            </Badge>
                            <Badge className={`text-xs ${getStatusBadgeColor(inquiry.status)}`}>
                              {INQUIRY_STATUS_LABELS[inquiry.status]}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">
                            {inquiry.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(inquiry.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {selectedInquiry ? (
                <Card className="border border-gray-200 bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">
                            {INQUIRY_CATEGORY_LABELS[selectedInquiry.category]}
                          </Badge>
                          <Badge className={getStatusBadgeColor(selectedInquiry.status)}>
                            {INQUIRY_STATUS_LABELS[selectedInquiry.status]}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl">{selectedInquiry.title}</CardTitle>
                        <CardDescription>
                          {formatDate(selectedInquiry.created_at)}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedInquiry(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Original Inquiry */}
                    <div>
                      <h3 className="font-semibold mb-2">문의 내용</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedInquiry.content}
                        </p>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h3 className="font-semibold mb-2">상태 변경</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(INQUIRY_STATUS_LABELS).map(([status, label]) => (
                          <button
                            key={status}
                            onClick={() => handleUpdateStatus(status as InquiryStatus)}
                            disabled={selectedInquiry.status === status}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md border-2 transition ${
                              selectedInquiry.status === status
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm cursor-not-allowed"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Replies */}
                    {selectedReplies && selectedReplies.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">답변 내역</h3>
                        <div className="space-y-3">
                          {selectedReplies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-4 rounded-lg border ${
                                reply.is_admin_reply
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {reply.is_admin_reply ? "관리자" : "사용자"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Form */}
                    <div>
                      <h3 className="font-semibold mb-3">답변 작성</h3>
                      <form onSubmit={handleCreateReply} className="space-y-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                          placeholder="답변 내용을 입력해주세요"
                          disabled={submittingReply}
                          required
                        />
                        <Button
                          type="submit"
                          disabled={submittingReply}
                          className="flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          {submittingReply ? "등록 중..." : "답변 등록"}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-gray-200 bg-white">
                  <CardContent className="py-20">
                    <div className="text-center text-gray-500">
                      <p>문의를 선택해주세요</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminInquiriesContent />
    </ProtectedRoute>
  );
}