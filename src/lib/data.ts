import images from "@/assets/nike-images.json";
import cutouts from "@/assets/editorial-images.json";

export type CategoryId = "airmax" | "classicos" | "corrida";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  /** CSS object-position that centers the shoe inside a 5:4 frame */
  focus: string;
  /** "grey" images have their own studio gradient and can't be multiplied */
  studio: "white" | "grey";
  /** Matching studio background */
  bg: string;
  badge?: string;
  colors: { name: string; hex: string }[];
  description: string;
  year: string;
};

export const products: Product[] = [
  {
    id: "dunk-low-panda",
    name: "Nike Dunk Low Retro",
    subtitle: "Branco / Preto · Panda",
    category: "classicos",
    categoryLabel: "Clássicos",
    price: 899.99,
    image: cutouts.dunk,
    gallery: [cutouts.dunk, images.dunk],
    focus: "50% 67%",
    studio: "white",
    bg: "#f1f1ee",
    badge: "Best-seller",
    colors: [
      { name: "Branco", hex: "#F5F5F2" },
      { name: "Preto", hex: "#141414" },
    ],
    description:
      "Nascido nas quadras de basquete em 1985, o Dunk virou símbolo de rua e skate. Painéis de couro em contraste branco e preto, entressola de espuma e a silhueta que nunca sai de moda.",
    year: "1985",
  },
  {
    id: "air-force-1-07",
    name: "Nike Air Force 1 '07",
    subtitle: "Branco",
    category: "classicos",
    categoryLabel: "Clássicos",
    price: 799.99,
    image: cutouts.airForce1,
    gallery: [cutouts.airForce1, images.airForce1],
    focus: "50% 90%",
    studio: "white",
    bg: "#f1f1ee",
    badge: "Desde 1982",
    colors: [
      { name: "Branco", hex: "#F5F5F2" },
      { name: "Preto", hex: "#141414" },
    ],
    description:
      "O tênis que mudou o jogo em 1982 e nunca saiu dele. Couro macio, costuras limpas e a unidade Air no calcanhar para amortecer cada passo. O branco mais icônico da cultura sneaker.",
    year: "1982",
  },
  {
    id: "air-jordan-1-low",
    name: "Air Jordan 1 Low",
    subtitle: "Branco",
    category: "classicos",
    categoryLabel: "Clássicos",
    price: 849.99,
    image: cutouts.jordan1,
    gallery: [cutouts.jordan1, images.jordan1],
    focus: "50% 67%",
    studio: "grey",
    bg: "linear-gradient(180deg,#a9a9a9 0%,#bcbcbc 52%,#cbcbcb 100%)",
    badge: "Jordan",
    colors: [
      { name: "Branco", hex: "#F5F5F2" },
      { name: "Palomino", hex: "#B79A74" },
      { name: "Preto/Verde", hex: "#1c2a24" },
    ],
    description:
      "Inspirado no original de 1985, o AJ1 Low traz couro legítimo, unidade Air encapsulada e a atitude de sempre. Um visual limpo que combina com qualquer coisa.",
    year: "1985",
  },
  {
    id: "air-max-90",
    name: "Nike Air Max 90",
    subtitle: "Preto / Branco",
    category: "airmax",
    categoryLabel: "Air Max",
    price: 1099.99,
    oldPrice: 1199.99,
    image: cutouts.airMax90,
    gallery: [cutouts.airMax90, images.airMax90],
    focus: "50% 69%",
    studio: "white",
    bg: "#f1f1ee",
    badge: "Clássico",
    colors: [
      { name: "Iron Grey", hex: "#3a3b3d" },
      { name: "Preto", hex: "#141414" },
      { name: "Branco", hex: "#F5F5F2" },
    ],
    description:
      "Unidade Air visível, sola waffle e camadas de couro e malha que marcaram os anos 90. Um dos tênis mais reconhecíveis da história da Nike, ainda com a mesma presença.",
    year: "1990",
  },
  {
    id: "air-max-97",
    name: "Nike Air Max 97",
    subtitle: "Preto",
    category: "airmax",
    categoryLabel: "Air Max",
    price: 1299.99,
    image: cutouts.airMax97,
    gallery: [cutouts.airMax97, images.airMax97],
    focus: "50% 80%",
    studio: "white",
    bg: "#f1f1ee",
    badge: "Ícone 97",
    colors: [
      { name: "Preto", hex: "#141414" },
      { name: "Prata", hex: "#C9CDD2" },
    ],
    description:
      "Linhas onduladas inspiradas nos trens-bala japoneses e a primeira unidade Air de comprimento total. Lançado em 1997, continua à frente do seu tempo.",
    year: "1997",
  },
  {
    id: "air-max-sc",
    name: "Nike Air Max SC",
    subtitle: "Oliva / Bege",
    category: "airmax",
    categoryLabel: "Air Max",
    price: 849.99,
    oldPrice: 949.99,
    image: cutouts.airMaxSC,
    gallery: [cutouts.airMaxSC, images.airMaxSC],
    focus: "50% 100%",
    studio: "white",
    bg: "#f1f1ee",
    colors: [
      { name: "Oliva", hex: "#7a7a4c" },
      { name: "Bege", hex: "#C8BB8B" },
    ],
    description:
      "Visual limpo, tons terrosos e unidade Air visível. O Air Max SC une estética retrô a um conforto para o dia inteiro, com entressola de espuma macia.",
    year: "2022",
  },
  {
    id: "vomero-18",
    name: "Nike Vomero 18",
    subtitle: "Cinza / Azul",
    category: "corrida",
    categoryLabel: "Corrida",
    price: 1199.99,
    image: cutouts.vomero,
    gallery: [cutouts.vomero, images.vomero],
    focus: "50% 95%",
    studio: "white",
    bg: "#f1f1ee",
    badge: "Corrida",
    colors: [
      { name: "Cinza", hex: "#B3B8C1" },
      { name: "Azul marinho", hex: "#1E2A6B" },
    ],
    description:
      "Máxima maciez para treinos longos. Espuma ZoomX no entressola, malha respirável e uma pisada que parece flutuar. Feito para somar quilômetros sem cansar.",
    year: "2025",
  },
];

