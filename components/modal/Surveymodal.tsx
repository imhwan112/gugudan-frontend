"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SurveyContent, SurveyQuestion } from "@/components/modal/_content/survey";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: Record<string, string>) => void;
  surveyContent: SurveyContent;
}

export function SurveyModal({ isOpen, onClose, onComplete, surveyContent }: SurveyModalProps) {
  const questions = useMemo<SurveyQuestion[]>(() => surveyContent.questions ?? [], [surveyContent.questions]);
  const total = questions.length;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textValue, setTextValue] = useState("");
  const [showDone, setShowDone] = useState(false); // ✅ 완료 화면 표시 여부
  const completedRef = useRef(false);

  const closeSafely = () => onClose();

  // ✅ done 질문 찾기
  const doneQuestion = useMemo(() => questions.find(q => q.type === "done"), [questions]);

  // 모달 오픈 시 초기화
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setAnswers({});
    setTextValue("");
    setShowDone(false);
    completedRef.current = false;
  }, [isOpen]);

  // step 범위 보정
  useEffect(() => {
    if (total <= 0) return;
    if (step < 1) setStep(1);
    else if (step > total) setStep(total);
  }, [step, total]);

  const current: SurveyQuestion | undefined =
    total > 0 ? questions[Math.min(Math.max(step - 1, 0), total - 1)] : undefined;

  const progress = total <= 0 ? 0 : Math.round((Math.min(step, total) / total) * 100);

  const goPrev = () => {
    if (step <= 1) return;
    const prev = questions[step - 2];
    setStep((s) => s - 1);
    if (prev?.type === "text") setTextValue(answers[prev.id] ?? "");
    else setTextValue("");
  };

  const goNext = () => {
    if (step >= total) return;
    const next = questions[step];
    setStep((s) => s + 1);
    if (next?.type === "text") setTextValue(answers[next.id] ?? "");
    else setTextValue("");
  };

const goDone = (finalAnswers: Record<string, string>) => {
  if (completedRef.current) return;
  completedRef.current = true;
  
  setAnswers(finalAnswers);
  setShowDone(true);
  
  // ✅ 백그라운드에서 서버 전송 (모달은 안 닫음)
  onComplete(finalAnswers);
  // ✅ 사용자에게 즉시 피드백
  alert("설문에 응해주셔서 감사합니다 💗");

  // ✅ 모달 닫기
  closeSafely();
};

  const handleSelect = (questionId: string, value: string) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    const actualQuestions = questions.filter(
      (q): q is Extract<SurveyQuestion, { id: string }> => q.type !== "done"
    );
    const currentIndex = actualQuestions.findIndex((q) => q.id === questionId);

    if (currentIndex === actualQuestions.length - 1) {
      goDone(nextAnswers);
    } else {
      goNext();
    }
  };

  const handleTextNext = () => {
    if (!current || current.type !== "text") return;

    const trimmed = textValue.trim();
    const optional = current.optional ?? false;
    if (!optional && trimmed.length === 0) return;

    const nextAnswers = trimmed.length > 0 ? { ...answers, [current.id]: trimmed } : { ...answers };
    setAnswers(nextAnswers);

    const actualQuestions = questions.filter(
      (q): q is Extract<SurveyQuestion, { id: string }> => q.type !== "done"
    );
    const currentIndex = actualQuestions.findIndex((q) => q.id === current.id);

    if (currentIndex === actualQuestions.length - 1) {
      goDone(nextAnswers);
    } else {
      goNext();
    }
  };

  const handleSkipText = () => {
    if (!current || current.type !== "text") return;

    const nextAnswers = { ...answers };
    setAnswers(nextAnswers);

    const actualQuestions = questions.filter(
      (q): q is Extract<SurveyQuestion, { id: string }> => q.type !== "done"
    );
    const currentIndex = actualQuestions.findIndex((q) => q.id === current.id);

    if (currentIndex === actualQuestions.length - 1) {
      goDone(nextAnswers);
    } else {
      goNext();
    }
  };

  if (!isOpen) return null;

  if (showDone && doneQuestion && doneQuestion.type === "done") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-md rounded-2xl shadow-2xl p-8 bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100 border border-black/5 dark:border-white/10 animate-in zoom-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-500/15 flex items-center justify-center">
              <span className="text-3xl">💗</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-center mb-3">{doneQuestion.title}</h3>
          {doneQuestion.desc && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-6">
              {doneQuestion.desc}
            </p>
          )}
          <button
            onClick={() => {
              closeSafely();
            }}
            className="w-full rounded-xl px-4 py-3 font-semibold transition bg-pink-600 text-white hover:bg-pink-700"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl shadow-2xl p-6 bg-white dark:bg-neutral-950 border border-black/5 dark:border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">{surveyContent.title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">표시할 설문 문항이 없습니다.</p>
            </div>
            <button onClick={closeSafely} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={closeSafely} className="rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5">
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ done 타입이면서 showDone이 false인 경우는 넘어감 (위에서 이미 처리)
  if (current.type === "done") {
    return null;
  }

  const isTextOptional = current.type === "text" ? (current.optional ?? false) : false;
  const textMaxLength = current.type === "text" ? (current.maxLength ?? 200) : 200;
  const textPlaceholder = current.type === "text" ? (current.placeholder ?? "") : "";

  const actualQuestionCount = questions.filter((q) => q.type !== "done").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-6 bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100 border border-black/5 dark:border-white/10 animate-in zoom-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200">
                <span className="font-bold text-sm">
                  {step}/{actualQuestionCount}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-bold truncate">{surveyContent.title}</h3>
                {surveyContent.subtitle && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {surveyContent.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={closeSafely}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
            aria-label="닫기"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full overflow-hidden mb-6 bg-gray-100 dark:bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / actualQuestionCount) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-5">
          <p className="font-medium text-base leading-relaxed">
            {current.question}
          </p>
        </div>

        {/* single */}
        {current.type === "single" && (
          <div className="space-y-3">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(current.id, option)}
                className="w-full text-left px-5 py-4 rounded-xl border-2 transition-all group border-gray-100 hover:border-pink-300 hover:bg-pink-50 dark:border-white/10 dark:hover:border-pink-400/40 dark:hover:bg-pink-500/10"
              >
                <span className="font-medium text-gray-700 group-hover:text-pink-700 dark:text-gray-200 dark:group-hover:text-pink-200">
                  {option}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* text */}
        {current.type === "text" && (
          <div className="space-y-3">
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={textPlaceholder}
              maxLength={textMaxLength}
              rows={4}
              className="w-full rounded-xl border p-4 text-sm leading-relaxed resize-none border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40 dark:border-white/10 dark:bg-neutral-900/40 dark:text-gray-100 dark:placeholder:text-gray-500"
            />

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{isTextOptional ? "선택 입력" : "입력 필요"}</span>
              <span>
                {textValue.length}/{textMaxLength}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleTextNext}
                className="flex-1 rounded-xl px-4 py-3 font-semibold transition bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isTextOptional && textValue.trim().length === 0}
              >
                다음
              </button>

              {isTextOptional && (
                <button
                  type="button"
                  onClick={handleSkipText}
                  className="rounded-xl px-4 py-3 font-medium transition border border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  건너뛰기
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-40"
            disabled={step === 1}
          >
            이전
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            {surveyContent.footer}
          </p>

          <button
            type="button"
            onClick={closeSafely}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}