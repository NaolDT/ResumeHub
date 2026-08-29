import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface InterviewQuestion {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

export class InterviewService {
  /**
   * Retrieves interview questions, optionally filtered by topic.
   */
  static async getQuestions(topic?: string): Promise<InterviewQuestion[]> {
    const dataPath = path.join(__dirname, '../data/questions.json');
    
    // In a real DB setup this would query the DB. 
    // Here we read the static JSON file.
    let questions: InterviewQuestion[] = [];
    try {
      const fileData = await fs.promises.readFile(dataPath, 'utf-8');
      questions = JSON.parse(fileData) as InterviewQuestion[];
    } catch (error) {
      console.error('Error reading questions data:', error);
      return [];
    }

    if (topic) {
      return questions.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
    }
    
    return questions;
  }
}

