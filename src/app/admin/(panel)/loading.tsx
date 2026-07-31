export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando panel" className="admin-loading">
      <div className="admin-loading__title" />
      <div className="admin-loading__stats">
        <div />
        <div />
        <div />
      </div>
      <div className="admin-loading__content" />
    </div>
  );
}
