// Chichitos Store — shared components and icon set
// Loaded via <script type="text/babel">

const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================
   ICONS (Lucide-style, inline minimal set)
   ============================================================ */
const Icon = ({ name, size = 20, strokeWidth = 1.75, ...rest }) => {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      {...rest}
    >
      {paths}
    </svg>
  );
};
const ICONS = {
  menu:        <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>,
  x:           <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
  bag:         <><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></>,
  heart:       <><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"/></>,
  search:      <><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></>,
  user:        <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></>,
  plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  minus:       <><line x1="5" y1="12" x2="19" y2="12"/></>,
  chevronR:    <><polyline points="9 6 15 12 9 18"/></>,
  chevronL:    <><polyline points="15 6 9 12 15 18"/></>,
  chevronD:    <><polyline points="6 9 12 15 18 9"/></>,
  star:        <><polygon points="12 3 14.5 9.5 21 10.2 16 14.7 17.4 21 12 17.7 6.6 21 8 14.7 3 10.2 9.5 9.5 12 3"/></>,
  starOutline: <><polygon points="12 3 14.5 9.5 21 10.2 16 14.7 17.4 21 12 17.7 6.6 21 8 14.7 3 10.2 9.5 9.5 12 3"/></>,
  truck:       <><rect x="1" y="6" width="14" height="11"/><polygon points="15 9 19 9 22 13 22 17 15 17 15 9"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
  package:     <><path d="M21 8.5V17a2 2 0 0 1-1 1.7l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 17V8.5"/><path d="M3.3 7.6L12 12l8.7-4.4"/><path d="M3.3 7.6L12 3l8.7 4.6"/><path d="M12 12v10"/></>,
  card:        <><rect x="2" y="6" width="20" height="13" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
  store:       <><path d="M4 9h16l-1 12H5L4 9z"/><path d="M4 9l2-5h12l2 5"/><path d="M9 13h6"/></>,
  info:        <><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></>,
  sparkles:    <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><circle cx="12" cy="12" r="2"/></>,
  filter:      <><polygon points="3 5 21 5 14 13 14 20 10 20 10 13 3 5"/></>,
  trash:       <><polyline points="4 7 20 7"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/></>,
  edit:        <><path d="M14 3l7 7-11 11H3v-7L14 3z"/></>,
  home:        <><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></>,
  layers:      <><polygon points="12 2 22 8 12 14 2 8 12 2"/><polyline points="2 14 12 20 22 14"/></>,
  shoppingCart:<><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L22 7H6"/></>,
  settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  check:       <><polyline points="5 12 10 17 20 7"/></>,
  ruler:       <><path d="M4 16l12-12 4 4-12 12-4-4z"/><path d="M7 13l1.5 1.5M9 11l2 2M11 9l1.5 1.5M13 7l2 2"/></>,
  download:    <><path d="M12 4v12"/><polyline points="7 11 12 16 17 11"/><path d="M5 20h14"/></>,
  pin:         <><path d="M12 2c4 0 7 3 7 7 0 5-7 13-7 13S5 14 5 9c0-4 3-7 7-7z"/><circle cx="12" cy="9" r="2.5"/></>,
};

/* ============================================================
   LOGO
   ============================================================ */
const LOGO_DARK  = '../../assets/logo-chichitos-dark.png';
const LOGO_WHITE = '../../assets/logo-chichitos-white.png';
const LOGO_FULL  = '../../assets/logo-chichitos-full.png';

const Logo = ({ variant = 'dark', height = 44, style }) => {
  const src = variant === 'white' ? LOGO_WHITE : variant === 'full' ? LOGO_FULL : LOGO_DARK;
  return (
    <img
      src={src}
      alt="Chichitos"
      style={{ height, width: 'auto', display: 'block', ...style }}
    />
  );
};

/* ============================================================
   GARMENT PLACEHOLDER — silueta + diseño DTF
   ============================================================ */
