import { z } from 'zod';

export const intervalSchema = z.enum(['1', '3', '5', '15', '30', '60', '120', '180', '240', 'D', 'W']);
export type IntervalOption = z.infer<typeof intervalSchema>;

export const rangeSchema = z.enum(['1D', '5D', '1M', '3M', '6M', 'YTD', '12M', '60M', 'ALL']);
export type RangeOption = z.infer<typeof rangeSchema>;

export const symbolSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string().min(1, { message: '종목 이름을 입력해주세요' }),
  code: z.string().min(1, { message: '종목 코드를 입력해주세요' }),
});
export type SymbolOption = z.infer<typeof symbolSchema>;

export const chartItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string().min(1, { message: '차트 이름을 입력해주세요' }),
});
export type ChartItem = z.infer<typeof chartItemSchema>;

export const filterOptionSchema = z.object({
  value: z.union([z.string(), z.number()]), // ID 또는 코드값
  label: z.string(), // 표시 레이블
});
export type FilterOption = z.infer<typeof filterOptionSchema>;
