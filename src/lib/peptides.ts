import catalog from "@/data/peptides.json";

export type PeptideForm = "pen" | "vial";
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
  formula?: string;
  sequence?: string;
  structureSequence?: string;
  sequenceNote?: string;
  halfLife?: string;
  researchRanges?: string;
  notes?: string;
  casNumber?: string;
  communityUse?: string;
  approvalStatus?: ApprovalStatus;
  pubchemCid?: number;
};

export const CATEGORIES: { id: CategoryId; label: string; short: string }[] = [
  { id: "healing", label: "Healing & Recovery", short: "Healing" },
  { id: "growth-hormone", label: "Growth Hormone", short: "GH related" },
  { id: "metabolic", label: "Weight Loss / Metabolic", short: "Metabolic" },
  { id: "cognitive", label: "Cognitive / Nootropic", short: "Cognitive" },
  { id: "anti-aging", label: "Anti-aging", short: "Anti-aging" },
  { id: "immune", label: "Immune", short: "Immune" },
  { id: "sexual-health", label: "Sexual Health", short: "Sexual" },
  { id: "skin", label: "Skin & Beauty", short: "Skin" },
  { id: "other", label: "Other", short: "Other" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, (typeof CATEGORIES)[number]>;

export const PEPTIDES = catalog as Peptide[];

export const PEPTIDE_BY_SLUG = Object.fromEntries(
  PEPTIDES.map((p) => [p.slug, p]),
) as Record<string, Peptide>;

export function getPeptide(slug: string) {
  return PEPTIDE_BY_SLUG[slug];
}

export function searchText(peptide: Peptide) {
  return [
    peptide.name,
    peptide.fullName,
    peptide.abbreviations.join(" "),
    peptide.description,
    peptide.researchAreas.join(" "),
    peptide.notes ?? "",
    peptide.communityUse ?? "",
    peptide.strength ?? "",
    peptide.form ?? "",
    peptide.casNumber ?? "",
    peptide.sequence ?? "",
    peptide.structureSequence ?? "",
    peptide.categories.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function formatMass(value: number) {
  return value >= 10000
    ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export const SHOP_URL = "https://getpptidepen.com/?aff=127";

export const EDUCATIONAL_NOTICE =
  "This app is for educational and research purposes only. It is not medical advice. Peptides may be unregulated in many places. Always consult a qualified professional.";

export const X_URL = "https://x.com/Gavjosie";
export const FACEBOOK_URL = "https://www.facebook.com/Gavjosie";
