"use client";

import { useState } from "react";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_ROUTE_UPDATES } from "@/graphql/queries";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_ROUTE_UPDATES, {
    variables: {
      limit: 20,
      type: selectedType,
    },
  });

  const updates = data?.routeUpdates || [];

  const updateTypes = [
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
      label: "부분탈거",
      color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
    {
      value: "announcement",
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
              key={type.value}
              onClick={() =>
                setSelectedType(selectedType === type.value ? null : type.value)
              }
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
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
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
          {filteredUpdates.map((update) => {
            const typeInfo = getUpdateTypeLabel(update.type);
            return (
              <article
                key={update.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}
                    >
                      {typeInfo.label}
                    </span>
                    <h3 className="font-semibold text-lg">
                      {update.gym?.name || "알 수 없는 암장"}
                    </h3>
                  </div>
                  <time className="text-sm text-gray-500">
                    {format(new Date(update.update_date), "M월 d일 (E)", {
                      locale: ko,
                    })}
                  </time>
                </div>

                {update.title && (
                  <h4 className="font-medium text-gray-900 mb-2">
                    {update.title}
                  </h4>
                )}

                {update.description && (
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {update.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {update.gym?.branch_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(update.created_at), "HH:mm")}
                    </span>
                  </div>
                  {update.instagram_post_url && (
                    <a
                      href={update.instagram_post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Instagram에서 보기
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
