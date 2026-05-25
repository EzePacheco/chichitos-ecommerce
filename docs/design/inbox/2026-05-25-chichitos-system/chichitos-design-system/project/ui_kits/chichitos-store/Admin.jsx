// Chichitos Store — Admin dashboard

const Admin = ({ navigate }) => {
  const { ORDERS, PRODUCTS, DESIGNS } = window.CHICHITOS_DATA;
  const [page, setPage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'orders',    label: 'Pedidos',   icon: 'package' },
    { id: 'products',  label: 'Productos', icon: 'store' },
    { id: 'designs',   label: 'Diseños',   icon: 'layers' },
    { id: 'settings',  label: 'Configuración', icon: 'settings' },
  ];

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <Logo variant="white" height={32} />
        </div>
        <nav className="admin__nav">
          {navItems.map(n => (
            <a key={n.id} href="#" onClick={(e) => { e.preventDefault(); setPage(n.id); }} className={page === n.id ? 'active' : ''}>
              <Icon name={n.icon} size={18} /> {n.label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="soft" size="sm" icon="chevronL" onClick={() => navigate('home')}>Volver a la tienda</Button>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--r-pill)', background: 'var(--durazno)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--ink-900)' }}>L</div>
            <div style={{ fontSize: 'var(--fs-caption)' }}>
              <div style={{ color: 'var(--cream-50)', fontWeight: 600 }}>Laura</div>
              <div style={{ color: 'var(--cream-300)' }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin__main">
        {page === 'dashboard' && <AdminDashboard orders={ORDERS} setPage={setPage} />}
        {page === 'orders' && <AdminOrders orders={ORDERS} />}
        {page === 'products' && <AdminProducts products={PRODUCTS} />}
        {page === 'designs' && <AdminDesigns designs={DESIGNS} />}
        {page === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

const AdminDashboard = ({ orders, setPage }) => (
  <>
    <div className="admin__head">
      <div>
        <Eyebrow>Hola Laura</Eyebrow>
        <h1>Buen lunes ✨</h1>
      </div>
      <Button variant="primary" icon="plus">Nuevo producto</Button>
    </div>

    <div className="stats">
      <div className="stat"><div className="stat__label">Pedidos esta semana</div><div className="stat__value">23</div><div className="stat__delta">+18% vs anterior</div></div>
      <div className="stat"><div className="stat__label">Ingresos</div><div className="stat__value">$486k</div><div className="stat__delta">+22%</div></div>
      <div className="stat"><div className="stat__label">En producción</div><div className="stat__value">7</div><div className="stat__delta">2 listos hoy</div></div>
      <div className="stat"><div className="stat__label">A despachar</div><div className="stat__value">4</div><div className="stat__delta stat__delta--down">1 atrasado</div></div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }} className="admin__row">
      <style>{`@media (max-width: 1000px) { .admin__row { grid-template-columns: 1fr !important; } }`}</style>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Últimos pedidos</h3>
          <button onClick={() => setPage('orders')} className="option-group__link">Ver todos →</button>
        </div>
        <AdminOrdersTable orders={orders.slice(0, 6)} />
      </div>
      <div>
        <h3 style={{ marginTop: 0 }}>Cola de impresión</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.filter(o => o.status === 'prod' || o.status === 'new').slice(0, 4).map(o => (
            <div key={o.id} className="card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{o.id}</div>
                <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-500)' }}>{o.customer} · {o.items} prenda{o.items === 1 ? '' : 's'}</div>
              </div>
              <OrderStatusBadge status={o.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const AdminOrdersTable = ({ orders }) => (
  <table className="table">
    <thead>
      <tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th></th></tr>
    </thead>
    <tbody>
      {orders.map(o => (
        <tr key={o.id}>
          <td><strong>{o.id}</strong></td>
          <td>{o.customer}</td>
          <td>{o.date}</td>
          <td>${o.total.toLocaleString('es-AR')}</td>
          <td><OrderStatusBadge status={o.status} /></td>
          <td><button className="option-group__link">Ver →</button></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AdminOrders = ({ orders }) => {
  const [filter, setFilter] = useState('todos');
  const states = [
    { k: 'todos', l: 'Todos' },
    { k: 'new', l: 'Nuevos' },
    { k: 'prod', l: 'En producción' },
    { k: 'ready', l: 'Listos' },
    { k: 'shipped', l: 'Enviados' },
    { k: 'done', l: 'Completados' },
    { k: 'cancelled', l: 'Cancelados' },
  ];
  const filtered = filter === 'todos' ? orders : orders.filter(o => o.status === filter);

  return (
    <>
      <div className="admin__head">
        <div>
          <Eyebrow>Pedidos</Eyebrow>
          <h1>Todos los pedidos</h1>
        </div>
        <Button variant="ghost" icon="download">Exportar CSV</Button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {states.map(s => (
          <button key={s.k} className={`chip ${filter === s.k ? 'is-active' : ''}`} onClick={() => setFilter(s.k)}>{s.l}</button>
        ))}
      </div>
      <AdminOrdersTable orders={filtered} />
    </>
  );
};

const AdminProducts = ({ products }) => {
  const { PALETTES, DESIGNS } = window.CHICHITOS_DATA;
  return (
    <>
      <div className="admin__head">
        <div>
          <Eyebrow>Catálogo</Eyebrow>
          <h1>Productos</h1>
        </div>
        <Button variant="primary" icon="plus">Nuevo producto</Button>
      </div>
      <table className="table">
        <thead><tr><th></th><th>Nombre</th><th>Tipo</th><th>Precio</th><th>Talles</th><th>Colores</th><th>Diseños</th><th></th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={{ width: 48 }}>
                <div style={{ width: 40, height: 40, background: 'var(--cream-200)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GarmentPlaceholder type={p.type} color={PALETTES[p.baseColors[0]]} designShape={DESIGNS.find(d => d.id === p.designs[0])?.shape} designColor={DESIGNS.find(d => d.id === p.designs[0])?.color} />
                </div>
              </td>
              <td><strong>{p.name}</strong></td>
              <td>{p.type}</td>
              <td>${p.price.toLocaleString('es-AR')}</td>
              <td>{p.sizes.length}</td>
              <td>{p.baseColors.length}</td>
              <td>{p.designs.length}</td>
              <td><button className="icon-btn" aria-label="Editar"><Icon name="edit" size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const AdminDesigns = ({ designs }) => (
  <>
    <div className="admin__head">
      <div><Eyebrow>Diseños propios</Eyebrow><h1>Mis estampas</h1></div>
      <Button variant="primary" icon="plus">Subir diseño</Button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
      {designs.map(d => (
        <div key={d.id} className="card" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ aspectRatio: '1', background: 'var(--cream-100)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <DesignSvg shape={d.shape} color={d.color} />
          </div>
          <div style={{ fontWeight: 600 }}>{d.name}</div>
          <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-500)' }}>Usado en 5 productos</div>
        </div>
      ))}
    </div>
  </>
);

const AdminSettings = () => (
  <>
    <div className="admin__head">
      <div><Eyebrow>Configuración</Eyebrow><h1>Ajustes comerciales</h1></div>
    </div>
    <div style={{ display: 'grid', gap: 24, maxWidth: 720 }}>
      <div className="card" style={{ padding: 'var(--sp-6)' }}>
        <h3 style={{ margin: '0 0 16px' }}>Política de envíos</h3>
        <div className="field-grid">
          <div className="field"><label>Tarifa hasta 3 km</label><input className="input" defaultValue="2500" /></div>
          <div className="field"><label>Adicional cada 0,5 km</label><input className="input" defaultValue="400" /></div>
        </div>
        <div className="field"><label>Zona de cobertura</label><input className="input" defaultValue="CABA y GBA hasta 15km del taller" /></div>
      </div>
      <div className="card" style={{ padding: 'var(--sp-6)' }}>
        <h3 style={{ margin: '0 0 16px' }}>Cambios y devoluciones</h3>
        <div className="field">
          <label>Política visible al cliente</label>
          <textarea className="textarea" rows="6" defaultValue="Aceptamos cambios dentro de los 15 días corridos desde la entrega, siempre que la prenda no haya sido usada ni lavada. Por ser productos personalizados, las prendas con nombre no admiten devolución salvo defecto de fábrica."></textarea>
        </div>
      </div>
      <div className="card" style={{ padding: 'var(--sp-6)' }}>
        <h3 style={{ margin: '0 0 16px' }}>Tiempos de producción</h3>
        <div className="field-grid">
          <div className="field"><label>Tiempo mínimo (días hábiles)</label><input className="input" defaultValue="5" /></div>
          <div className="field"><label>Tiempo máximo (días hábiles)</label><input className="input" defaultValue="7" /></div>
        </div>
      </div>
      <Button variant="primary">Guardar cambios</Button>
    </div>
  </>
);

window.Admin = Admin;
