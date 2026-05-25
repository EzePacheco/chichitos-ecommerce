// Chichitos Store — Cart page

const Cart = ({ items, updateQty, removeItem, navigate }) => {
  const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0);
  const shipping = items.length > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="app__main">
        <section className="cart">
          <div className="container">
            <Eyebrow>Tu carrito</Eyebrow>
            <h1 className="display-l" style={{ margin: '8px 0 32px' }}>Carrito</h1>
            <EmptyState icon="bag" title="Tu carrito todavía no tiene nada"
              action={<Button variant="primary" icon="bag" onClick={() => navigate('catalog')}>Ir al catálogo</Button>}>
              Elegí una prenda, configurá el diseño y volvemos a vernos por acá.
            </EmptyState>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app__main">
      <section className="cart">
        <div className="container">
          <Eyebrow>Tu carrito</Eyebrow>
          <h1 className="display-l" style={{ margin: '8px 0 32px' }}>Carrito</h1>

          <div className="cart__layout">
            <div className="cart__items">
              {items.map((it, idx) => (
                <div key={idx} className="cart-line">
                  <div className="cart-line__media">
                    <GarmentPlaceholder type={it.type} color={it.colorHex} designShape={it.designShape} designColor={it.designColor} />
                  </div>
                  <div className="cart-line__body">
                    <h3 className="cart-line__title">{it.name}</h3>
                    <div className="cart-line__meta">
                      <span>Talle {it.size}</span>
                      <span>{capitalize(it.colorKey)}</span>
                      <span>Diseño: {it.designName}</span>
                      {it.personalName && <span>Nombre: {it.personalName}</span>}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Stepper value={it.qty} onChange={q => updateQty(idx, q)} />
                    </div>
                  </div>
                  <div className="cart-line__col-right">
                    <span className="cart-line__price">${(it.unitPrice * it.qty).toLocaleString('es-AR')}</span>
                    <button className="cart-line__remove" onClick={() => removeItem(idx)}>
                      <Icon name="trash" size={14} style={{ verticalAlign: -2 }} /> Quitar
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Button variant="ghost" icon="chevronL" onClick={() => navigate('catalog')}>Seguir comprando</Button>
              </div>
            </div>

            <aside>
              <div className="summary">
                <h3>Resumen</h3>
                <div className="summary__row"><span>Subtotal ({items.length} prenda{items.length === 1 ? '' : 's'})</span><span>${subtotal.toLocaleString('es-AR')}</span></div>
                <div className="summary__row"><span>Envío (estimado)</span><span>${shipping.toLocaleString('es-AR')}</span></div>
                <div className="summary__row summary__row--total"><span>Total</span><span>${total.toLocaleString('es-AR')}</span></div>
                <Button variant="primary" size="lg" iconRight="chevronR" onClick={() => navigate('checkout')}>Continuar al pago</Button>
                <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-500)', marginTop: 12, marginBottom: 0, textAlign: 'center' }}>
                  Pagás con Mercado Pago. Producción a pedido en 5-7 días.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

window.Cart = Cart;
