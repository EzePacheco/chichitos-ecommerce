// Chichitos Store — Checkout page

const Checkout = ({ items, navigate }) => {
  const [step, setStep] = useState(1); // 1 datos, 2 entrega, 3 pago
  const [method, setMethod] = useState('envio'); // envio | retiro
  const [distance, setDistance] = useState(2.5); // km
  const [done, setDone] = useState(false);

  // Tarifa: hasta 3km $2500 fijo, después $400 cada 0.5km adicional
  const shippingCost = method === 'retiro' ? 0
    : distance <= 3 ? 2500
    : 2500 + Math.ceil((distance - 3) / 0.5) * 400;

  const subtotal = items.reduce((a, it) => a + it.unitPrice * it.qty, 0);
  const total = subtotal + shippingCost;

  if (done) {
    return (
      <main className="app__main">
        <section className="checkout">
          <div className="container" style={{ maxWidth: 640 }}>
            <div style={{ textAlign: 'center', padding: 'var(--sp-12) 0' }}>
              <div style={{ width: 100, height: 100, margin: '0 auto var(--sp-6)', borderRadius: 'var(--r-blob)', background: 'var(--salvia)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Icon name="check" size={48} strokeWidth={2.5} />
              </div>
              <Eyebrow>Compra confirmada</Eyebrow>
              <h1 className="display-l" style={{ margin: '8px 0 12px' }}>¡Gracias!</h1>
              <p style={{ color: 'var(--ink-500)', maxWidth: '44ch', margin: '0 auto var(--sp-6)' }}>
                Te mandamos un mail con los detalles. Empezamos a imprimir mañana y en 5-7 días hábiles está listo. Te avisamos por WhatsApp cuando salga el despacho.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={() => navigate('home')}>Volver al inicio</Button>
                <Button variant="ghost" as="a" href="https://wa.me/5491100000000">Escribirnos</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app__main">
      <section className="checkout">
        <div className="container">
          <Eyebrow>Estás a un paso</Eyebrow>
          <h1 className="display-l" style={{ margin: '8px 0 32px' }}>Finalizar compra</h1>

          <div className="checkout__steps">
            {[
              { n: 1, label: 'Tus datos' },
              { n: 2, label: 'Entrega' },
              { n: 3, label: 'Pago' },
            ].map(s => (
              <div key={s.n} className={`checkout-step ${step === s.n ? 'is-active' : ''} ${step > s.n ? 'is-done' : ''}`}>
                <span className="checkout-step__num">{step > s.n ? <Icon name="check" size={14}/> : s.n}</span>
                <span className="checkout-step__label">{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--sp-8)' }} className="checkout__grid">
            <style>{`
              @media (min-width: 900px) {
                .checkout__grid { grid-template-columns: 1.6fr 1fr !important; gap: var(--sp-12) !important; }
              }
            `}</style>

            <div>
              {step === 1 && (
                <div className="card" style={{ padding: 'var(--sp-6)' }}>
                  <h3 style={{ margin: '0 0 var(--sp-4)' }}>Tus datos</h3>
                  <div className="field-grid">
                    <div className="field"><label>Nombre</label><input className="input" defaultValue="Camila" /></div>
                    <div className="field"><label>Apellido</label><input className="input" defaultValue="Reyes" /></div>
                  </div>
                  <div className="field"><label>Email</label><input className="input" type="email" defaultValue="camila@correo.com" /></div>
                  <div className="field-grid">
                    <div className="field"><label>Teléfono</label><input className="input" defaultValue="+54 11 4444 0000" /></div>
                    <div className="field"><label>DNI</label><input className="input" defaultValue="38.000.000" /></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" iconRight="chevronR" onClick={() => setStep(2)}>Continuar</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="card" style={{ padding: 'var(--sp-6)' }}>
                  <h3 style={{ margin: '0 0 var(--sp-4)' }}>¿Cómo lo recibís?</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    <div className={`radio-card ${method === 'envio' ? 'is-active' : ''}`} onClick={() => setMethod('envio')}>
                      <span className="radio-card__dot" />
                      <div style={{ flex: 1 }}>
                        <h4 className="radio-card__title">Envío a domicilio</h4>
                        <p className="radio-card__sub">CABA y GBA. Tarifa según distancia desde el taller.</p>
                      </div>
                      <strong>${method === 'envio' ? shippingCost.toLocaleString('es-AR') : '—'}</strong>
                    </div>
                    <div className={`radio-card ${method === 'retiro' ? 'is-active' : ''}`} onClick={() => setMethod('retiro')}>
                      <span className="radio-card__dot" />
                      <div style={{ flex: 1 }}>
                        <h4 className="radio-card__title">Retiro en el taller</h4>
                        <p className="radio-card__sub">Villa Crespo, CABA. Lun a vie de 14 a 19.</p>
                      </div>
                      <strong style={{ color: 'var(--salvia-d)' }}>Sin cargo</strong>
                    </div>
                  </div>

                  {method === 'envio' && (
                    <div style={{ marginTop: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--cream-100)', borderRadius: 'var(--r-lg)' }}>
                      <div className="field"><label>Dirección</label><input className="input" defaultValue="Av. Corrientes 1234" /></div>
                      <div className="field-grid">
                        <div className="field"><label>Ciudad</label><input className="input" defaultValue="CABA" /></div>
                        <div className="field"><label>Código postal</label><input className="input" defaultValue="1414" /></div>
                      </div>
                      <div className="field">
                        <label>Distancia desde el taller: <strong>{distance.toFixed(1)} km</strong></label>
                        <input type="range" min="0.5" max="15" step="0.5" value={distance} onChange={e => setDistance(parseFloat(e.target.value))} style={{ width: '100%' }} />
                        <small style={{ color: 'var(--ink-500)', marginTop: 4 }}>
                          Hasta 3 km: $2.500 fijo. Después, $400 cada 0,5 km adicional.
                        </small>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-6)' }}>
                    <Button variant="ghost" icon="chevronL" onClick={() => setStep(1)}>Volver</Button>
                    <Button variant="primary" iconRight="chevronR" onClick={() => setStep(3)}>Continuar al pago</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="card" style={{ padding: 'var(--sp-6)' }}>
                  <h3 style={{ margin: '0 0 var(--sp-4)' }}>Pago</h3>
                  <div className="radio-card is-active" style={{ cursor: 'default' }}>
                    <span className="radio-card__dot" />
                    <div style={{ flex: 1 }}>
                      <h4 className="radio-card__title">Mercado Pago</h4>
                      <p className="radio-card__sub">Tarjeta, débito, efectivo o cuenta MP. Hasta 12 cuotas.</p>
                    </div>
                    <svg viewBox="0 0 36 24" width="48" height="32" aria-hidden="true">
                      <rect width="36" height="24" rx="4" fill="#00B1EA" />
                      <text x="18" y="16" textAnchor="middle" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="700">MP</text>
                    </svg>
                  </div>
                  <p style={{ color: 'var(--ink-500)', fontSize: 'var(--fs-body-sm)', marginTop: 'var(--sp-6)' }}>
                    Al confirmar te redirigimos a Mercado Pago. Volvés a Chichitos al terminar.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-6)' }}>
                    <Button variant="ghost" icon="chevronL" onClick={() => setStep(2)}>Volver</Button>
                    <Button variant="primary" icon="card" onClick={() => setDone(true)}>Pagar ${total.toLocaleString('es-AR')}</Button>
                  </div>
                </div>
              )}
            </div>

            <aside>
              <div className="summary">
                <h3>Tu pedido</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 56, height: 56, background: 'var(--surface)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <GarmentPlaceholder type={it.type} color={it.colorHex} designShape={it.designShape} designColor={it.designColor} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                        <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-500)' }}>{it.size} · {it.designName} · ×{it.qty}</div>
                      </div>
                      <div style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 600 }}>${(it.unitPrice * it.qty).toLocaleString('es-AR')}</div>
                    </div>
                  ))}
                </div>
                <div className="summary__row"><span>Subtotal</span><span>${subtotal.toLocaleString('es-AR')}</span></div>
                <div className="summary__row"><span>{method === 'retiro' ? 'Retiro' : 'Envío'}</span><span>{shippingCost === 0 ? 'Sin cargo' : `$${shippingCost.toLocaleString('es-AR')}`}</span></div>
                <div className="summary__row summary__row--total"><span>Total</span><span>${total.toLocaleString('es-AR')}</span></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

window.Checkout = Checkout;