const GARMENT_PATHS = {
  Remera:    "M40 35 L20 25 L10 45 L25 55 L25 95 L75 95 L75 55 L90 45 L80 25 L60 35 C58 42 52 46 50 46 C48 46 42 42 40 35 Z",
  Buzo:      "M40 35 L18 28 L8 50 L22 60 L22 96 L78 96 L78 60 L92 50 L82 28 L60 35 C58 44 52 48 50 48 C48 48 42 44 40 35 Z M28 38 L28 50 M72 38 L72 50",
  Body:      "M40 30 L25 22 L15 38 L28 48 L30 70 C30 78 38 84 50 84 C62 84 70 78 70 70 L72 48 L85 38 L75 22 L60 30 C58 38 52 42 50 42 C48 42 42 38 40 30 Z",
  Pantalón:  "M30 15 L70 15 L72 40 L62 95 L52 95 L50 50 L48 95 L38 95 L28 40 Z",
  Campera:   "M38 30 L18 22 L10 42 L22 52 L22 96 L42 96 L42 50 L58 50 L58 96 L78 96 L78 52 L90 42 L82 22 L62 30 C60 38 54 42 50 42 C46 42 40 38 38 30 Z",
  Accesorio: "M20 60 Q20 30 50 30 Q80 30 80 60 L80 70 L20 70 Z M15 70 L85 70 L82 80 L18 80 Z",
};

const DESIGN_SHAPES = {
  cloud:   <path d="M -14 4 Q -18 -2 -12 -4 Q -14 -12 -4 -10 Q 0 -16 8 -12 Q 16 -12 14 -4 Q 20 -2 16 6 Z" />,
  star:    <polygon points="0,-14 4,-4 14,-3 6,4 8,14 0,9 -8,14 -6,4 -14,-3 -4,-4" />,
  sun:     <><circle cx="0" cy="0" r="7"/><g strokeWidth="2" stroke="currentColor"><line x1="0" y1="-13" x2="0" y2="-10"/><line x1="0" y1="13" x2="0" y2="10"/><line x1="-13" y1="0" x2="-10" y2="0"/><line x1="13" y1="0" x2="10" y2="0"/><line x1="-9" y1="-9" x2="-7" y2="-7"/><line x1="9" y1="9" x2="7" y2="7"/><line x1="-9" y1="9" x2="-7" y2="7"/><line x1="9" y1="-9" x2="7" y2="-7"/></g></>,
  moon:    <path d="M -2 -12 Q -14 -6 -10 6 Q -4 14 8 10 Q -2 6 -4 -2 Q -2 -8 -2 -12 Z" />,
  rocket:  <><path d="M 0 -14 Q 8 -6 8 4 L 0 10 L -8 4 Q -8 -6 0 -14 Z"/><circle cx="0" cy="-4" r="3" fill="white"/><path d="M -8 4 L -12 12 L -4 10 Z M 8 4 L 12 12 L 4 10 Z"/></>,
  flower:  <><circle cx="0" cy="-7" r="4"/><circle cx="6" cy="-2" r="4"/><circle cx="4" cy="6" r="4"/><circle cx="-4" cy="6" r="4"/><circle cx="-6" cy="-2" r="4"/><circle cx="0" cy="0" r="3" fill="white"/></>,
  heart:   <path d="M 0 12 L -10 0 Q -14 -8 -7 -10 Q -2 -10 0 -4 Q 2 -10 7 -10 Q 14 -8 10 0 Z" />,
  rainbow: <><path d="M -14 6 Q 0 -14 14 6" stroke="currentColor" strokeWidth="3" fill="none"/><path d="M -10 6 Q 0 -8 10 6" stroke="white" strokeWidth="2.5" fill="none"/></>,
};

const GarmentPlaceholder = ({ type = 'Remera', color = '#F7EFE0', designShape, designColor = '#1F1A14', scale = 1 }) => {
  // Choose a fitting outline color
  const outline = '#1F1A14';
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.95   0 0 0 0 0.93   0 0 0 0 0.88   0 0 0 0.08 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <path
        d={GARMENT_PATHS[type] || GARMENT_PATHS.Remera}
        fill={color}
        stroke={outline}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d={GARMENT_PATHS[type] || GARMENT_PATHS.Remera}
        fill="url(#paperGrain)"
        opacity="0.5"
      />
      {designShape && DESIGN_SHAPES[designShape] && (
        <g transform={`translate(50 62) scale(${scale * 1.1})`} fill={designColor} style={{ color: designColor }}>
          {DESIGN_SHAPES[designShape]}
        </g>
      )}
    </svg>
  );
};

/* ============================================================
   PRIMITIVES
   ============================================================ */
const Eyebrow = ({ children, color }) => (
  <span className="eyebrow" style={color ? { color } : undefined}>
    <span style={{ color: 'var(--coral)', marginRight: 6 }}>★</span>{children}
  </span>
);

