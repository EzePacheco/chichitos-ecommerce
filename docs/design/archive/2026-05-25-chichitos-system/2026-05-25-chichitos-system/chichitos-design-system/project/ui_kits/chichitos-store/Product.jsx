// Chichitos Store — Product detail page

const Product = ({ product, navigate, addToCart }) => {
  const { PALETTES, DESIGNS } = window.CHICHITOS_DATA;
  const [size, setSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)]);
  const [colorKey, setColorKey] = useState(product.baseColors[0]);
  const [designId, setDesignId] = useState(product.designs[0]);
  const [qty, setQty] = useState(1);
  const [personalize, setPersonalize] = useState(false);
  const [name, setName] = useState('');
  const [thumbIdx, setThumbIdx] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const colorMeta = {
    cream: 'Crema',   blanco: 'Blanco',   durazno: 'Durazno', salvia: 'Salvia',
    celeste: 'Celeste', coral: 'Coral', mostaza: 'Mostaza',  rosa: 'Rosa',
    gris: 'Gris',       marino: 'Marino',
  };

  const design = DESIGNS.find(d => d.id === designId);
  const baseHex = PALETTES[colorKey] || PALETTES.cream;
  const personalCost = 1500;
  const total = product.price + (personalize ? personalCost : 0);

  const submit = () => {
    addToCart({
      productId: product.id, name: product.name, type: product.type,
      size, colorKey, colorHex: baseHex,
      designId, designName: design?.name, designColor: design?.color, designShape: design?.shape,
      personalize, personalName: personalize ? name : null,
      qty, unitPrice: total,
    });
  };

  // 3 thumbs: front (design center), back (no design), folded
  const thumbs = [
    { key: 'front', shape: design?.shape },
    { key: 'back', shape: null },
    { key: 'folded', shape: design?.shape, scale: 0.5 },
  ];

  return (
    <main className="app__main">
      <div className="container">
        <nav style={{ paddingTop: 'var(--sp-6)', fontSize: 'var(--fs-body-sm)', color: 'var(--ink-500)' }} aria-label="Migas">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Inicio</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('catalog'); }}>Catálogo</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <span>{product.name}</span>
        </nav>

        <div className="product">
          <div className="gallery">
            <div className="gallery__main">
              <GarmentPlaceholder type={product.type} color={baseHex}
                designShape={thumbs[thumbIdx].shape} designColor={design?.color}
                scale={thumbs[thumbIdx].scale ?? 1} />
            </div>
            <div className="gallery__thumbs">
              {thumbs.map((t, i) => (
                <button key={t.key}
                  className={`gallery__thumb ${i === thumbIdx ? 'is-active' : ''}`}
                  onClick={() => setThumbIdx(i)}
                  aria-label={`Vista ${i + 1}`}>
                  <GarmentPlaceholder type={product.type} color={baseHex}
                    designShape={t.shape} designColor={design?.color}
                    scale={t.scale ?? 1} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Eyebrow>{product.type}</Eyebrow>
            {product.tag && (
              <span style={{ marginLeft: 12 }}>
                <GarmentTag variant={product.tagVariant}>{product.tag}</GarmentTag>
              </span>
            )}
            <h1 className="product__title">{product.name}</h1>
            <div className="product__price">
              ${total.toLocaleString('es-AR')}
              {personalize && <small>incluye personalización (+${personalCost.toLocaleString('es-AR')})</small>}
            </div>
            <p style={{ color: 'var(--ink-700)', marginTop: 0 }}>{product.description}</p>

            {/* Talle */}
            <div className="option-group">
              <div className="option-group__head">
                <label className="option-group__label">Talle: <strong>{size}</strong></label>
                <button className="option-group__link" onClick={() => setShowSizeGuide(s => !s)}>
                  <Icon name="ruler" size={14} style={{ verticalAlign: -2 }} /> Guía de talles
                </button>
              </div>
              <div className="option-row size-row">
                {product.sizes.map(s => (
                  <button key={s} className={`chip ${size === s ? 'is-active' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
              {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
            </div>

            {/* Color */}
            <div className="option-group">
              <label className="option-group__label">Color base: <strong>{colorMeta[colorKey]}</strong></label>
              <div className="option-row" style={{ marginTop: 8 }}>
                {product.baseColors.map(c => (
                  <button key={c}
                    className={`swatch ${colorKey === c ? 'is-active' : ''}`}
                    style={{ background: PALETTES[c] }}
                    onClick={() => setColorKey(c)}
                    aria-label={colorMeta[c]} title={colorMeta[c]} />
                ))}
              </div>
            </div>

            {/* Diseño */}
            <div className="option-group">
              <label className="option-group__label">Diseño: <strong>{design?.name}</strong></label>
              <div className="option-row" style={{ marginTop: 8 }}>
                {product.designs.map(did => {
                  const d = DESIGNS.find(dd => dd.id === did);
                  return (
                    <button key={did}
                      className={`design-card ${designId === did ? 'is-active' : ''}`}
                      onClick={() => setDesignId(did)}
                      aria-label={d.name}>
                      <DesignSvg shape={d.shape} color={d.color} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personalización */}
            <div className="option-group">
              <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, background: 'var(--cream-100)', border: '1px dashed var(--sand-400)', borderRadius: 'var(--r-lg)', cursor: 'pointer' }}>
                <input type="checkbox" checked={personalize} onChange={e => setPersonalize(e.target.checked)} style={{ marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Sumar un nombre <span style={{ color: 'var(--ink-500)', fontWeight: 400 }}>+${personalCost.toLocaleString('es-AR')}</span></div>
                  <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-500)' }}>Lo estampamos junto al diseño en el mismo color.</div>
                  {personalize && (
                    <input
                      type="text"
                      placeholder="Ej: Mateo"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input"
                      maxLength={12}
                      style={{ marginTop: 10, maxWidth: 240 }}
                    />
                  )}
                </div>
              </label>
            </div>

            {/* Cantidad + CTAs */}
            <div className="option-group">
              <label className="option-group__label">Cantidad</label>
              <div style={{ marginTop: 8 }}>
                <Stepper value={qty} onChange={setQty} />
              </div>
            </div>

            <div className="product__cta-row">
              <Button variant="primary" size="lg" icon="bag" onClick={submit}>
                Sumar al carrito · ${(total * qty).toLocaleString('es-AR')}
              </Button>
              <Button variant="ghost" size="lg" as="a"
                href={`https://wa.me/5491100000000?text=Hola!%20Me%20interesa%20${encodeURIComponent(product.name)}%20talle%20${size}%20color%20${colorMeta[colorKey]}%20diseño%20${encodeURIComponent(design?.name || '')}`}>
                Consultar por WhatsApp
              </Button>
            </div>

            <div className="disclaimer">
              <Icon name="info" size={20} />
              <div>
                <strong>Producción a pedido.</strong> Imprimimos tu prenda apenas confirmás el pago. Está lista en 5-7 días hábiles y se despacha al siguiente.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Compact design SVG used in selector
const DesignSvg = ({ shape, color }) => {
  const shapes = {
    cloud:   <path d="M -14 4 Q -18 -2 -12 -4 Q -14 -12 -4 -10 Q 0 -16 8 -12 Q 16 -12 14 -4 Q 20 -2 16 6 Z" />,
    star:    <polygon points="0,-14 4,-4 14,-3 6,4 8,14 0,9 -8,14 -6,4 -14,-3 -4,-4" />,
    sun:     <><circle cx="0" cy="0" r="7"/><g strokeWidth="2" stroke="currentColor" fill="none"><line x1="0" y1="-13" x2="0" y2="-10"/><line x1="0" y1="13" x2="0" y2="10"/><line x1="-13" y1="0" x2="-10" y2="0"/><line x1="13" y1="0" x2="10" y2="0"/><line x1="-9" y1="-9" x2="-7" y2="-7"/><line x1="9" y1="9" x2="7" y2="7"/><line x1="-9" y1="9" x2="-7" y2="7"/><line x1="9" y1="-9" x2="7" y2="-7"/></g></>,
    moon:    <path d="M -2 -12 Q -14 -6 -10 6 Q -4 14 8 10 Q -2 6 -4 -2 Q -2 -8 -2 -12 Z" />,
    rocket:  <><path d="M 0 -14 Q 8 -6 8 4 L 0 10 L -8 4 Q -8 -6 0 -14 Z"/><circle cx="0" cy="-4" r="3" fill="white"/><path d="M -8 4 L -12 12 L -4 10 Z M 8 4 L 12 12 L 4 10 Z"/></>,
    flower:  <><circle cx="0" cy="-7" r="4"/><circle cx="6" cy="-2" r="4"/><circle cx="4" cy="6" r="4"/><circle cx="-4" cy="6" r="4"/><circle cx="-6" cy="-2" r="4"/><circle cx="0" cy="0" r="3" fill="white"/></>,
    heart:   <path d="M 0 12 L -10 0 Q -14 -8 -7 -10 Q -2 -10 0 -4 Q 2 -10 7 -10 Q 14 -8 10 0 Z" />,
    rainbow: <><path d="M -14 6 Q 0 -14 14 6" stroke={color} strokeWidth="3" fill="none"/><path d="M -10 6 Q 0 -8 10 6" stroke="white" strokeWidth="2.5" fill="none"/></>,
  };
  return (
    <svg viewBox="-20 -20 40 40" style={{ color, width: '100%', height: '100%' }} fill={color}>
      {shapes[shape]}
    </svg>
  );
};

const SizeGuide = ({ onClose }) => (
  <div style={{ marginTop: 12, padding: 16, background: 'var(--cream-50)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <strong>Guía de talles</strong>
      <button className="icon-btn" onClick={onClose} aria-label="Cerrar guía"><Icon name="x" size={16} /></button>
    </div>
    <table className="table" style={{ background: 'transparent', border: 'none', borderRadius: 0 }}>
      <thead><tr><th>Talle</th><th>Edad</th><th>Pecho</th><th>Largo</th></tr></thead>
      <tbody>
        <tr><td>2</td><td>1-2 años</td><td>30 cm</td><td>38 cm</td></tr>
        <tr><td>4</td><td>3-4 años</td><td>32 cm</td><td>42 cm</td></tr>
        <tr><td>6</td><td>5-6 años</td><td>34 cm</td><td>46 cm</td></tr>
        <tr><td>8</td><td>7-8 años</td><td>37 cm</td><td>50 cm</td></tr>
        <tr><td>10</td><td>9-10 años</td><td>40 cm</td><td>54 cm</td></tr>
        <tr><td>12</td><td>11-12 años</td><td>43 cm</td><td>58 cm</td></tr>
      </tbody>
    </table>
    <small style={{ color: 'var(--ink-500)', display: 'block', marginTop: 8 }}>Medidas aproximadas. Si dudás entre dos talles, te recomendamos el más grande.</small>
  </div>
);

window.Product = Product;
window.DesignSvg = DesignSvg;
