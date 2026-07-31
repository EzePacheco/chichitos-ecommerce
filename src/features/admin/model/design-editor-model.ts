export type EditableAdminDesign = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  status: "draft" | "active" | "archived";
  baseExtraPriceCents: number;
  imageUrl: string | null;
  imageAlt: string;
};

export type DesignEditorDraft = {
  name: string;
  summary: string;
  description: string;
  status: EditableAdminDesign["status"];
  baseExtraPrice: string;
};

export function createDesignEditorDraft(
  design?: EditableAdminDesign | null,
): DesignEditorDraft {
  return {
    name: design?.name ?? "",
    summary: design?.summary ?? "",
    description: design?.description ?? "",
    status: design?.status ?? "draft",
    baseExtraPrice: design
      ? String(Math.round(design.baseExtraPriceCents / 100))
      : "0",
  };
}
