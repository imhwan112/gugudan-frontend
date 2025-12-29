"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { FAQ, FAQCategory, FAQ_CATEGORY_LABELS } from "@/types/faq";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, selectedCategory, searchKeyword]);

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

  const filterFAQs = () => {
    let filtered = faqs;

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(keyword) ||
          faq.answer.toLowerCase().includes(keyword)
      );
    }

    setFilteredFaqs(filtered);
  };

  const toggleExpand = async (faqId: string) => {
    if (expandedId === faqId) {
      setExpandedId(null);
    } else {
      setExpandedId(faqId);
      try {
        await api.get(`/api/v1/faqs/${faqId}`);
      } catch (err) {
        console.error("Failed to increment view count:", err);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-3xl">자주 묻는 질문</CardTitle>
              <CardDescription>
                자주 묻는 질문과 답변을 확인해보세요. 원하는 답변을 찾지 못하셨다면 1:1 문의를 이용해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="질문 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6 flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("ALL")}
                >
                  전체
                </Button>
                {Object.entries(FAQ_CATEGORY_LABELS).map(([category, label]) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category as FAQCategory)}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {/* FAQ List */}
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
              ) : filteredFaqs.length === 0 ? (
                <div className="py-10 text-center text-gray-600">
                  {searchKeyword || selectedCategory !== "ALL"
                    ? "검색 결과가 없습니다."
                    : "등록된 FAQ가 없습니다."}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition"
                    >
                      <button
                        onClick={() => toggleExpand(faq.id)}
                        className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                      >
                        <div className="flex-1 flex items-start gap-3">
                          <Badge variant="secondary">
                            {FAQ_CATEGORY_LABELS[faq.category]}
                          </Badge>
                          <span className="font-medium text-gray-900">{faq.question}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            조회 {faq.view_count}
                          </span>
                          {expandedId === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {expandedId === faq.id && (
                        <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Link to Inquiry */}
          <Card className="border border-gray-200 bg-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">원하는 답변을 찾지 못하셨나요?</h3>
                  <p className="text-sm text-gray-600">
                    1:1 문의를 통해 직접 질문해주세요.
                  </p>
                </div>
                <Button onClick={() => router.push("/inquiry")}>
                  1:1 문의하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}