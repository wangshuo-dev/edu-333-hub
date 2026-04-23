export type ChapterContent = {
  subjectSlug: string;
  chapterSlug: string;
  summary?: string;
  sections: {
    slug: string;
    title: string;
    keyPoints: {
      title: string;
      body: string;
      importance: "high" | "mid" | "low";
      frequencyTag?: "高频" | "真题" | "易错";
      orderIdx: number;
    }[];
  }[];
  questions: {
    type: "mcq" | "fill" | "short" | "essay";
    stem: string;
    options?: string[];
    answer: string;
    explanation?: string;
    yearTag?: string;
    orderIdx: number;
  }[];
};
