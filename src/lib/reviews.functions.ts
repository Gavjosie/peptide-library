import { createServerFn } from "@tanstack/react-start";
import { getPeptide } from "@/lib/peptides";

export type Review = {
  id: number;
  authorName: string;
  productSlug: string;
  productName: string;
  body: string;
  image: string | null;
  createdAt: string;
};

type ReviewRow = {
  id: number;
  author_name: string;
  product_slug: string;
  product_name: string;
  body: string;
  image_data: string | null;
  created_at: string;
};

const SELECT = `id, author_name, product_slug, product_name, body, image_data,
  to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at`;

function mapRow(row: ReviewRow): Review {
  return {
    id: Number(row.id),
    authorName: row.author_name,
    productSlug: row.product_slug,
    productName: row.product_name,
    body: row.body,
    image: row.image_data,
    createdAt: row.created_at,
  };
}

function cleanImage(value: unknown) {
  if (value == null || value === "") return null;
  if (typeof value !== "string") throw new Error("That picture could not be saved.");
  const image = value.trim();
  if (image.length > 220000) throw new Error("That picture is too large.");
  if (!/^data:image\/jpeg;base64,[a-z0-9+/]+={0,2}$/i.test(image)) {
    throw new Error("Use a photo.");
  }
  return image;
}

function cleanLine(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export const listReviews = createServerFn({ method: "GET" }).handler(async (): Promise<Review[]> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const listed = await sql.query<ReviewRow>(
      `select ${SELECT} from reviews order by id desc limit 80`,
    );
    return listed.map(mapRow);
  });

export const addReview = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    const authorName = "Anonymous";
    const productSlug = typeof raw.productSlug === "string" ? raw.productSlug.slice(0, 120) : "";
    const body = typeof raw.body === "string" ? raw.body.replace(/\r/g, "").trim().slice(0, 800) : "";
    const image = cleanImage(raw.image);
    const product = getPeptide(productSlug);
    if (!product) throw new Error("Pick a product.");
    if (body.length < 2) throw new Error("Write a review.");
    const productName = [product.name, product.strength].filter(Boolean).join(" · ");
    return { authorName, productSlug, productName, body, image };
  })
  .handler(async ({ data }): Promise<Review> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<ReviewRow>(
      `insert into reviews (author_name, product_slug, product_name, body, image_data)
       values ($1, $2, $3, $4, $5)
       returning ${SELECT}`,
      [data.authorName, data.productSlug, data.productName, data.body, data.image],
    );
    const row = rows[0];
    if (!row) throw new Error("Could not save that review.");
    return mapRow(row);
  });