const GarmentTag = ({ variant = 'dashed', children }) => {
  const cls = variant === 'dashed' ? 'chip chip--dashed'
            : variant === 'salvia' ? 'chip chip--salvia'
            : variant === 'celeste' ? 'chip chip--celeste'
            : variant === 'mostaza' ? 'chip chip--mostaza'
            : variant === 'durazno' ? 'chip chip--accent'
            : 'chip';
  return <span className={cls}>{children}</span>;
};

const Button = ({ variant = 'primary', size, icon, iconRight, children, as = 'button', href, onClick, ...rest }) => {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ''}`;
  const Tag = as;
  const content = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </>
  );
  if (as === 'a') return <a className={cls} href={href} onClick={onClick} {...rest}>{content}</a>;
  return <button className={cls} onClick={onClick} {...rest}>{content}</button>;
};

const Stepper = ({ value, onChange, min = 1 }) => (
  <div className="qty">
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Quitar">−</button>
    <span>{value}</span>
    <button type="button" onClick={() => onChange(value + 1)} aria-label="Sumar">+</button>
  </div>
);

const EmptyState = ({ icon = 'shoppingCart', title, children, action }) => (
  <div className="empty">
    <div className="empty__art"><Icon name={icon} size={56} strokeWidth={1.5} /></div>
    <h3>{title}</h3>
    <p>{children}</p>
    {action}
  </div>
);

/* ============================================================
   HEADER & FOOTER
   ============================================================ */
const Header = ({ route, navigate, cartCount }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { id: 'home', label: 'Inicio' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'how', label: 'Cómo comprar' },
    { id: 'wa', label: 'WhatsApp', external: true },
  ];
  const go = (id) => { setOpen(false); if (id === 'how') { navigate('home'); setTimeout(() => document.getElementById('how-to')?.scrollIntoView({ behavior: 'smooth' }), 50); } else navigate(id); };

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }} aria-label="Chichitos — inicio" style={{display:'flex',alignItems:'center'}}>
          <Logo variant="dark" height={42} />
        </a>
        <nav className="header__nav" aria-label="Principal">
          {links.map(l => (
            l.external
              ? <a key={l.id} href="https://wa.me/5491100000000" target="_blank" rel="noreferrer">{l.label}</a>
              : <a key={l.id} href={`#${l.id}`} className={route === l.id ? 'active' : ''} onClick={(e) => { e.preventDefault(); go(l.id); }}>{l.label}</a>
          ))}
        </nav>
        <div className="header__actions">
          <button className="icon-btn" aria-label="Buscar"><Icon name="search" /></button>
          <button className="icon-btn" aria-label="Carrito" onClick={() => navigate('cart')}>
            <Icon name="bag" />
            {cartCount > 0 && <span className="icon-btn__badge">{cartCount}</span>}
          </button>
          <button className="icon-btn menu-btn" aria-label="Menú" onClick={() => setOpen(true)}><Icon name="menu" /></button>
        </div>
      </div>

      <div className={`drawer ${open ? 'is-open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        <div className="drawer__panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Logo height={36} />
            <button className="icon-btn" aria-label="Cerrar" onClick={() => setOpen(false)}><Icon name="x" /></button>
          </div>
          <ul className="drawer__list">
            {links.map(l => (
              <li key={l.id}>
                {l.external
                  ? <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer">{l.label}</a>
                  : <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }}>{l.label}</a>}
              </li>
            ))}
          </ul>
          <Button variant="whatsapp" icon="sparkles" as="a" href="https://wa.me/5491100000000">Hablar por WhatsApp</Button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__grid">
        <div className="footer__brand">
          <Logo variant="white" height={56} />
          <p>Indumentaria infantil estampada con DTF. Diseños propios, hecha en Argentina, a mano y con tiempo.</p>
        </div>
        <div>
          <h4>Tienda</h4>
          <ul>
            <li><a href="#">Catálogo</a></li>
            <li><a href="#">Diseños propios</a></li>
            <li><a href="#">Personalización</a></li>
            <li><a href="#">Tarjetas regalo</a></li>
          </ul>
        </div>
        <div>
          <h4>Ayuda</h4>
          <ul>
            <li><a href="#">Cómo comprar</a></li>
            <li><a href="#">Talles</a></li>
            <li><a href="#">Envíos y retiro</a></li>
            <li><a href="#">Cambios y devoluciones</a></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul>
            <li><a href="#">WhatsApp</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">hola@chichitos.com.ar</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__legal">
        <span>© 2026 Chichitos. Hecha con paciencia en Argentina.</span>
        <span>Pagás con Mercado Pago · Enviamos a todo el país</span>
      </div>
    </div>
  </footer>
);

/* ============================================================
   WHATSAPP FLOATING
   ============================================================ */
const WhatsAppFloat = () => {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 200);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a className="wa-float"
       href="https://wa.me/5491100000000"
       target="_blank" rel="noreferrer"
       style={{ opacity: visible ? 1 : 0.4 }}
       aria-label="Consultar por WhatsApp">
      <svg className="wa-float__icon" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.001 5.333c-5.891 0-10.667 4.776-10.667 10.667 0 1.96.534 3.795 1.46 5.376L5.333 26.667l5.467-1.43a10.62 10.62 0 0 0 5.2 1.336c5.892 0 10.667-4.776 10.667-10.667S21.893 5.333 16.001 5.333zm0 19.466c-1.586 0-3.067-.453-4.32-1.226l-3.013.787.8-2.933a8.7 8.7 0 0 1-1.36-4.667c0-4.853 3.96-8.8 8.813-8.8 4.853 0 8.813 3.947 8.813 8.8 0 4.853-3.96 8.813-8.813 8.813zm4.853-6.587c-.267-.133-1.573-.773-1.813-.867-.24-.093-.413-.133-.587.133-.173.267-.68.867-.84 1.053-.16.187-.307.213-.573.067-.267-.133-1.12-.413-2.133-1.32-.787-.707-1.32-1.573-1.48-1.84-.16-.267-.013-.413.12-.547.12-.12.267-.307.4-.467.133-.16.173-.267.267-.453.093-.187.04-.347-.027-.48-.067-.133-.587-1.413-.8-1.933-.213-.507-.427-.44-.587-.453-.16-.013-.347-.013-.533-.013-.187 0-.493.067-.747.347-.267.267-.987.96-.987 2.36 0 1.4 1.013 2.747 1.147 2.933.133.187 1.973 3.027 4.787 4.24.667.293 1.187.467 1.6.6.667.213 1.28.187 1.76.107.533-.08 1.573-.64 1.8-1.267.227-.627.227-1.16.16-1.267-.067-.107-.24-.173-.507-.307z"/>
      </svg>
      <span className="wa-float__label">WhatsApp</span>
    </a>
  );
};

/* ============================================================
   PRODUCT CARD
   ============================================================ */
const ProductCard = ({ product, onOpen }) => {
  const { PALETTES, DESIGNS } = window.CHICHITOS_DATA;
  const [liked, setLiked] = useState(false);
  const baseColor = PALETTES[product.baseColors[0]] || PALETTES.cream;
  const design = DESIGNS.find(d => d.id === product.designs[0]);
  return (
    <a className="product-card" href={`#producto/${product.slug}`} onClick={(e) => { e.preventDefault(); onOpen(product); }}>
      <div className="product-card__media">
        {product.tag && (
          <span className="product-card__tag">
            <GarmentTag variant={product.tagVariant || 'dashed'}>{product.tag}</GarmentTag>
          </span>
        )}
        <button className={`product-card__fav ${liked ? 'is-liked' : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); }}
                aria-label="Favorito">
          <Icon name="heart" size={18} strokeWidth={liked ? 0 : 1.75} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <GarmentPlaceholder type={product.type} color={baseColor} designShape={design?.shape} designColor={design?.color} />
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>
        <span className="product-card__meta">{product.type} · {product.baseColors.length} colores · {product.designs.length} diseños</span>
        <div className="product-card__price">
          ${product.price.toLocaleString('es-AR')}
          {product.customizable && <small>· personalizable</small>}
        </div>
      </div>
    </a>
  );
};

/* ============================================================
   TOAST
   ============================================================ */
const Toast = ({ message, onDone }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 220); }, 2200);
    return () => clearTimeout(t);
  }, [message]);
  return (
    <div className={`toast ${visible ? 'is-visible' : ''}`}>
      <Icon name="check" size={16} /> {message}
    </div>
  );
};

/* ============================================================
   STATUS BADGE (admin)
   ============================================================ */
const OrderStatusBadge = ({ status }) => {
  const { STATUS_LABELS } = window.CHICHITOS_DATA;
  return <span className={`status status--${status}`}>{STATUS_LABELS[status]}</span>;
};

/* ============================================================
   EXPORT
   ============================================================ */
Object.assign(window, {
  Icon, Logo, Eyebrow, GarmentTag, Button, Stepper, EmptyState,
  Header, Footer, WhatsAppFloat, ProductCard, GarmentPlaceholder, Toast,
  OrderStatusBadge,
});
