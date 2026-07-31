import type { DesignEditorDraft } from "../../model/design-editor-model";

type DesignEditorPreviewProps = {
  draft: DesignEditorDraft;
  imageUrl?: string | null;
  imageAlt?: string;
  titleId: string;
};

function formatExtra(value: string) {
  const extra = Number(value);

  if (!Number.isFinite(extra) || extra <= 0) return "Sin extra";

  return `+ ${new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(extra)}`;
}

export function DesignEditorPreview({
  draft,
  imageUrl,
  imageAlt,
  titleId,
}: DesignEditorPreviewProps) {
  const statusLabel = {
    draft: "Borrador",
    active: "Activo",
    archived: "Archivado",
  }[draft.status];

  return (
    <aside className="admin-editor-preview" aria-labelledby={titleId}>
      <div className="admin-editor-preview__head">
        <span className="eyebrow">Vista previa</span>
        <h2 id={titleId}>Así se reconoce el diseño</h2>
        <p>Una referencia del contenido, no una copia exacta de la tienda.</p>
      </div>
      <div className="admin-editor-preview__card">
        <div
          aria-label={imageAlt || draft.name || "Imagen del diseño"}
          className="admin-editor-preview__media admin-editor-preview__media--design"
          role={imageUrl ? "img" : undefined}
          style={
            imageUrl
              ? { backgroundImage: `url("${imageUrl}")` }
              : undefined
          }
        >
          {!imageUrl ? <span>Imagen pendiente</span> : null}
        </div>
        <div className="admin-editor-preview__body">
          <span className="admin-editor-preview__status">{statusLabel}</span>
          <h3>{draft.name.trim() || "Nombre del diseño"}</h3>
          <p>{draft.summary.trim() || "El resumen aparecerá acá."}</p>
          <strong>{formatExtra(draft.baseExtraPrice)}</strong>
          {draft.description.trim() ? (
            <p className="admin-editor-preview__description">
              {draft.description}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
