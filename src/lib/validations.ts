import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	name: z.string().optional(),
});

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password required'),
});

// Wager schemas
export const createWagerSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters').max(200),
	description: z.string().max(2000).optional(),
	stakeAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
	stakeCurrency: z.string().default('USD'),
	participants: z.array(z.string()).min(2, 'At least 2 participants required'),
	deadline: z.string().datetime().optional(),
});

export const updateWagerSchema = z.object({
	title: z.string().min(3).max(200).optional(),
	description: z.string().max(2000).optional(),
	deadline: z.string().datetime().optional(),
	status: z.enum(['CANCELLED']).optional(),
});

// Proof schema
export const submitProofSchema = z.object({
	link: z.string().url('Invalid URL'),
	evidence: z.string().optional(),
});

// Vote schema
export const voteSchema = z.object({
	isValid: z.boolean(),
	comment: z.string().max(500).optional(),
});

// Comment schema
export const commentSchema = z.object({
	content: z.string().min(1, 'Comment cannot be empty').max(2000),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateWagerInput = z.infer<typeof createWagerSchema>;
export type UpdateWagerInput = z.infer<typeof updateWagerSchema>;
export type SubmitProofInput = z.infer<typeof submitProofSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
