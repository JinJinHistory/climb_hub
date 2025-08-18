-- Migration: 002_add_sample_data
-- Description: Add sample data for development
-- Created: 2024-01-01

-- 샘플 브랜드 데이터 삽입
INSERT INTO brands (name, logo_url, website_url) VALUES
('클라이밍존', 'https://example.com/logo1.png', 'https://climbingzone.com'),
('더클라이밍', 'https://example.com/logo2.png', 'https://theclimbing.com'),
('클라이밍파크', 'https://example.com/logo3.png', 'https://climbingpark.com')
ON CONFLICT DO NOTHING;

-- 샘플 암장 데이터 삽입
INSERT INTO gyms (brand_id, name, branch_name, instagram_handle, address, is_active) VALUES
((SELECT id FROM brands WHERE name = '클라이밍존' LIMIT 1), '클라이밍존 강남점', '강남점', 'climbingzone_gangnam', '서울 강남구 테헤란로 123', true),
((SELECT id FROM brands WHERE name = '클라이밍존' LIMIT 1), '클라이밍존 홍대점', '홍대점', 'climbingzone_hongdae', '서울 마포구 홍대로 456', true),
((SELECT id FROM brands WHERE name = '더클라이밍' LIMIT 1), '더클라이밍 신촌점', '신촌점', 'theclimbing_sinchon', '서울 서대문구 연세로 789', true),
((SELECT id FROM brands WHERE name = '클라이밍파크' LIMIT 1), '클라이밍파크 잠실점', '잠실점', 'climbingpark_jamsil', '서울 송파구 올림픽로 321', true)
ON CONFLICT DO NOTHING; 