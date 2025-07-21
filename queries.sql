/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users 
SET nickname = 'test',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;


/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.image_url,
    p.status,
    p.view_count,
    p.created_at,
    c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.user_id = 1
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
*/
SELECT COUNT(*) AS total_count
FROM products
WHERE user_id = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.image_url,
    p.status,
    p.view_count,
    p.created_at,
    c.name AS category_name,
    u.nickname AS seller_nickname
FROM product_likes pl
INNER JOIN products p ON pl.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON p.user_id = u.id
WHERE pl.user_id = 1
ORDER BY pl.created_at DESC
LIMIT 10 OFFSET 20;


/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT COUNT(*) AS total_liked_products
FROM product_likes
WHERE user_id = 1;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (
    user_id,
    category_id,
    title,
    description,
    price,
    image_url,
    status
) VALUES (
    1,
    2,
    '아이패드 프로 11인치 판매합니다',
    '작년에 구매했고 사용감 거의 없습니다. 박스 및 충전기 모두 포함입니다.',
    850000,
    'https://example.com/images/ipad-pro.jpg',
    '판매중'
);


/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.image_url,
    p.status,
    p.view_count,
    p.created_at,
    c.name AS category_name,
    u.nickname AS seller_nickname,
    COUNT(DISTINCT pl.id) AS like_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN product_likes pl ON p.id = pl.product_id
WHERE p.title LIKE '%test%' OR p.description LIKE '%test%'
GROUP BY p.id, c.name, u.nickname
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.image_url,
    p.status,
    p.view_count,
    p.created_at,
    p.updated_at,
    c.name AS category_name,
    u.id AS seller_id,
    u.nickname AS seller_nickname,
    u.email AS seller_email,
    COUNT(DISTINCT pl.id) AS like_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN product_likes pl ON p.id = pl.product_id
WHERE p.id = 1
GROUP BY p.id, c.name, u.id, u.nickname, u.email;


/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE products
SET 
    title = '아이패드 프로 11인치 급처합니다',
    description = '작년에 구매했고 사용감 거의 없습니다. 박스 및 충전기 모두 포함입니다. 가격 내렸습니다!',
    price = 800000,
    status = '판매중',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE id = 1;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_likes (user_id, product_id)
VALUES (1, 2)
ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP;


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_likes
WHERE user_id = 1 AND product_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO product_comments (user_id, product_id, content)
VALUES (1, 2, '상품 상태가 정말 좋네요! 구매 고려중입니다.');


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT 
    pc.id,
    pc.content,
    pc.created_at,
    pc.updated_at,
    u.id AS user_id,
    u.nickname AS user_nickname
FROM product_comments pc
INNER JOIN users u ON pc.user_id = u.id
WHERE pc.product_id = 1 
  AND pc.created_at < '2025-03-25 00:00:00'
ORDER BY pc.created_at DESC
LIMIT 10;