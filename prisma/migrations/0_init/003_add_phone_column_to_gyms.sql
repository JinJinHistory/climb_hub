-- Migration: 003_add_phone_column_to_gyms
-- Description: Add phone column to gyms table for contact information
-- Created: 2024-01-02

-- gyms 테이블에 phone 컬럼 추가 (이미 존재하므로 실제로는 실행되지 않음)
-- ALTER TABLE gyms ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- 기존 데이터에 전화번호 업데이트 (예시)
-- UPDATE gyms SET phone = '02-1234-5678' WHERE name = '클라이밍존 강남점';
-- UPDATE gyms SET phone = '02-2345-6789' WHERE name = '클라이밍존 홍대점';
-- UPDATE gyms SET phone = '02-3456-7890' WHERE name = '더클라이밍 신촌점';
-- UPDATE gyms SET phone = '02-4567-8901' WHERE name = '클라이밍파크 잠실점'; 