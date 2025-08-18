-- UpdateType enum 값을 대문자로 변경

-- 기존 CHECK 제약조건 제거
ALTER TABLE route_updates DROP CONSTRAINT IF EXISTS route_updates_type_check;

-- 새로운 CHECK 제약조건 추가 (대문자 enum 값)
ALTER TABLE route_updates ADD CONSTRAINT route_updates_type_check 
CHECK (type IN ('NEWSET', 'REMOVAL', 'PARTIAL_REMOVAL', 'ANNOUNCEMENT'));

-- CrawlStatus enum도 확인하여 일관성 유지
ALTER TABLE crawl_logs DROP CONSTRAINT IF EXISTS crawl_logs_status_check;
ALTER TABLE crawl_logs ADD CONSTRAINT crawl_logs_status_check 
CHECK (status IN ('SUCCESS', 'FAILED', 'PARTIAL'));
