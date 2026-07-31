import { useId, type ReactNode } from "react";

type EditorPreviewLayoutProps = {
  children: ReactNode;
  renderPreview: (titleId: string) => ReactNode;
};

export function EditorPreviewLayout({
  children,
  renderPreview,
}: EditorPreviewLayoutProps) {
  const mobileTitleId = useId();
  const desktopTitleId = useId();

  return (
    <div className="admin-editor__layout">
      <div className="admin-editor__content">
        {children}
        <details className="admin-editor__mobile-preview">
          <summary>Ver vista previa</summary>
          {renderPreview(mobileTitleId)}
        </details>
      </div>
      <div className="admin-editor__desktop-preview">
        {renderPreview(desktopTitleId)}
      </div>
    </div>
  );
}
