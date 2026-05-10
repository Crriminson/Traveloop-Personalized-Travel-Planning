const { z } = require('zod');

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
    category: z.string().optional()
  })
});

const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1)
  })
});

module.exports = { createPostSchema, createCommentSchema };
