import type { BaseApi } from "~/api/objects/base";

export const inheritFields = <T extends BaseApi>(
  model: T,
  prefix: string
): string[] => {
  return model.getFields().map((field) => `${prefix}.${field}`);
};