export type Featured = {
  id: string;
  productId: string;
  name: string;
  sub: string;
  code: string;
  image: string;
  focus: string;
  bg: string;
  hex: string;
  glow: string;
  tagline: string;
};

const featuredIds: { productId: string; code: string; hex: string; glow: string; tagline: string }[] = [
  {
    productId: "dunk-low-panda",
    code: "DK-85",
    hex: "#F5F5F2",
    glow: "rgba(216,255,62,0.22)",
    tagline: "Preto e branco, sem pedir licença. O Dunk de 1985 que a rua nunca largou.",
  },
  {
    productId: "air-max-97",
    code: "AM-97",
    hex: "#C9CDD2",
    glow: "rgba(90,120,255,0.26)",
    tagline: "Linhas de trem-bala e Air de ponta a ponta. O futuro, desde 1997.",
  },
  {
    productId: "air-max-90",
    code: "AM-90",
    hex: "#3a3b3d",
    glow: "rgba(255,90,46,0.24)",
    tagline: "Janela Air à vista e camadas que definiram os anos 90.",
  },
  {
    productId: "air-force-1-07",
    code: "AF-82",
    hex: "#F5F5F2",
    glow: "rgba(168,220,255,0.24)",
    tagline: "O branco mais famoso do mundo. Desde 1982, continua a jogar em casa.",
  },
];

export const featured: Featured[] = featuredIds.map((item) => {
  const product = products.find((p) => p.id === item.productId)!;
  return {
    id: product.id,
    productId: product.id,
    name: product.name.replace("Nike ", ""),
    sub: product.subtitle,
    code: item.code,
    image: product.image,
    focus: product.focus,
    bg: product.bg,
    hex: item.hex,
    glow: item.glow,
    tagline: item.tagline,
  };
});

export const categories: { id: CategoryId | "todos"; label: string; count: number }[] = [
  { id: "todos", label: "Todos", count: products.length },
  { id: "airmax", label: "Air Max", count: products.filter((p) => p.category === "airmax").length },
  { id: "classicos", label: "Clássicos", count: products.filter((p) => p.category === "classicos").length },
  { id: "corrida", label: "Corrida", count: products.filter((p) => p.category === "corrida").length },
];

export type Spec = {
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  metricPct: number;
  position: { x: number; y: number };
};

export const specs: Spec[] = [
  {
    id: "swoosh",
    index: "01",
    title: "Swoosh Bordado",
    short: "Swoosh",
    description:
      "O símbolo mais reconhecido do esporte, bordado em fio branco sobre a malha preta. Cada ponto reflete a luz de um jeito e dá profundidade ao visual total black.",
    metricLabel: "Acabamento",
    metricValue: "Bordado",
    metricPct: 90,
    position: { x: 52, y: 49 },
  },
  {
    id: "air",
    index: "02",
    title: "Air de ponta a ponta",
    short: "Air",
    description:
      "A primeira unidade Air de comprimento total, visível por toda a entressola. Comprime no impacto e devolve energia em cada passada. Mudou o design de tênis em 1997.",
    metricLabel: "Amortecimento Air",
    metricValue: "Total",
    metricPct: 94,
    position: { x: 64, y: 77 },
  },
  {
    id: "waves",
    index: "03",
    title: "Linhas Bullet Train",
    short: "Ondas",
    description:
      "Camadas onduladas inspiradas nos trens-bala japoneses. As costuras refletivas e os painéis sobrepostos criam um efeito de velocidade mesmo com o tênis parado.",
    metricLabel: "Camadas no upper",
    metricValue: "5 linhas",
    metricPct: 78,
    position: { x: 45, y: 33 },
  },
];

export const sizes = [37, 38, 39, 40, 41, 42, 43, 44, 45];

/** Foot length (cm) → BR size reference chart */
export const sizeChart: { br: number; cm: number }[] = [
  { br: 37, cm: 23.5 },
  { br: 38, cm: 24.5 },
  { br: 39, cm: 25 },
  { br: 40, cm: 26 },
  { br: 41, cm: 26.5 },
  { br: 42, cm: 27.5 },
  { br: 43, cm: 28 },
  { br: 44, cm: 29 },
  { br: 45, cm: 30 },
];

export const navLinks = [
  { id: "lancamentos", label: "Lançamentos", index: "01" },
  { id: "tecnologia", label: "Detalhes", index: "02" },
  { id: "colecao", label: "Coleção", index: "03" },
  { id: "by-you", label: "By You", index: "04" },
  { id: "cultura", label: "Cultura", index: "05" },
];

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
