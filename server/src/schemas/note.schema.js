const { z } = require('zod');

const createNoteSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    stopId: z.string().uuid().optional(),
    title: z.string().optional(),
    content: z.string().min(1)
  })
});

const updateNoteSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().optional(),
    content: z.string().min(1).optional()
  })
});

module.exports = { createNoteSchema, updateNoteSchema };
