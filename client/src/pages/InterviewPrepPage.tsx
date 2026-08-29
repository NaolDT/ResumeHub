import React, { useState } from 'react';
import { apiGetInterviewQuestions, InterviewQuestion } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Loader2, ArrowRight, ArrowLeft, RefreshCw, Eye } from 'lucide-react';

export const InterviewPrepPage: React.FC = () => {
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data: questionsResponse, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['interview-questions', topicFilter],
    queryFn: () => apiGetInterviewQuestions(topicFilter || undefined),
  });

  const questions = questionsResponse?.data ?? [];
  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const shuffleQuestions = () => {
    refetch();
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand" />
            Interview Preparation
          </h1>
          <p className="text-muted mt-1 text-sm">
            Practice common interview questions. Click the card to reveal the suggested answer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setCurrentIndex(0);
              setShowAnswer(false);
            }}
            className="bg-canvas border border-line rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Topics</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>
          <button
            onClick={shuffleQuestions}
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors"
            title="Reload/Shuffle"
          >
            <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin text-brand' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px] text-muted gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <span>Loading questions...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-2 rounded-2xl flex flex-col items-center justify-center text-muted">
          <BookOpen className="h-10 w-10 mb-3 opacity-30" />
          <p>No questions found for this topic.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm font-semibold text-muted">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-brand/10 text-brand text-xs uppercase tracking-wider">
              {currentQuestion.topic}
            </span>
          </div>

          <div
            onClick={() => setShowAnswer(!showAnswer)}
            className="relative glass-card border border-line rounded-2xl p-8 min-h-[300px] flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg transition-all group bg-surface"
          >
            {!showAnswer ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-ink leading-relaxed max-w-2xl">
                  {currentQuestion.question}
                </h2>
                <div className="flex items-center justify-center gap-2 text-brand text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-4">
                  <Eye className="h-4 w-4" />
                  Click to reveal answer
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full text-left">
                <p className="text-sm font-bold text-brand uppercase tracking-wider mb-2 border-b border-line pb-2">
                  Suggested Answer
                </p>
                <p className="text-lg text-ink leading-relaxed">
                  {currentQuestion.answer}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-ink bg-canvas border border-line hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

