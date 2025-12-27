"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/api";
import {
  FAQ,
  FAQCategory,
  CreateFAQRequest,
  UpdateFAQRequest,
  FAQ_CATEGORY_LABELS,
} from "@/types/faq";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, X, Edit, Trash2, Eye, EyeOff } from "lucide-react";

function AdminFAQsContent() {
  const { user, isLoading: authLoading } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");

  const [formData, setFormData] = useState<CreateFAQRequest>({
    category: FAQCategory.GENERAL,
    question: "",
    answer: "",
    is_published: true,
    display_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFAQs();
    }
  }, [user]);

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<FAQ[]>("/api/v1/faqs");
      setFaqs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "FAQ를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFAQ = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("질문과 답변을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post<FAQ>("/api/v1/faqs", formData);
      alert("FAQ가 등록되었습니다.");
      resetForm();
      setMode("list");
      fetchFAQs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "FAQ 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFAQ = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFaq) return;

    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("질문과 답변을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const updateData: UpdateFAQRequest = {
        category: formData.category,
        question: formData.question,
        answer: formData.answer,
        is_published: formData.is_published,
        display_order: formData.display_order,
      };

      await api.put(`/api/v1/faqs/${selectedFaq.id}`, updateData);
      alert("FAQ가 수정되었습니다.");
      resetForm();
      setMode("list");
      fetchFAQs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "FAQ 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/api/v1/faqs/${id}`);
      alert("FAQ가 삭제되었습니다.");
      fetchFAQs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "FAQ 삭제에 실패했습니다.");
    }
  };

  const startEdit = (faq: FAQ) => {
    setSelectedFaq(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      is_published: faq.is_published,
      display_order: faq.display_order,
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      category: FAQCategory.GENERAL,
      question: "",
      answer: "",
      is_published: true,
      display_order: 0,
    });
    setSelectedFaq(null);
  };

  const cancelForm = () => {
    resetForm();
    setMode("list");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <div className="max-w-5xl mx-auto">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">FAQ 관리</CardTitle>
                  <CardDescription>
                    자주 묻는 질문을 관리합니다. (총 {faqs.length}건)
                  </CardDescription>
                </div>
                {mode === "list" && (
                  <Button
                    onClick={() => setMode("create")}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    새 FAQ 작성
                  </Button>
                )}
                {(mode === "create" || mode === "edit") && (
                  <Button variant="outline" onClick={cancelForm}>
                    <X className="w-4 h-4 mr-2" />
                    목록으로
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* List Mode */}
              {mode === "list" && (
                <div>
                  {loading ? (
                    <div className="py-10 text-center text-gray-600">
                      불러오는 중...
                    </div>
                  ) : error ? (
                    <div className="py-10 text-center">
                      <p className="text-sm text-red-600 mb-3">{error}</p>
                      <Button variant="outline" onClick={fetchFAQs}>
                        다시 시도
                      </Button>
                    </div>
                  ) : faqs.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-gray-600 mb-4">등록된 FAQ가 없습니다.</p>
                      <Button onClick={() => setMode("create")}>
                        첫 FAQ 작성하기
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {faqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">
                                  {FAQ_CATEGORY_LABELS[faq.category]}
                                </Badge>
                                <Badge
                                  className={
                                    faq.is_published
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-700"
                                  }
                                >
                                  {faq.is_published ? (
                                    <>
                                      <Eye className="w-3 h-3 mr-1" />
                                      공개
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-3 h-3 mr-1" />
                                      비공개
                                    </>
                                  )}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  순서: {faq.display_order}
                                </span>
                                <span className="text-xs text-gray-500">
                                  조회: {faq.view_count}회
                                </span>
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {faq.question}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {faq.answer}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDate(faq.created_at)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEdit(faq)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteFAQ(faq.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Create/Edit Mode */}
              {(mode === "create" || mode === "edit") && (
                <form
                  onSubmit={mode === "create" ? handleCreateFAQ : handleUpdateFAQ}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as FAQCategory })
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={submitting}
                    >
                      {Object.entries(FAQ_CATEGORY_LABELS).map(([category, label]) => (
                        <option key={category} value={category}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      질문
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="질문을 입력해주세요"
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      답변
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                      placeholder="답변을 입력해주세요"
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        공개 여부
                      </label>
                      <select
                        value={formData.is_published ? "true" : "false"}
                        onChange={(e) =>
                          setFormData({ ...formData, is_published: e.target.value === "true" })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={submitting}
                      >
                        <option value="true">공개</option>
                        <option value="false">비공개</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        표시 순서
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        disabled={submitting}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting
                        ? mode === "create"
                          ? "등록 중..."
                          : "수정 중..."
                        : mode === "create"
                        ? "FAQ 등록"
                        : "FAQ 수정"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelForm}
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

export default function AdminFAQsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminFAQsContent />
    </ProtectedRoute>
  );
}