import type { ProductEditorDraft } from "../ProductEditor";

type ProductEditorPreviewProps = {
  draft: ProductEditorDraft;
  imageUrl?: string | null;
};

function formatDraftPrice(value: string) {
  const price = Number(value);

  return Number.isFinite(price) && price > 0
    ? new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(price)
    : "Precio pendiente";
}

export function ProductEditorPreview({
  draft,
  imageUrl,
}: ProductEditorPreviewProps) {
  const firstColor = draft.variants.colors[0];

  return (
    <aside className="admin-editor-preview" aria-labelledby="product-preview-title">
      <div className="admin-editor-preview__head">
        <span className="eyebrow">Vista previa</span>
        <h2 id="product-preview-title">Así se reconoce el producto</h2>
        <p>Es una referencia rápida; la tienda puede ordenar el contenido distinto.</p>
      </div>
      <div className="admin-editor-preview__card">
        <div
          className="admin-editor-preview__media"
          style={
            imageUrl
              ? { backgroundImage: `url("${imageUrl}")` }
              : { backgroundColor: firstColor?.hex || "var(--cream-100)" }
          }
        >
          {!imageUrl ? (
            <span>{firstColor?.name || "Imagen pendiente"}</span>
          ) : null}
        </div>
        <div className="admin-editor-preview__body">
          <span className="admin-editor-preview__status">
            {draft.status === "active" ? "Activo" : "Borrador"}
            {draft.featured ? " · Destacado" : ""}
          </span>
          <h3>{draft.name.trim() || "Nombre del producto"}</h3>
          <p>{draft.summary.trim() || "El resumen aparecerá acá."}</p>
          <strong>{formatDraftPrice(draft.basePrice)}</strong>
          <dl className="admin-editor-preview__facts">
            <div>
              <dt>Talles</dt>
              <dd>{draft.variants.sizes.length}</dd>
            </div>
            <div>
              <dt>Colores</dt>
              <dd>{draft.variants.colors.length}</dd>
            </div>
            <div>
              <dt>Diseños</dt>
              <dd>{draft.variants.designs.length}</dd>
            </div>
          </dl>
          {draft.personalizationEnabled ? (
            <span className="admin-editor-preview__tag">
              Personalizable
            </span>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
