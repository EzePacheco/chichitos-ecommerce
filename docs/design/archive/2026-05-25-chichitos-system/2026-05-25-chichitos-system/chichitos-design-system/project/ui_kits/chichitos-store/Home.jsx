// Chichitos Store — Home page

const Home = ({ navigate, openProduct }) => {
  const { PRODUCTS, PALETTES, DESIGNS } = window.CHICHITOS_DATA;
  const featured = PRODUCTS.slice(0, 4);

  const STEPS = [
    { n: '01', title: 'Elegí la prenda', text: 'Remera, buzo, body o jogging. Mirá la guía de talles si dudás.' },
    { n: '02', title: 'Configurá', text: 'Talle, color base y diseño DTF. Sumá un nombre si querés personalizar.' },
    { n: '03', title: 'Pagás online', text: 'Con Mercado Pago, en cuotas o efectivo. Todo seguro.' },
    { n: '04', title: 'Recibís o retirás', text: 'Envío a domicilio con tarifa por distancia o retiro sin cargo en el taller.' },
  ];

  return (
    <main className="app__main">
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div>
              <div className="hero__eyebrow">
                <Eyebrow>Hecha para jugar, lista para soñar</Eyebrow>
              </div>
              <h1 className="display-xl hero__title">
                Ropa infantil con <span className="script">alma</span> de taller.
              </h1>
              <p className="hero__sub">
                Diseños propios, estampados a pedido en nuestro taller con tecnología DTF que dura lavado tras lavado. Elegí prenda, talle, color y diseño — o sumamos el nombre del chiquito.
              </p>
              <div className="hero__ctas">
                <Button variant="primary" size="lg" icon="bag" onClick={() => navigate('catalog')}>Comprar online</Button>
                <Button variant="ghost" size="lg" as="a" href="https://wa.me/5491100000000">Consultar por WhatsApp</Button>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-6)', marginTop: 'var(--sp-8)', flexWrap: 'wrap' }}>
                <div className="flex-row" style={{ gap: 10 }}>
                  <Icon name="truck" /><small>Envío a todo el país</small>
                </div>
                <div className="flex-row" style={{ gap: 10 }}>
                  <Icon name="card" /><small>Mercado Pago en cuotas</small>
                </div>
                <div className="flex-row" style={{ gap: 10 }}>
                  <Icon name="sparkles" /><small>Diseños de autoría propia</small>
                </div>
              </div>
            </div>
            <div className="hero__art" aria-hidden="true">
              <span className="hero__star hero__star--1">★</span>
              <span className="hero__star hero__star--2">✦</span>
              <span className="hero__star hero__star--3">★</span>
              <GarmentPlaceholder type="Remera" color={PALETTES.blanco} designShape="cloud" designColor={PALETTES.celeste} scale={1.4} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="section__head section__head--row">
            <div>
              <Eyebrow>Lo más querido</Eyebrow>
              <h2>Destacados de la semana</h2>
            </div>
            <Button variant="ghost" size="sm" iconRight="chevronR" onClick={() => navigate('catalog')}>
              Ver todo el catálogo
            </Button>
          </div>
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} onOpen={openProduct} />)}
          </div>
        </div>
      </section>

      {/* DTF BLOCK */}
      <section className="section section--alt">
        <div className="container">
          <div style={{ display: 'grid', gap: 'var(--sp-12)', gridTemplateColumns: '1fr', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-6)' }}>
              <div>
                <Eyebrow>Diseños propios</Eyebrow>
                <h2 style={{ marginTop: 8 }}>Cada estampa nace acá, en nuestro taller.</h2>
                <p style={{ color: 'var(--ink-500)', maxWidth: '50ch', marginTop: 12 }}>
                  No revendemos diseños de terceros. Cada nubecita, estrellita y cohete fue dibujado por nosotros y estampado a pedido con DTF — una técnica que mantiene los colores vivos por más de 50 lavados.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
                  <GarmentTag variant="dashed">Estampa a pedido</GarmentTag>
                  <GarmentTag variant="salvia">+50 lavados</GarmentTag>
                  <GarmentTag variant="celeste">Sin franquicias</GarmentTag>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-3)' }}>
                {DESIGNS.map(d => (
                  <div key={d.id} className="card" style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--r-md)', background: 'var(--surface)' }}>
                    <svg viewBox="-20 -20 40 40" width="56" height="56" style={{ color: d.color }} fill={d.color}>
                      {window.DESIGN_SHAPES_INLINE ? window.DESIGN_SHAPES_INLINE[d.shape] : null}
                      {(() => {
                        // Use the same shape map from components scope
                        const shapes = {
                          cloud:   <path d="M -14 4 Q -18 -2 -12 -4 Q -14 -12 -4 -10 Q 0 -16 8 -12 Q 16 -12 14 -4 Q 20 -2 16 6 Z" />,
                          star:    <polygon points="0,-14 4,-4 14,-3 6,4 8,14 0,9 -8,14 -6,4 -14,-3 -4,-4" />,
                          sun:     <><circle cx="0" cy="0" r="7"/><g strokeWidth="2" stroke="currentColor"><line x1="0" y1="-13" x2="0" y2="-10"/><line x1="0" y1="13" x2="0" y2="10"/><line x1="-13" y1="0" x2="-10" y2="0"/><line x1="13" y1="0" x2="10" y2="0"/><line x1="-9" y1="-9" x2="-7" y2="-7"/><line x1="9" y1="9" x2="7" y2="7"/><line x1="-9" y1="9" x2="-7" y2="7"/><line x1="9" y1="-9" x2="7" y2="-7"/></g></>,
                          moon:    <path d="M -2 -12 Q -14 -6 -10 6 Q -4 14 8 10 Q -2 6 -4 -2 Q -2 -8 -2 -12 Z" />,
                          rocket:  <><path d="M 0 -14 Q 8 -6 8 4 L 0 10 L -8 4 Q -8 -6 0 -14 Z"/><circle cx="0" cy="-4" r="3" fill="white"/><path d="M -8 4 L -12 12 L -4 10 Z M 8 4 L 12 12 L 4 10 Z"/></>,
                          flower:  <><circle cx="0" cy="-7" r="4"/><circle cx="6" cy="-2" r="4"/><circle cx="4" cy="6" r="4"/><circle cx="-4" cy="6" r="4"/><circle cx="-6" cy="-2" r="4"/><circle cx="0" cy="0" r="3" fill="white"/></>,
                          heart:   <path d="M 0 12 L -10 0 Q -14 -8 -7 -10 Q -2 -10 0 -4 Q 2 -10 7 -10 Q 14 -8 10 0 Z" />,
                          rainbow: <><path d="M -14 6 Q 0 -14 14 6" stroke={d.color} strokeWidth="3" fill="none"/><path d="M -10 6 Q 0 -8 10 6" stroke="white" strokeWidth="2.5" fill="none"/></>,
                        };
                        return shapes[d.shape];
                      })()}
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-to">
        <div className="container">
          <div className="section__head">
            <Eyebrow>Cómo comprar</Eyebrow>
            <h2>Sencillo, sin vueltas.</h2>
            <p>Cuatro pasos desde que elegís la prenda hasta que llega a tus manos.</p>
          </div>
          <div className="steps">
            {STEPS.map(s => (
              <div className="step" key={s.n}>
                <div className="step__num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / TRUST STRIP */}
      <section className="section section--ink">
        <div className="container">
          <div style={{ display: 'grid', gap: 'var(--sp-12)', gridTemplateColumns: '1fr', alignItems: 'center', justifyItems: 'center', textAlign: 'center' }}>
            <Eyebrow color="var(--durazno)">Hecha en Argentina</Eyebrow>
            <h2 className="display-l" style={{ maxWidth: '18ch', margin: 0 }}>
              Imprimimos cada prenda <span style={{ fontFamily: 'var(--font-script)', color: 'var(--durazno)' }}>a pedido</span>, sin stock ni desperdicio.
            </h2>
            <Button variant="soft" size="lg" icon="bag" onClick={() => navigate('catalog')}>Ver el catálogo</Button>
          </div>
        </div>
      </section>
    </main>
  );
};

window.Home = Home;
