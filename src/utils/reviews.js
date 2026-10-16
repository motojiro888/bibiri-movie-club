import { getCollection } from 'astro:content';

/**
 * 全レビューを sortOrder 順の配列で返す（各要素は { id, ...YAMLの中身 }）
 * @returns {Promise<Array>}
 */
export async function getReviews() {
  const entries = await getCollection('reviews');
  const reviews = entries
    .map(entry => ({ id: entry.id, ...entry.data }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // sortOrder の重複は並び順が不定になるのでビルドを止める
  const seen = new Map();
  for (const r of reviews) {
    if (seen.has(r.sortOrder)) {
      throw new Error(`sortOrder ${r.sortOrder} が ${seen.get(r.sortOrder)} と ${r.id} で重複しています`);
    }
    seen.set(r.sortOrder, r.id);
  }

  return reviews;
}
