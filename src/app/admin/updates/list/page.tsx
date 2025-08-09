"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Calendar, Search } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ROUTE_UPDATES, GET_ALL_GYMS } from "@/graphql/queries";
import { DELETE_ROUTE_UPDATE } from "@/graphql/mutations";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

export default function AdminUpdatesListPage() {
  const [filteredUpdates, setFilteredUpdates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterGym, setFilterGym] = useState<string>("all");

  // 업데이트 목록 가져오기
  const {
    data: updatesData,
    loading: updatesLoading,
    refetch: refetchUpdates,
  } = useQuery(GET_ROUTE_UPDATES, {
    variables: {
      limit: 1000, // 충분한 데이터를 가져오기 위해 큰 값 설정
    },
  });

  // 암장 목록 가져오기
  const { data: gymsData, loading: gymsLoading } = useQuery(GET_ALL_GYMS, {
    variables: { activeOnly: true },
  });

  // 업데이트 삭제 뮤테이션
  const [deleteRouteUpdate] = useMutation(DELETE_ROUTE_UPDATE);

  const updates = updatesData?.routeUpdates || [];
  const gyms = gymsData?.gyms || [];

  useEffect(() => {
    filterUpdates();
  }, [updates, searchTerm, filterType, filterGym]);

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
      filtered = filtered.filter((update) => update.gymId === filterGym);
    }

    setFilteredUpdates(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말로 이 업데이트를 삭제하시겠습니까?")) return;

    try {
      await deleteRouteUpdate({
        variables: { id },
      });

      alert("삭제되었습니다.");
      refetchUpdates();
    } catch (error: any) {
      console.error("Error deleting update:", error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const getUpdateTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      NEWSET: { label: "뉴셋", color: "bg-green-100 text-green-800" },
      REMOVAL: { label: "탈거", color: "bg-red-100 text-red-800" },

      ANNOUNCEMENT: { label: "공지", color: "bg-blue-100 text-blue-800" },
    };
    return types[type] || { label: type, color: "bg-gray-100 text-gray-800" };
  };

  if (updatesLoading || gymsLoading) {
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
            <option value="NEWSET">뉴셋</option>
            <option value="REMOVAL">탈거</option>

            <option value="ANNOUNCEMENT">공지</option>
          </select>

          <select
            value={filterGym}
            onChange={(e) => setFilterGym(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">모든 암장</option>
            {gyms.map((gym: any) => (
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
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                업데이트일
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
                  {updates.length === 0
                    ? "등록된 업데이트가 없습니다. 새 업데이트를 추가해보세요!"
                    : "조건에 맞는 업데이트가 없습니다. 필터를 조정해보세요."}
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
                            {safeFormatDate(update.createdAt, "yyyy-MM-dd") ||
                              "날짜 없음"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {safeFormatDate(update.createdAt, "HH:mm") ||
                              "--:--"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-sm font-medium">
                          {safeFormatDate(update.updateDate, "yyyy-MM-dd") ||
                            "날짜 없음"}
                        </p>
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
                        {update.instagramPostUrl && (
                          <a
                            href={update.instagramPostUrl}
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
