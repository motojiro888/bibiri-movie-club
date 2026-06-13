/**
 * URLSearchParamsからフィルタ条件を取り出してreviewsを絞り込む
 * @param {Array} reviews
 * @param {URLSearchParams} params
 * @returns {Array}
 */
export function filterReviews(reviews, params) {
  let result = [...reviews];

  // ジャンルフィルタ（部分一致）
  const genre = params.get('genre');
  if (genre) {
    result = result.filter(r => r.genres?.includes(genre));
  }

  // びっくり度（以上）
  const bikkuri = params.get('bikkuri');
  if (bikkuri) {
    result = result.filter(r => r.bikkuri >= Number(bikkuri));
  }

  // グロ度（以上）
  const guro = params.get('guro');
  if (guro) {
    result = result.filter(r => r.guro >= Number(guro));
  }

  // 動物の安否
  const animal = params.get('animal');
  if (animal) {
    result = result.filter(r => r.animal === animal);
  }

  // 難易度
  const difficulty = params.get('difficulty');
  if (difficulty) {
    result = result.filter(r => r.difficulty === difficulty);
  }

  // ── 将来追加する場合はここに足すだけ ──
  // const q = params.get('q');
  // if (q) {
  //   result = result.filter(r =>
  //     r.title.includes(q) || r.verdict?.includes(q)
  //   );
  // }

  return result;
}