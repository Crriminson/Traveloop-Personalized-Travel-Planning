const { z } = require('zod');

const dateField = z.coerce.date({ invalid_type_error: 'Must be a valid date' });

const createStopSchema = z
  .object({
    cityId: z
      .string()
      .uuid({ message: 'cityId must be a valid UUID' }),

    startDate: dateField.optional(),

    endDate: dateField.optional(),

    notes: z
      .string()
      .max(500, { message: 'Notes must be at most 500 characters' })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) return data.endDate >= data.startDate;
      return true;
    },
    { message: 'End date must be on or after start date', path: ['endDate'] }
  );

const updateStopSchema = z
  .object({
    cityId: z
      .string()
      .uuid({ message: 'cityId must be a valid UUID' })
      .optional(),

    startDate: dateField.optional(),

    endDate: dateField.optional(),

    notes: z
      .string()
      .max(500, { message: 'Notes must be at most 500 characters' })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) return data.endDate >= data.startDate;
      return true;
    },
    { message: 'End date must be on or after start date', path: ['endDate'] }
  );

const reorderStopsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid({ message: 'Each stop id must be a valid UUID' }),
        orderIndex: z
          .number({ invalid_type_error: 'orderIndex must be a number' })
          .int({ message: 'orderIndex must be an integer' })
          .nonnegative({ message: 'orderIndex must be 0 or greater' }),
      })
    )
    .min(1, { message: 'items array must contain at least one entry' }),
});

module.exports = { createStopSchema, updateStopSchema, reorderStopsSchema };
