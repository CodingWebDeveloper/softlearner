export const DATABASE_ERROR_CODES = {
  UNIQUE_VIOLATION: "23505",
  NOT_FOUND: "PGRST116",
};

export const RESOURCE_TYPES = {
  VIDEO: "video",
  DOWNLOADABLE_FILE: "downloadable file",
} as const;

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];
