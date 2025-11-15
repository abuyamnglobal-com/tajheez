export const BRAND_COLORS = {
  NAVY: '#101F3B',
  ORANGE: '#FF8C00',
  BG_LIGHT: '#F7F8F9',
  STATUS: {
    APPROVED: '#10B981',
    SUBMITTED: '#FF8C00',
    REJECTED: '#EF4444',
    DRAFT: '#6B7280',
  },
} as const;

type StatusKey = keyof typeof BRAND_COLORS.STATUS;

export const resolveStatusColor = (status?: string) => {
  if (!status) return BRAND_COLORS.STATUS.DRAFT;
  const normalized = status.toUpperCase() as StatusKey;
  return BRAND_COLORS.STATUS[normalized] || BRAND_COLORS.STATUS.DRAFT;
};
