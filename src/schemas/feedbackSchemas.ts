import { z } from "zod";

export const feedbackSchema = z.object({
  tutorialId: z.string(),
  userId: z.string().optional(),
  interaction: z.enum(["like", "dislike", "null"]),
  feedbackType: z.string().optional(),
  comment: z.string().optional(),
  createdAt: z.date()
});

export type FeedbackData = z.infer<typeof feedbackSchema>;