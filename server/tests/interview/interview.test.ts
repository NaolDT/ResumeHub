import { describe, it, expect } from 'vitest';
import { InterviewService } from '../../src/services/interview.service.js';

describe('InterviewService', () => {
  it('returns all questions when no topic filter is given', async () => {
    const questions = await InterviewService.getQuestions();
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
  });

  it('each question has id, topic, question, and answer fields', async () => {
    const questions = await InterviewService.getQuestions();
    for (const q of questions) {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('topic');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('answer');
    }
  });

  it('filters questions by topic (case-insensitive)', async () => {
    const behavioral = await InterviewService.getQuestions('behavioral');
    expect(behavioral.length).toBeGreaterThan(0);
    for (const q of behavioral) {
      expect(q.topic.toLowerCase()).toBe('behavioral');
    }
  });

  it('returns empty array for a non-existent topic', async () => {
    const result = await InterviewService.getQuestions('nonexistent_topic_xyz');
    expect(result).toEqual([]);
  });

  it('filters frontend questions correctly', async () => {
    const frontend = await InterviewService.getQuestions('Frontend');
    // All returned questions must be Frontend
    for (const q of frontend) {
      expect(q.topic.toLowerCase()).toBe('frontend');
    }
  });
});
