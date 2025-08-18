-- 타입별 구체적인 날짜 필드 추가

-- 탈거 관련 날짜들
ALTER TABLE route_updates ADD COLUMN removal_date DATE;
ALTER TABLE route_updates ADD COLUMN removal_start_time TIME;

-- 뉴셋 관련 날짜들  
ALTER TABLE route_updates ADD COLUMN newset_date DATE;
ALTER TABLE route_updates ADD COLUMN newset_opening_time TIME;

-- 부분탈거 관련 날짜들
ALTER TABLE route_updates ADD COLUMN partial_removal_date DATE;
ALTER TABLE route_updates ADD COLUMN partial_removal_start_time TIME;

-- 공지 관련 날짜들
ALTER TABLE route_updates ADD COLUMN announcement_date DATE;
ALTER TABLE route_updates ADD COLUMN announcement_valid_until DATE;

-- 기존 update_date는 유지하되, 메인 날짜로 사용
-- 타입별 구체적인 날짜가 있으면 우선 표시

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_route_updates_removal_date ON route_updates(removal_date);
CREATE INDEX IF NOT EXISTS idx_route_updates_newset_date ON route_updates(newset_date);
CREATE INDEX IF NOT EXISTS idx_route_updates_announcement_date ON route_updates(announcement_date);
