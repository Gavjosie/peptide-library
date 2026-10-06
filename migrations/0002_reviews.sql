create table if not exists reviews (
  id           serial primary key,
  author_name  text not null,
  product_slug text not null,
  product_name text not null,
  body         text not null,
  created_at   timestamptz not null default now()
);

create index if not exists reviews_created_idx on reviews (id desc);
create index if not exists reviews_product_idx on reviews (product_slug);
