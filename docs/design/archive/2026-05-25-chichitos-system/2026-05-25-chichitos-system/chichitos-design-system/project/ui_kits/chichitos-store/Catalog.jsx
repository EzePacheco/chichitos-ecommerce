// Chichitos Store — Catalog page

const Catalog = ({ openProduct }) => {
  const { PRODUCTS } = window.CHICHITOS_DATA;
  const [typeFilter, setTypeFilter] = useState('Todo');
  const [sizeFilter, setSizeFilter] = useState(null);
  const [colorFilter, setColorFilter] = useState(null);
  const [customOnly, setCustomOnly] = useState(false);

  const types = ['Todo', 'Remera', 'Buzo', 'Body', 'Pantalón', 'Campera', 'Accesorio'];
  const sizes = ['0-12m', '2', '4', '6', '8', '10', '12'];
  const colorOpts = [
    { key: 'cream',   label: 'Crema',   hex: '#F7EFE0' },
    { key: 'blanco',  label: 'Blanco',  hex: '#FCF7EC' },
    { key: 'durazno', label: 'Durazno', hex: '#F5C9A8' },
    { key: 'salvia',  label: 'Salvia',  hex: '#B4C9A4' },
    { key: 'celeste', label: 'Celeste', hex: '#B7D2E6' },
    { key: 'coral',   label: 'Coral',   hex: '#E08868' },
    { key: 'mostaza', label: 'Mostaza', hex: '#E4B254' },
    { key: 'rosa',    label: 'Rosa',    hex: '#F2B9B9' },
  ];

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (typeFilter !== 'Todo' && p.type !== typeFilter) return false;
    if (sizeFilter && !p.sizes.some(s => s === sizeFilter || (sizeFilter === '0-12m' && s.includes('m')))) return false;
    if (colorFilter && !p.baseColors.includes(colorFilter)) return false;
    if (customOnly && !p.customizable) return false;
    return true;
  }), [typeFilter, sizeFilter, colorFilter, customOnly]);

  return (
    <main className="app__main">
      <section className="catalog">
        <div className="container">
          <div style={{ marginBottom: 'var(--sp-8)' }}>
            <Eyebrow>Catálogo completo</Eyebrow>
            <h1 className="display-l" style={{ margin: '8px 0 0' }}>Todas las prendas</h1>
          </div>

          <div className="catalog__layout">
            <aside className="filters" aria-label="Filtros">
              <div className="filter-group">
                <h4>Prenda</h4>
                <div className="filter-row">
                  {types.map(t => (
                    <button key={t} className={`chip ${typeFilter === t ? 'is-active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Talle</h4>
                <div className="filter-row">
                  {sizes.map(s => (
                    <button key={s} className={`chip ${sizeFilter === s ? 'is-active' : ''}`} onClick={() => setSizeFilter(sizeFilter === s ? null : s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Color base</h4>
                <div className="filter-row" style={{ gap: 10 }}>
                  {colorOpts.map(c => (
                    <button
                      key={c.key}
                      className={`swatch ${colorFilter === c.key ? 'is-active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setColorFilter(colorFilter === c.key ? null : c.key)}
                      aria-label={c.label}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Diseño</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--fs-body-sm)' }}>
                  <input type="checkbox" checked={customOnly} onChange={e => setCustomOnly(e.target.checked)} />
                  Sólo personalizables
                </label>
              </div>
              {(typeFilter !== 'Todo' || sizeFilter || colorFilter || customOnly) && (
                <button
                  className="chip chip--dashed"
                  onClick={() => { setTypeFilter('Todo'); setSizeFilter(null); setColorFilter(null); setCustomOnly(false); }}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Icon name="x" size={14} /> Limpiar filtros
                </button>
              )}
            </aside>

            <div>
              <div className="catalog__toolbar">
                <span className="catalog__count">{filtered.length} prendas</span>
                <select className="select" style={{ maxWidth: 200 }} defaultValue="featured">
                  <option value="featured">Destacados primero</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="newest">Lo más nuevo</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <EmptyState icon="search" title="No encontramos nada con esos filtros"
                  action={<Button variant="ghost" onClick={() => { setTypeFilter('Todo'); setSizeFilter(null); setColorFilter(null); setCustomOnly(false); }}>Limpiar filtros</Button>}>
                  Probá quitando alguno o escribinos por WhatsApp y vemos juntos.
                </EmptyState>
              ) : (
                <div className="product-grid">
                  {filtered.map(p => <ProductCard key={p.id} product={p} onOpen={openProduct} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

window.Catalog = Catalog;
