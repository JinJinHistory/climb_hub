"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Calendar, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { RouteUpdate } from "@/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function AdminUpdatesListPage() {
  const [updates, setUpdates] = useState<RouteUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<RouteUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterGym, setFilterGym] = useState<string>("all");
  const [gyms, setGyms] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterUpdates();
  }, [updates, searchTerm, filterType, filterGym]);

  const fetchData = async () => {
    try {
      const [updatesData, gymsData] = await Promise.all([
        supabase
          .from("route_updates")
          .select(
            `
            *,
            gym:gyms(*, brand:brands(*))
          `
          )
          .order("update_date", { ascending: false })
          .order("created_at", { ascending: false }),
        supabase.from("gyms").select("*").order("name"),
      ]);

      if (updatesData.data) setUpdates(updatesData.data);
      if (gymsData.data) setGyms(gymsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUpdates = () => {
    let filtered = [...updates];

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (update) =>
          update.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          update.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          update.gym?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터
    if (filterType !== "all") {
      filtered = filtered.filter((update) => update.type === filterType);
    }

    // 암장 필터
    if (filterGym !== "all") {
      filtered = filtered.filter((update) => update.gym_id === filterGym);
    }

    setFilteredUpdates(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말로 이 업데이트를 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("route_updates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("삭제되었습니다.");
      fetchData();
    } catch (error) {
      console.error("Error deleting update:", error);
      alert("삭제 중 오류가 발생했습니다.");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">업데이트 목록</h1>
        <Link
          href="/admin/updates"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />새 업데이트 추가
        </Link>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">모든 타입</option>
            <option value="newset">뉴셋</option>
            <option value="removal">탈거</option>
            <option value="partial_removal">부분탈거</option>
            <option value="announcement">공지</option>
          </select>

          <select
            value={filterGym}
            onChange={(e) => setFilterGym(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">모든 암장</option>
            {gyms.map((gym) => (
              <option key={gym.id} value={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>

          <div className="text-right">
            <span className="text-sm text-gray-600">
              총 {filteredUpdates.length}개의 업데이트
            </span>
          </div>
        </div>
      </div>

      {/* 업데이트 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                날짜
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                암장
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                타입
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                제목/설명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUpdates.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  업데이트가 없습니다
                </td>
              </tr>
            ) : (
              filteredUpdates.map((update) => {
                const typeInfo = getUpdateTypeLabel(update.type);
                return (
                  <tr key={update.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium">
                            {format(new Date(update.update_date), "yyyy-MM-dd")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(update.created_at), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">
                          {update.gym?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {update.gym?.brand?.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {update.title && (
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {update.title}
                          </p>
                        )}
                        {update.description && (
                          <p className="text-sm text-gray-600 truncate">
                            {update.description}
                          </p>
                        )}
                        {update.instagram_post_url && (
                          <a
                            href={update.instagram_post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Instagram 링크
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/updates/edit/${update.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(update.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
