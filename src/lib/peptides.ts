import { catalog } from "@/data/catalog";

export type PeptideForm = "pen" | "vial" | "topical" | "other";
export type ApprovalStatus = "research" | "mixed" | "approved";

export type CategoryId =
  | "healing"
  | "growth-hormone"
  | "metabolic"
  | "cognitive"
  | "anti-aging"
  | "immune"
  | "sexual-health"
  | "skin"
  | "other";

export type Peptide = {
  slug: string;
  name: string;
  fullName: string;
  abbreviations: string[];
  description: string;
  categories: CategoryId[];
  researchAreas: string[];
  strength?: string;
  form?: PeptideForm;
  molecularWeightDa?: number;
  sequence?: string;
  /** Standard one-letter chain safe to draw. Omit when the real sequence has unusual residues. */
  structureSequence?: string;
  sequenceNote?: string;
  halfLife?: string;
  notes?: string;
  caution?: string;
  casNumber?: string;
  approvalStatus?: ApprovalStatus;
  productUrl?: string;
  inStock?: boolean;
  /** Anecdotes from public forums. Not a protocol. */
  community?: string;
};

export const CATEGORIES: { id: CategoryId; label: string; short: string }[] = [
  { id: "healing", label: "Healing & recovery", short: "Healing" },
  { id: "growth-hormone", label: "Growth hormone", short: "GH related" },
  { id: "metabolic", label: "Metabolic", short: "Metabolic" },
  { id: "cognitive", label: "Cognitive", short: "Cognitive" },
  { id: "anti-aging", label: "Anti-aging research", short: "Anti-aging" },
  { id: "immune", label: "Immune", short: "Immune" },
  { id: "sexual-health", label: "Sexual health", short: "Sexual" },
  { id: "skin", label: "Skin", short: "Skin" },
  { id: "other", label: "Other", short: "Other" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, (typeof CATEGORIES)[number]>;

export const STATUS_LABEL: Record<ApprovalStatus, string> = {
  research: "Research",
  mixed: "Mixed record",
  approved: "Approved product",
};

export const PEPTIDES: Peptide[] = catalog;

export const PEPTIDE_BY_SLUG = Object.fromEntries(
  PEPTIDES.map((p) => [p.slug, p]),
) as Record<string, Peptide>;

export function getPeptide(slug: string) {
  return PEPTIDE_BY_SLUG[slug];
}

export function relatedPeptides(peptide: Peptide, limit = 3) {
  return PEPTIDES.filter(
    (other) =>
      other.slug !== peptide.slug &&
      other.categories.some((id) => peptide.categories.includes(id)),
  ).slice(0, limit);
}

export function drawableSequence(peptide: Peptide) {
  const raw = (peptide.structureSequence ?? peptide.sequence ?? "").replace(/[^A-Za-z]/g, "");
  if (!raw || !/^[ACDEFGHIKLMNPQRSTVWY]+$/i.test(raw)) return "";
  return raw.toUpperCase();
}

export function searchText(peptide: Peptide) {
  return [
    peptide.name,
    peptide.fullName,
    peptide.abbreviations.join(" "),
    peptide.description,
    peptide.researchAreas.join(" "),
    peptide.notes ?? "",
    peptide.caution ?? "",
    peptide.strength ?? "",
    peptide.form ?? "",
    peptide.casNumber ?? "",
    peptide.community ?? "",
    peptide.sequence ?? "",
    peptide.structureSequence ?? "",
    peptide.categories.map((id) => CATEGORY_MAP[id]?.label ?? id).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function formatMass(value: number) {
  return value >= 10000
    ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export const SHOP_URL = "https://getpeppens.com/?aff=127";

/** Affiliate visit first (`?aff=127`), landing on that exact product. */
export function shopProductUrl(slug: string) {
  return `https://getpeppens.com/product/${slug}/?aff=127`;
}
export const X_URL = "https://x.com/Gavjosie";
export const FACEBOOK_URL = "https://www.facebook.com/Gavjosie";

export const EDUCATIONAL_NOTICE =
  "Educational catalogue only — not medical advice, not a dosing guide, and not a recommendation to buy or use any compound. Many entries are unapproved research chemicals. Talk to a qualified clinician before any health decision.";

export const RESIDUE_GROUPS = [
  {
    id: "hydrophobic",
    label: "Hydrophobic",
    letters: "AVILMFWP",
    className: "bg-accent/20 text-accent-soft",
    color: "#3d9b8f",
  },
  {
    id: "polar",
    label: "Polar",
    letters: "STYNQ",
    className: "bg-surface text-fg",
    color: "#8b949e",
  },
  {
    id: "positive",
    label: "Positive",
    letters: "KRH",
    className: "bg-accent-soft/15 text-accent-soft",
    color: "#5eead4",
  },
  {
    id: "negative",
    label: "Negative",
    letters: "DE",
    className: "bg-warn/15 text-warn",
    color: "#c4a574",
  },
  {
    id: "special",
    label: "Special",
    letters: "GC",
    className: "bg-danger/15 text-danger",
    color: "#c96b62",
  },
] as const;

export function residueGroup(letter: string) {
  const upper = letter.toUpperCase();
  return RESIDUE_GROUPS.find((group) => group.letters.includes(upper)) ?? RESIDUE_GROUPS[1];
}
