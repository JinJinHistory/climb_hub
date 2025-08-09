-- 중복 방지를 위한 UNIQUE 제약조건 추가

-- 브랜드명 중복 방지
ALTER TABLE brands ADD CONSTRAINT unique_brand_name UNIQUE (name);

-- 같은 브랜드 내에서 지점명 중복 방지
ALTER TABLE gyms ADD CONSTRAINT unique_brand_branch UNIQUE (brand_id, branch_name);

-- 전체 암장명 중복 방지 (선택사항 - 필요시 주석 해제)
-- ALTER TABLE gyms ADD CONSTRAINT unique_gym_name UNIQUE (name);

-- 인스타그램 핸들 중복 방지 (빈 값 제외)
CREATE UNIQUE INDEX unique_instagram_handle ON gyms (instagram_handle) 
WHERE instagram_handle IS NOT NULL AND instagram_handle != '';
