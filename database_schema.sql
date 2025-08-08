-- Climb Hub Database Schema
-- PostgreSQL 테이블 생성 스크립트

-- 데이터베이스 생성 (필요시)
-- CREATE DATABASE climb_hub;

-- brands 테이블
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- gyms 테이블
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    instagram_url TEXT,
    instagram_handle VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- route_updates 테이블
CREATE TABLE IF NOT EXISTS route_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('newset', 'removal', 'partial_removal', 'announcement')),
    update_date DATE NOT NULL,
    title VARCHAR(500),
    description TEXT,
    instagram_post_url TEXT,
    instagram_post_id VARCHAR(255),
    image_urls TEXT[], -- 배열로 저장
    raw_caption TEXT,
    parsed_data JSONB,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- crawl_logs 테이블
CREATE TABLE IF NOT EXISTS crawl_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    posts_found INTEGER NOT NULL DEFAULT 0,
    posts_new INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gyms_brand_id ON gyms(brand_id);
CREATE INDEX IF NOT EXISTS idx_gyms_is_active ON gyms(is_active);
CREATE INDEX IF NOT EXISTS idx_route_updates_gym_id ON route_updates(gym_id);
CREATE INDEX IF NOT EXISTS idx_route_updates_type ON route_updates(type);
CREATE INDEX IF NOT EXISTS idx_route_updates_update_date ON route_updates(update_date);
CREATE INDEX IF NOT EXISTS idx_crawl_logs_gym_id ON crawl_logs(gym_id);
CREATE INDEX IF NOT EXISTS idx_crawl_logs_status ON crawl_logs(status);

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON gyms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_route_updates_updated_at BEFORE UPDATE ON route_updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 (선택사항)
INSERT INTO brands (name, logo_url, website_url) VALUES
('클라이밍존', 'https://example.com/logo1.png', 'https://climbingzone.com'),
('더클라이밍', 'https://example.com/logo2.png', 'https://theclimbing.com')
ON CONFLICT DO NOTHING;

INSERT INTO gyms (brand_id, name, branch_name, instagram_handle, is_active) VALUES
((SELECT id FROM brands WHERE name = '클라이밍존' LIMIT 1), '클라이밍존 강남점', '강남점', 'climbingzone_gangnam', true),
((SELECT id FROM brands WHERE name = '더클라이밍' LIMIT 1), '더클라이밍 홍대점', '홍대점', 'theclimbing_hongdae', true)
ON CONFLICT DO NOTHING; 