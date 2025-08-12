"use client";

import { useState } from "react";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_ROUTE_UPDATES } from "@/graphql/queries";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { RouteUpdate } from "@/types";

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
    case "NEWSET":
      return {
        label: "🆕 뉴셋 일자",
        date: fullDate,
        subtitle: "새로운 루트를 만나보세요!",
        urgency: "normal",
      };
    case "REMOVAL":
      return {
        label: "⚠️ 탈거 예정일",
        date: fullDate,
        subtitle: "마지막 기회를 놓치지 마세요!",
        urgency: "high",
      };

    case "ANNOUNCEMENT":
      return {
        label: "📢 공지 일자",
        date: fullDate,
        subtitle: "중요한 안내사항입니다",
        urgency: "normal",
      };
    default:
      return {
        label: "📅 업데이트 일자",
        date: fullDate || "날짜 없음",
        subtitle: "",
        urgency: "normal",
      };
  }
};

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null); // 기본값: 전체

  const { data, loading, error, refetch } = useQuery(GET_ROUTE_UPDATES, {
    variables: {
      limit: 20,
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
      value: "NEWSET",
      label: "뉴셋",
      color: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    {
      value: "REMOVAL",
      label: "탈거",
      color: "bg-red-100 text-red-800 hover:bg-red-200",
    },
    {
      value: "ANNOUNCEMENT",
      label: "공지",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
  ];

  const handleRefresh = async () => {
    await refetch();
  };

  const getUpdateTypeLabel = (type: string) => {
    const typeInfo = updateTypes.find((t) => t.value === type);
    if (typeInfo) {
      return {
        label: typeInfo.label,
        color: typeInfo.color.split(" ").slice(0, 2).join(" "),
      };
    }
    return { label: type, color: "bg-gray-100 text-gray-800" };
  };

  const filteredUpdates = updates;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Climb Hub</h1>
        <p className="text-gray-600">
          전국 클라이밍 암장의 최신 뉴셋 정보를 한눈에
        </p>
      </header>

      {/* Filter and Refresh Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {updateTypes.map((type) => (
            <button
              key={type.value || "all"}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  selectedType === type.value
                    ? type.color
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      {/* Updates List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredUpdates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">
            {selectedType
              ? "선택한 카테고리의 업데이트가 없습니다."
              : "아직 등록된 업데이트가 없습니다."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update: RouteUpdate) => {
            const typeInfo = getUpdateTypeLabel(update.type);
            const dateInfo = getDateDisplayInfo(update.type, update.updateDate);
            const urgencyClass =
              dateInfo.urgency === "high"
                ? "border-l-4 border-red-500 bg-red-50"
                : "border-l-4 border-gray-200";

            return (
              <article
                key={update.id}
                className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${urgencyClass}`}
              >
                {/* 1. 타입 & 2. 업데이트 날짜 (최상단, 가장 중요) */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${typeInfo.color}`}
                    >
                      {typeInfo.label}
                    </span>
                    <time className="text-lg font-semibold text-gray-900">
                      {dateInfo.date}
                    </time>
                  </div>
                  {/* 6. 인스타 링크 (우측 상단) */}
                  {update.instagramPostUrl && (
                    <a
                      href={update.instagramPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Instagram에서 보기
                    </a>
                  )}
                </div>

                {/* 3. 브랜드 & 4. 지점 (두 번째 줄) */}
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

                {/* 5. 벽(섹터) - title 필드 활용 */}
                {update.title && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      🧗‍♀️ {update.title}
                    </span>
                  </div>
                )}

                {/* 부가 정보 */}
                {dateInfo.subtitle && (
                  <div
                    className={`text-sm mb-3 ${
                      dateInfo.urgency === "high"
                        ? "text-red-700 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {dateInfo.subtitle}
                  </div>
                )}

                {update.description && (
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {update.description}
                  </p>
                )}

                {/* 작성일자 (하단) */}
                <div className="text-xs text-gray-400 mt-4">
                  작성:{" "}
                  {safeFormatDate(update.createdAt, "yyyy/MM/dd") || "--:--"}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
