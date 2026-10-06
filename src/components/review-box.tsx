import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PEPTIDES } from "@/lib/peptides";
import { addReview, listReviews, type Review } from "@/lib/reviews.functions";

const fieldClass =
  "flex w-full rounded-md bg-surface px-3 text-sm text-fg ring-1 ring-border transition-shadow duration-200 placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

function productOption(peptide: (typeof PEPTIDES)[number]) {
  return [peptide.name, peptide.strength, peptide.form === "pen" ? "pen" : peptide.form === "vial" ? "vial" : ""]
    .filter(Boolean)
    .join(" · ");
}

function when(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function compressPicture(file: File) {
  return new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxSide = 960;
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read that picture."));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      let quality = 0.72;
      let data = canvas.toDataURL("image/jpeg", quality);
      while (data.length > 180000 && quality > 0.42) {
        quality -= 0.1;
        data = canvas.toDataURL("image/jpeg", quality);
      }
      if (data.length > 220000) {
        reject(new Error("That picture is too large."));
        return;
      }
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that picture."));
    };
    img.src = url;
  });
}

export function ReviewBox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancel = false;
    listReviews()
      .then((rows) => {
        if (!cancel) setReviews(rows);
      })
      .catch(() => {
        if (!cancel) setError("Reviews could not load. You can still try posting one.");
      })
      .finally(() => {
        if (!cancel) setLoaded(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  async function onPicture(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a picture.");
      return;
    }
    setError("");
    try {
      setImage(await compressPicture(file));
    } catch (err) {
      setImage(null);
      setError(err instanceof Error ? err.message : "Could not read that picture.");
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const created = await addReview({ data: { productSlug: slug, body, image } });
      setReviews((current) => [created, ...current]);
      setBody("");
      setImage(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not post that review.";
      setError(message.replace(/^.*Error:\s*/, "") || "Could not post that review.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-bg-elevated p-4 ring-1 ring-border sm:p-5">
      <div>
        <h2 className="font-display text-3xl tracking-tight text-fg">Reviews</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          No account. Every review is posted as Anonymous. A picture is optional.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1.5 text-xs font-medium tracking-widest text-subtle uppercase">
          Name
          <Input value="Anonymous" readOnly aria-readonly="true" className="text-muted" />
        </label>
        <label className="grid gap-1.5 text-xs font-medium tracking-widest text-subtle uppercase">
          Product
          <select
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
            className={`${fieldClass} h-11`}
          >
            <option value="">Choose a product</option>
            {PEPTIDES.map((peptide) => (
              <option key={peptide.slug} value={peptide.slug}>
                {productOption(peptide)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-xs font-medium tracking-widest text-subtle uppercase">
          Review
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={800}
            required
            rows={4}
            placeholder="What do you want to say about it?"
            className={`${fieldClass} min-h-28 resize-y py-3 leading-relaxed`}
          />
        </label>
        <div className="grid gap-2">
          <label className="grid gap-1.5 text-xs font-medium tracking-widest text-subtle uppercase">
            Picture
            <input
              type="file"
              accept="image/*"
              onChange={onPicture}
              className={`${fieldClass} h-11 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-bg-elevated file:px-3 file:py-1 file:text-sm file:font-medium file:text-fg`}
            />
          </label>
          {image && (
            <div className="flex items-center gap-3">
              <img src={image} alt="" className="h-20 w-20 rounded-lg object-cover ring-1 ring-border" />
              <Button type="button" variant="ghost" onClick={() => setImage(null)}>
                Remove picture
              </Button>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={pending} className="w-full sm:w-fit">
          {pending ? "Posting…" : "Post review"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {!loaded && <p className="text-sm text-muted">Loading reviews…</p>}
        {loaded && reviews.length === 0 && <p className="text-sm text-muted">No reviews yet. Be the first.</p>}
        {reviews.map((review) => (
          <article key={review.id} className="rounded-xl bg-surface px-4 py-3 ring-1 ring-border">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="font-medium text-fg">Anonymous</p>
              <p className="text-xs text-subtle">{when(review.createdAt)}</p>
            </div>
            <p className="mt-1 text-xs font-medium tracking-wide text-accent-soft uppercase">{review.productName}</p>
            {review.image && (
              <img
                src={review.image}
                alt=""
                className="mt-3 max-h-72 w-full rounded-lg object-cover ring-1 ring-border"
              />
            )}
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted">{review.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
