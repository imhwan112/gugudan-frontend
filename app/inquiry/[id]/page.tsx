"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/api";
import {
  Inquiry,
  InquiryDetailResponse,
  InquiryReply,
  CreateInquiryReplyRequest,
  INQUIRY_CATEGORY_LABELS,
  INQUIRY_STATUS_LABELS,
} from "@/types/inquiry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, MessageCircle, Clock, CheckCircle2, Send } from "lucide-react";

function InquiryDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [replies, setReplies] = useState<InquiryReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const inquiryId = params.id as string;

  useEffect(() => {
    if (user && inquiryId) {
      fetchInquiry();
    }
  }, [user, inquiryId]);

  const fetchInquiry = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<InquiryDetailResponse>(`/api/v1/inquiries/${inquiryId}`);
      setInquiry(data.inquiry);
      setReplies(data.replies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 상세를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inquiry) return;

    if (!replyContent.trim()) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    setSubmittingReply(true);

    try {
      const request: CreateInquiryReplyRequest = {
        content: replyContent,
      };

      await api.post(`/api/v1/inquiries/${inquiry.id}/replies`, request);
      alert("답글이 등록되었습니다.");
      setReplyContent("");
      fetchInquiry();
    } catch (err) {
      alert(err instanceof Error ? err.message : "답글 등록에 실패했습니다.");
    } finally {
      setSubmittingReply(false);
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <MessageCircle className="w-4 h-4" />;
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-gray-200 bg-white">
              <CardContent className="py-10">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => router.push("/inquiry")}>
                      목록으로
                    </Button>
                    <Button onClick={fetchInquiry}>다시 시도</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-gray-200 bg-white">
              <CardContent className="py-10">
                <div className="text-center text-gray-600">
                  <p>문의를 찾을 수 없습니다.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/inquiry")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Button>

          {/* Inquiry Detail Card */}
          <Card className="border border-gray-200 bg-white mb-6">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {INQUIRY_CATEGORY_LABELS[inquiry.category]}
                  </Badge>
                  <Badge className={`text-sm flex items-center gap-1 border ${getStatusBadgeColor(inquiry.status)}`}>
                    {getStatusIcon(inquiry.status)}
                    {INQUIRY_STATUS_LABELS[inquiry.status]}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(inquiry.created_at)}
                </span>
              </div>
              <CardTitle className="text-3xl">{inquiry.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {inquiry.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies Section */}
          {replies && replies.length > 0 ? (
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  답변 ({replies.length})
                </CardTitle>
                <CardDescription>
                  관리자의 답변을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {replies.map((reply, index) => (
                    <div
                      key={reply.id}
                      className={`p-5 rounded-lg border ${
                        reply.is_admin_reply
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {reply.is_admin_reply
                              ? "관리자"
                              : `${user?.nickname}님`}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 bg-white">
              <CardContent className="py-12">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">아직 답변이 없습니다</p>
                  {inquiry.status === "PENDING" && (
                    <p className="text-sm text-gray-500">
                      빠른 시간 내에 답변드리겠습니다.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reply Form - 문의가 종료되지 않은 경우에만 표시 */}
          {inquiry.status !== "CLOSED" && (
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">추가 문의</CardTitle>
                <CardDescription>
                  추가 질문이나 답변에 대한 의견을 남겨주세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateReply} className="space-y-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    placeholder="추가 문의 내용을 입력해주세요"
                    disabled={submittingReply}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={submittingReply}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submittingReply ? "등록 중..." : "답글 등록"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Status Info */}
          {inquiry.status === "PENDING" && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">답변 대기 중</h4>
                  <p className="text-sm text-yellow-800">
                    문의하신 내용을 확인하고 있습니다. 빠른 시간 내에 답변드리겠습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {inquiry.status === "IN_PROGRESS" && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">처리 중</h4>
                  <p className="text-sm text-blue-800">
                    문의하신 내용을 처리하고 있습니다. 곧 답변을 받으실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {inquiry.status === "RESOLVED" && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">해결 완료</h4>
                  <p className="text-sm text-green-800">
                    문의하신 내용이 해결되었습니다. 추가 문의사항이 있으시면 새로운 문의를 등록해주세요.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InquiryDetailPage() {
  return (
    <ProtectedRoute>
      <InquiryDetailContent />
    </ProtectedRoute>
  );
}