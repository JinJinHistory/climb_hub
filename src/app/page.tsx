"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Heart,
  Bell,
} from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_ROUTE_UPDATES } from "@/graphql/queries";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { RouteUpdate } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Toggle from "@/components/ui/toggle";

// 안전한 날짜 포맷팅 함수
const safeFormatDate = (
  dateString: string | null | undefined,
  formatString: string,
  options?: any
) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return format(date, formatString, options);
};

// 타입별 날짜 라벨 및 아이콘 반환
const getDateDisplayInfo = (type: string, updateDate: string) => {
  const fullDate = safeFormatDate(updateDate, "yyyy년 MM월 dd일 (E)", {
    locale: ko,
  });
  const time = safeFormatDate(updateDate, "HH:mm");

  switch (type) {
    case "newset":
      return {
        label: "🆕 뉴셋 일자",
        date: fullDate,
        subtitle: "새로운 루트를 만나보세요!",
        urgency: "normal",
        color: "bg-green-100 text-green-800",
      };
    case "removal":
      return {
        label: "⚠️ 탈거 예정일",
        date: fullDate,
        subtitle: "마지막 기회를 놓치지 마세요!",
        urgency: "high",
        color: "bg-red-100 text-red-800",
      };
    case "partial_removal":
      return {
        label: "🔶 부분 탈거 예정일",
        date: fullDate,
        subtitle: "일부 루트가 탈거됩니다!",
        urgency: "medium",
        color: "bg-orange-100 text-orange-800",
      };
    case "announcement":
      return {
        label: "📢 공지 일자",
        date: fullDate,
        subtitle: "중요한 안내사항입니다",
        urgency: "normal",
        color: "bg-blue-100 text-blue-800",
      };
    default:
      return {
        label: "📅 업데이트 일자",
        date: fullDate || "날짜 없음",
        subtitle: "",
        urgency: "normal",
        color: "bg-gray-100 text-gray-800",
      };
  }
};

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [showOnlyRecent, setShowOnlyRecent] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data, loading, error, refetch } = useQuery(GET_ROUTE_UPDATES, {
    variables: {
      limit: 50,
      type: selectedType,
    },
  });

  const updates = data?.routeUpdates || [];

  const updateTypes = [
    {
      value: null,
      label: "전체",
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    },
    {
      value: "newset",
      label: "뉴셋",
      color: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    {
      value: "removal",
      label: "탈거",
      color: "bg-red-100 text-red-800 hover:bg-red-200",
    },
    {
      value: "partial_removal",
      label: "부분 탈거",
      color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
    {
      value: "announcement",
      label: "공지",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
  ];

  const regions = [
    { value: "all", label: "전체" },
    { value: "seoul", label: "수도권" },
    { value: "non-seoul", label: "비수도권" },
  ];

  const sortOptions = [
    { value: "date", label: "날짜순" },
    { value: "gym", label: "암장순" },
    { value: "type", label: "타입순" },
  ];

  // 필터링된 업데이트 목록
  const filteredUpdates = useMemo(() => {
    let filtered = updates.filter((update: RouteUpdate) => {
      // 검색어 필터
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          update.gym?.name?.toLowerCase().includes(searchLower) ||
          update.gym?.branchName?.toLowerCase().includes(searchLower) ||
          update.title?.toLowerCase().includes(searchLower) ||
          update.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    // 최근 업데이트만 보기
    if (showOnlyRecent) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(
        (update: RouteUpdate) => new Date(update.updateDate) >= weekAgo
      );
    }

    // 정렬
    filtered.sort((a: RouteUpdate, b: RouteUpdate) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
          );
        case "gym":
          return (a.gym?.name || "").localeCompare(b.gym?.name || "");
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [updates, searchTerm, showOnlyRecent, sortBy]);

  const handleRefresh = async () => {
    await refetch();
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // 통계 계산
  const stats = useMemo(() => {
    const totalUpdates = updates.length;
    const newsetCount = updates.filter(
      (u: RouteUpdate) => u.type === "newset"
    ).length;
    const removalCount = updates.filter(
      (u: RouteUpdate) => u.type === "removal"
    ).length;
    const partialRemovalCount = updates.filter(
      (u: RouteUpdate) => u.type === "partial_removal"
    ).length;
    const announcementCount = updates.filter(
      (u: RouteUpdate) => u.type === "announcement"
    ).length;

    return {
      totalUpdates,
      newsetCount,
      removalCount,
      partialRemovalCount,
      announcementCount,
    };
  }, [updates]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Climb Hub</h1>
            <p className="text-gray-600">
              전국 클라이밍 암장의 최신 뉴셋 정보를 한눈에
            </p>
          </div>
          <nav className="flex items-center space-x-6">
            <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
              뉴셋/탈거
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              암장 정보
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalUpdates}
            </div>
            <div className="text-sm text-gray-600">전체 업데이트</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.newsetCount}
            </div>
            <div className="text-sm text-gray-600">뉴셋</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.removalCount}
            </div>
            <div className="text-sm text-gray-600">탈거</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.announcementCount}
            </div>
            <div className="text-sm text-gray-600">공지</div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* 타입 필터 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              업데이트 타입
            </h3>
            <div className="flex flex-wrap gap-2">
              {updateTypes.map((type) => (
                <Button
                  key={type.value || "all"}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={
                    selectedType === type.value ? "bg-blue-600 text-white" : ""
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 검색 및 정렬 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="암장명, 지점명, 제목으로 검색..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">정렬:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <Toggle
                checked={showOnlyRecent}
                onCheckedChange={setShowOnlyRecent}
                label="최근 1주일만 보기"
              />
            </div>
          </div>

          {/* 새로고침 버튼 */}
          <div className="flex justify-end">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              새로고침
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 즐겨찾기된 업데이트 */}
      {favorites.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <h3 className="text-lg font-semibold text-gray-900">
                즐겨찾기한 업데이트
              </h3>
              <span className="text-sm text-gray-500">
                ({favorites.length})
              </span>
            </div>

            <div className="space-y-3">
              {updates
                .filter((update: RouteUpdate) => favorites.includes(update.id))
                .map((update: RouteUpdate) => (
                  <div
                    key={update.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          update.type === "newset"
                            ? "bg-green-100 text-green-800"
                            : update.type === "removal"
                            ? "bg-red-100 text-red-800"
                            : update.type === "partial_removal"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {update.type === "newset"
                          ? "뉴셋"
                          : update.type === "removal"
                          ? "탈거"
                          : update.type === "partial_removal"
                          ? "부분 탈거"
                          : "공지"}
                      </span>
                      <div>
                        <p className="font-medium">
                          {update.gym?.name} {update.gym?.branchName}
                        </p>
                        <p className="text-sm text-gray-600">{update.title}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(update.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 업데이트 목록 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredUpdates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "검색 결과가 없습니다."
                : "아직 등록된 업데이트가 없습니다."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            총 {filteredUpdates.length}개의 업데이트를 찾았습니다.
          </div>

          {filteredUpdates.map((update: RouteUpdate) => {
            const typeInfo = getDateDisplayInfo(update.type, update.updateDate);
            const urgencyClass =
              typeInfo.urgency === "high"
                ? "border-l-4 border-red-500 bg-red-50"
                : "border-l-4 border-gray-200";

            return (
              <Card
                key={update.id}
                className={`hover:shadow-md transition-shadow ${urgencyClass}`}
              >
                <CardContent className="p-6">
                  {/* 상단: 타입, 날짜, 즐겨찾기 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      <time className="text-lg font-semibold text-gray-900">
                        {typeInfo.date}
                      </time>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(update.id)}
                        className={`p-2 rounded-full transition-colors ${
                          favorites.includes(update.id)
                            ? "text-red-500 bg-red-50"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(update.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* 암장 정보 */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-gray-800">
                      <span className="font-semibold text-lg">
                        {update.gym?.brand?.name || "브랜드 미상"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium text-base flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {update.gym?.branchName ||
                          update.gym?.name ||
                          "지점 미상"}
                      </span>
                    </div>
                  </div>

                  {/* 제목 및 설명 */}
                  {update.title && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        🧗‍♀️ {update.title}
                      </span>
                    </div>
                  )}

                  {typeInfo.subtitle && (
                    <div
                      className={`text-sm mb-3 ${
                        typeInfo.urgency === "high"
                          ? "text-red-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {typeInfo.subtitle}
                    </div>
                  )}

                  {update.description && (
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                      {update.description}
                    </p>
                  )}

                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                    <span>
                      업데이트:{" "}
                      {safeFormatDate(update.updateDate, "yyyy/MM/dd HH:mm") ||
                        "--:--"}
                    </span>
                    {update.instagramPostUrl && (
                      <a
                        href={update.instagramPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Instagram에서 보기
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
        <p>&copy; 2025 Climb Hub. 모든 권리 보유.</p>
      </footer>
    </main>
  );
}
