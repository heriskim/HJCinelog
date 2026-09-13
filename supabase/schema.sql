-- Supabase 대시보드 > SQL Editor에서 실행하세요.
-- 감상평(reviews) 테이블 + RLS 정책, review-images Storage 버킷 + 정책

-- 1) reviews 테이블
create table public.reviews (
  id text not null,                             -- YYMMDD00001 형식, 사용자별로 독립된 시퀀스
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (user_id, id),
  title text not null check (char_length(title) <= 30),
  rating numeric(2,1) not null check (rating between 1 and 5 and mod(rating * 10, 5) = 0),
  review text not null check (char_length(review) <= 2000),
  one_liner text not null check (char_length(one_liner) <= 100),
  image_path text,                              -- Storage 버킷 내 경로 (user_id/review_id.ext)
  created_at date not null default current_date
);

create index reviews_user_id_idx on public.reviews(user_id);

-- 2) RLS 활성화 + 본인 데이터만 접근 가능하도록 정책 설정
alter table public.reviews enable row level security;

create policy "select_own_reviews" on public.reviews
  for select using (auth.uid() = user_id);

create policy "insert_own_reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "update_own_reviews" on public.reviews
  for update using (auth.uid() = user_id);

create policy "delete_own_reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- 3) Storage 버킷 (Dashboard의 Storage 메뉴에서 만들거나 아래 SQL로 생성)
insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', false);

-- 4) Storage 정책: 본인 폴더(user_id/...)에만 업로드/조회/삭제 가능
create policy "select_own_images" on storage.objects
  for select using (
    bucket_id = 'review-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "insert_own_images" on storage.objects
  for insert with check (
    bucket_id = 'review-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "delete_own_images" on storage.objects
  for delete using (
    bucket_id = 'review-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
