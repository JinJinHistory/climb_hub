"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, TrendingUp, MapPin, Clock } from "lucide-react";
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

interface Stats {
  totalGyms: number;
  totalUpdates: number;
  todayUpdates: number;
  thisWeekUpdates: number;
}

interface RecentUpdate {
  id: string;
  gym: { name: string; branchName: string };
  type: string;
  updateDate: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data, loading, error } = useQuery(GET_ROUTE_UPDATES, {
    variables: {
      limit: 100, // 충분한 데이터를 가져오기 위해 큰 값 설정
    },
  });

  // 통계 계산
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const updates = data?.routeUpdates || [];
  const recentUpdates = updates.slice(0, 5);

  const todayUpdates = updates.filter(
    (update: RouteUpdate) => new Date(update.createdAt) >= today
  ).length;

  const thisWeekUpdates = updates.filter(
    (update: RouteUpdate) => new Date(update.createdAt) >= weekAgo
  ).length;

  const stats = {
    totalGyms: 0, // TODO: 별도 쿼리로 가져오기
    totalUpdates: updates.length,
    todayUpdates,
    thisWeekUpdates,
  };

  const getUpdateTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      newset: { label: "뉴셋", color: "bg-green-100 text-green-800" },
      removal: { label: "탈거", color: "bg-red-100 text-red-800" },
      announcement: { label: "공지", color: "bg-blue-100 text-blue-800" },
    };
    return types[type] || { label: type, color: "bg-gray-100 text-gray-800" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-2">Climb Hub 콘텐츠 관리 시스템</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 암장</p>
              <p className="text-2xl font-bold">{stats.totalGyms}</p>
            </div>
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 업데이트</p>
              <p className="text-2xl font-bold">{stats.totalUpdates}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">오늘 업데이트</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.todayUpdates}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">이번 주</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.thisWeekUpdates}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/admin/updates" className="block">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 text-white rounded-full p-3">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">새 업데이트 추가</h3>
                <p className="text-gray-600">
                  뉴셋, 탈거 정보를 수동으로 입력합니다
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/gyms" className="block">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white rounded-full p-3">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">암장 관리</h3>
                <p className="text-gray-600">
                  암장 정보를 추가하거나 수정합니다
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 최근 업데이트 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">최근 업데이트</h2>
        </div>
        <div className="divide-y">
          {recentUpdates.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              등록된 업데이트가 없습니다. 새 업데이트를 추가해보세요!
            </div>
          ) : (
            recentUpdates.map((update: RouteUpdate) => {
              const typeInfo = getUpdateTypeLabel(update.type);
              return (
                <div key={update.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      <div>
                        <p className="font-medium">{update.gym?.name}</p>
                        <p className="text-sm text-gray-600">
                          {update.type === "newset" && "뉴셋 일자: "}
                          {update.type === "removal" && "탈거 예정일: "}
                          {update.type === "partial_removal" &&
                            "부분 탈거 예정일: "}
                          {update.type === "announcement" && "공지 일자: "}
                          {safeFormatDate(
                            update.updateDate,
                            "yyyy년 MM월 dd일 (E)",
                            {
                              locale: ko,
                            }
                          ) || "날짜 없음"}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      작성:{" "}
                      {safeFormatDate(update.createdAt, "yyyy/MM/dd HH:mm") ||
                        "생성일 없음"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
