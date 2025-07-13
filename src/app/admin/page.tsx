"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, TrendingUp, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Stats {
  totalGyms: number;
  totalUpdates: number;
  todayUpdates: number;
  thisWeekUpdates: number;
}

interface RecentUpdate {
  id: string;
  gym: { name: string; branch_name: string };
  type: string;
  update_date: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalGyms: 0,
    totalUpdates: 0,
    todayUpdates: 0,
    thisWeekUpdates: 0,
  });
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 통계 데이터 가져오기
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [gymsCount, updatesCount, todayCount, weekCount, recent] =
        await Promise.all([
          // 전체 암장 수
          supabase
            .from("gyms")
            .select("id", { count: "exact" })
            .eq("is_active", true),

          // 전체 업데이트 수
          supabase.from("route_updates").select("id", { count: "exact" }),

          // 오늘 업데이트 수
          supabase
            .from("route_updates")
            .select("id", { count: "exact" })
            .gte("created_at", format(today, "yyyy-MM-dd")),

          // 이번 주 업데이트 수
          supabase
            .from("route_updates")
            .select("id", { count: "exact" })
            .gte("created_at", format(weekAgo, "yyyy-MM-dd")),

          // 최근 업데이트
          supabase
            .from("route_updates")
            .select(
              `
            id,
            type,
            update_date,
            created_at,
            gym:gyms(name, branch_name)
          `
            )
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

      setStats({
        totalGyms: gymsCount.count || 0,
        totalUpdates: updatesCount.count || 0,
        todayUpdates: todayCount.count || 0,
        thisWeekUpdates: weekCount.count || 0,
      });

      if (recent.data) {
        setRecentUpdates(recent.data as any);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUpdateTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      newset: { label: "뉴셋", color: "bg-green-100 text-green-800" },
      removal: { label: "탈거", color: "bg-red-100 text-red-800" },
      partial_removal: {
        label: "부분탈거",
        color: "bg-orange-100 text-orange-800",
      },
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
              아직 업데이트가 없습니다
            </div>
          ) : (
            recentUpdates.map((update) => {
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
                          {format(new Date(update.update_date), "M월 d일 (E)", {
                            locale: ko,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(update.created_at), "yyyy-MM-dd HH:mm")}
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
