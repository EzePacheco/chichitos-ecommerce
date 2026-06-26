import { buildWhatsAppHref } from "../../../lib/whatsapp";

export type ProductCategory =
  | "remeras"
  | "bodies"
  | "abrigos"
  | "sets"
  | "accesorios";

export type ProductStatus = "active" | "draft";

export type ProductSize = {
  id: string;
  label: string;
  note?: string;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type ProductDesign = {
  id: string;
  name: string;
  summary: string;
  extraPriceCents?: number;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type ProductPersonalization = {
  enabled: boolean;
  label: string;
  description: string;
  extraPriceCents: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  status: ProductStatus;
  featured: boolean;
  summary: string;
  description: string;
  basePriceCents: number;
  productionTime: string;
  accentColor: string;
  imageUrl?: string | null;
  imageAlt?: string;
  badges: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  designs: ProductDesign[];
  personalization: ProductPersonalization;
  stock?: ProductVariantStock[];
};

export type ProductVariantStock = {
  sizeCode: string;
  colorCode: string;
  designId?: string | null;
  quantityAvailable: number;
  trackStock: boolean;
};

export const catalogCategoryLabels: Record<ProductCategory, string> = {
  remeras: "Remeras",
  bodies: "Bodies",
  abrigos: "Abrigos",
  sets: "Sets",
  accesorios: "Accesorios",
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: "prd_remera_basica",
    name: "Remera de algodon",
    slug: "remera-algodon",
    category: "remeras",
    status: "active",
    featured: true,
    summary: "Base suave para elegir talle, color y diseno DTF.",
    description:
      "Remera infantil de algodon pensada para uso diario. Se produce a pedido con estampa DTF propia, combinando talle, color y diseno elegido.",
    basePriceCents: 1250000,
    productionTime: "3 a 5 dias habiles desde la confirmacion del pago.",
    accentColor: "var(--durazno)",
    badges: ["A pedido", "DTF"],
    sizes: [
      { id: "2", label: "2" },
      { id: "4", label: "4" },
      { id: "6", label: "6" },
      { id: "8", label: "8" },
      { id: "10", label: "10" },
    ],
    colors: [
      { id: "natural", name: "Natural", hex: "#fcf7ec" },
      { id: "salvia", name: "Salvia", hex: "#b4c9a4" },
      { id: "celeste", name: "Celeste", hex: "#b7d2e6" },
    ],
    designs: [
      {
        id: "bosque",
        name: "Bosque de amigos",
        summary: "Animalitos y hojas en paleta calida.",
      },
      {
        id: "dino",
        name: "Dino curioso",
        summary: "Dinosaurio ilustrado con tono jugueton.",
      },
      {
        id: "arco",
        name: "Arcoiris suave",
        summary: "Formas simples para prendas de todos los dias.",
      },
    ],
    personalization: {
      enabled: true,
      label: "Nombre o frase corta",
      description:
        "Permite sumar nombre, fecha o frase breve al diseno elegido.",
      extraPriceCents: 250000,
    },
  },
  {
    id: "prd_body_bebe",
    name: "Body bebe",
    slug: "body-bebe",
    category: "bodies",
    status: "active",
    featured: true,
    summary: "Para regalos personalizados con nombre o fecha.",
    description:
      "Body de bebe para regalos, nacimientos y primeros meses. El diseno se aplica con DTF y puede personalizarse con datos del bebe.",
    basePriceCents: 1180000,
    productionTime: "4 a 6 dias habiles por armado personalizado.",
    accentColor: "var(--celeste)",
    badges: ["Personalizable", "Regalo"],
    sizes: [
      { id: "rn", label: "RN", note: "Recien nacido" },
      { id: "3m", label: "3M" },
      { id: "6m", label: "6M" },
      { id: "12m", label: "12M" },
      { id: "18m", label: "18M" },
    ],
    colors: [
      { id: "blanco", name: "Blanco", hex: "#fcf7ec" },
      { id: "crema", name: "Crema", hex: "#f7efe0" },
      { id: "rosa", name: "Rosa suave", hex: "#f2b9b9" },
    ],
    designs: [
      {
        id: "primer-cumple",
        name: "Primer cumple",
        summary: "Composicion para fecha especial.",
      },
      {
        id: "luna",
        name: "Luna dormilona",
        summary: "Ilustracion calma para primeros meses.",
      },
      {
        id: "patitos",
        name: "Patitos",
        summary: "Motivo tierno con trazo propio.",
      },
    ],
    personalization: {
      enabled: true,
      label: "Nombre y fecha",
      description: "Ideal para nacimientos, baby showers o primer cumple.",
      extraPriceCents: 200000,
    },
  },
  {
    id: "prd_buzo_liviano",
    name: "Buzo liviano",
    slug: "buzo-liviano",
    category: "abrigos",
    status: "active",
    featured: true,
    summary: "Prenda calentita con estampa propia de taller.",
    description:
      "Buzo liviano para media estacion. Permite aplicar disenos propios con buena presencia visual y opcion de personalizacion.",
    basePriceCents: 2150000,
    productionTime: "5 a 7 dias habiles por preparacion de prenda y estampa.",
    accentColor: "var(--salvia)",
    badges: ["Nuevo", "Media estacion"],
    sizes: [
      { id: "2", label: "2" },
      { id: "4", label: "4" },
      { id: "6", label: "6" },
      { id: "8", label: "8" },
    ],
    colors: [
      { id: "arena", name: "Arena", hex: "#e4d2b5" },
      { id: "verde", name: "Verde suave", hex: "#b4c9a4" },
      { id: "grafito", name: "Grafito", hex: "#6b5e52" },
    ],
    designs: [
      {
        id: "osito",
        name: "Osito aviador",
        summary: "Personaje propio con detalles grandes.",
      },
      {
        id: "cohete",
        name: "Cohete de juego",
        summary: "Diseno dinamico para frente de buzo.",
      },
      {
        id: "campamento",
        name: "Campamento",
        summary: "Motivo de bosque y aventura.",
      },
    ],
    personalization: {
      enabled: true,
      label: "Inicial o nombre",
      description:
        "Se puede sumar inicial, nombre o variante de color del diseno.",
      extraPriceCents: 300000,
    },
  },
  {
    id: "prd_set_regalo",
    name: "Set para regalar",
    slug: "set-regalo",
    category: "sets",
    status: "active",
    featured: true,
    summary: "Combinacion preparada para cumpleanos y nacimientos.",
    description:
      "Set pensado para resolver un regalo completo. Puede combinar prenda principal, accesorio y estampa personalizada segun ocasion.",
    basePriceCents: 2890000,
    productionTime: "5 a 8 dias habiles, segun piezas elegidas.",
    accentColor: "var(--mostaza)",
    badges: ["Regalo", "Combo"],
    sizes: [
      { id: "0-3", label: "0-3M" },
      { id: "3-6", label: "3-6M" },
      { id: "6-12", label: "6-12M" },
      { id: "2-4", label: "2-4" },
    ],
    colors: [
      { id: "mix-calido", name: "Mix calido", hex: "#f5c9a8" },
      { id: "mix-frio", name: "Mix suave", hex: "#b7d2e6" },
      { id: "neutral", name: "Neutral", hex: "#efe3ce" },
    ],
    designs: [
      {
        id: "cumple",
        name: "Cumple feliz",
        summary: "Diseno festivo para cumpleanos.",
      },
      {
        id: "bienvenido",
        name: "Bienvenido bebe",
        summary: "Motivo para nacimiento o baby shower.",
      },
      {
        id: "familia",
        name: "Mini familia",
        summary: "Set con detalle coordinado.",
      },
    ],
    personalization: {
      enabled: true,
      label: "Dedicatoria corta",
      description: "Puede incluir nombre, fecha o texto breve para regalo.",
      extraPriceCents: 350000,
    },
  },
  {
    id: "prd_babero_estampado",
    name: "Babero estampado",
    slug: "babero-estampado",
    category: "accesorios",
    status: "active",
    featured: false,
    summary: "Accesorio liviano para completar un regalo personalizado.",
    description:
      "Babero con estampa DTF propia. Funciona como compra simple o complemento de sets para regalo.",
    basePriceCents: 780000,
    productionTime: "3 a 5 dias habiles.",
    accentColor: "var(--coral)",
    badges: ["Accesorio", "Personalizable"],
    sizes: [{ id: "unico", label: "Unico" }],
    colors: [
      { id: "blanco", name: "Blanco", hex: "#fcf7ec" },
      { id: "crema", name: "Crema", hex: "#f7efe0" },
    ],
    designs: [
      {
        id: "nombre",
        name: "Nombre protagonista",
        summary: "Nombre con detalle ilustrado.",
      },
      {
        id: "frutas",
        name: "Frutitas",
        summary: "Motivo colorido para uso diario.",
      },
    ],
    personalization: {
      enabled: true,
      label: "Nombre",
      description: "Nombre del bebe o frase muy corta.",
      extraPriceCents: 150000,
    },
  },
];

export const featuredProducts = getFeaturedCatalogProducts();

export function getActiveCatalogProducts(
  products: CatalogProduct[] = catalogProducts,
) {
  return products.filter((product) => product.status === "active");
}

export function getFeaturedCatalogProducts(
  products: CatalogProduct[] = catalogProducts,
) {
  return getActiveCatalogProducts(products).filter(
    (product) => product.featured,
  );
}

export function getCatalogProductBySlug(
  slug: string,
  products: CatalogProduct[] = catalogProducts,
) {
  return getActiveCatalogProducts(products).find(
    (product) => product.slug === slug,
  );
}

export function getProductsByCategory(
  category: ProductCategory,
  products: CatalogProduct[] = catalogProducts,
) {
  return getActiveCatalogProducts(products).filter(
    (product) => product.category === category,
  );
}

export function getCatalogCategories(
  products: CatalogProduct[] = catalogProducts,
) {
  const counts = new Map<ProductCategory, number>();

  for (const product of getActiveCatalogProducts(products)) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }

  return (Object.keys(catalogCategoryLabels) as ProductCategory[])
    .filter((category) => counts.has(category))
    .map((category) => ({
      count: counts.get(category) ?? 0,
      id: category,
      label: catalogCategoryLabels[category],
    }));
}

export function buildProductWhatsAppMessage(product: CatalogProduct) {
  return `Hola Chichitos, quiero consultar por ${product.name}. Me interesa elegir talle, color y diseno.`;
}

export function buildProductWhatsAppHref(
  product: CatalogProduct,
  phoneNumber?: string,
) {
  return buildWhatsAppHref(phoneNumber, buildProductWhatsAppMessage(product));
}
