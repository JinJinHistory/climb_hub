"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_GYMS } from "@/graphql/queries";
import { CREATE_ROUTE_UPDATE } from "@/graphql/mutations";
import { format } from "date-fns";
import { UpdateType } from "@/types";

export default function AdminUpdatesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gymId: "",
    type: "newset" as UpdateType,
    updateDate: format(new Date(), "yyyy-MM-dd"),
    title: "",
    description: "",
    instagramPostUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // 암장 목록 가져오기
  const { data: gymsData, loading: gymsLoading } = useQuery(GET_ALL_GYMS, {
    variables: { activeOnly: true },
  });

  // 업데이트 생성 뮤테이션
  const [createRouteUpdate] = useMutation(CREATE_ROUTE_UPDATE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createRouteUpdate({
        variables: {
          input: {
            ...formData,
            isVerified: true, // 관리자가 입력한 것은 검증됨으로 표시
          },
        },
      });

      alert("업데이트가 추가되었습니다! 업데이트 목록으로 이동합니다.");

      // 업데이트 목록 페이지로 이동 (새로고침 파라미터 추가)
      router.push("/admin/updates/list");
    } catch (error: any) {
      console.error("Error adding update:", error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTypes = [
    { value: "newset", label: "뉴셋", color: "text-green-600" },
    { value: "removal", label: "탈거", color: "text-red-600" },
    { value: "partial_removal", label: "부분 탈거", color: "text-orange-600" },
    { value: "announcement", label: "공지", color: "text-blue-600" },
  ];

  const gyms = gymsData?.gyms || [];

  if (gymsLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">수동 업데이트 추가</h1>
        <button
          onClick={() => router.push("/admin/updates/list")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로 돌아가기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {/* 암장 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              암장 선택
            </label>
            <select
              required
              value={formData.gymId}
              onChange={(e) =>
                setFormData({ ...formData, gymId: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">
                {gyms.length === 0
                  ? "등록된 암장이 없습니다"
                  : "암장을 선택하세요"}
              </option>
              {gyms.map((gym: any) => (
                <option key={gym.id} value={gym.id}>
                  {gym.name}
                </option>
              ))}
            </select>
          </div>

          {/* 업데이트 타입 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              업데이트 타입
            </label>
            <div className="grid grid-cols-3 gap-2">
              {updateTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, type: type.value as any })
                  }
                  className={`p-2 border rounded-lg text-sm font-medium transition
                    ${
                      formData.type === type.value
                        ? "border-green-500 bg-green-50 " + type.color
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              {formData.type === "newset" && "🆕 세팅일"}
              {formData.type === "removal" && "⚠️ 탈거일"}
              {formData.type === "partial_removal" && "🔶 부분 탈거일"}
              {formData.type === "announcement" && "📢 공지일"}
              {!formData.type && "업데이트 날짜"}
            </label>
            {formData.type === "removal" && (
              <p className="text-sm text-red-600 mb-2">
                💡 탈거 시작 시간도 제목이나 설명에 명시해주세요 (예: 23시부터
                탈거)
              </p>
            )}
            {formData.type === "partial_removal" && (
              <p className="text-sm text-orange-600 mb-2">
                💡 부분 탈거되는 구체적인 루트나 구역을 설명에 명시해주세요
              </p>
            )}
            {formData.type === "newset" && (
              <p className="text-sm text-green-600 mb-2">
                💡 세팅 완료 예상 시간이나 오픈 시간을 설명에 추가해주세요
              </p>
            )}
            <input
              type="date"
              required
              value={formData.updateDate}
              onChange={(e) =>
                setFormData({ ...formData, updateDate: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* 섹터 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              섹터/벽 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="예: A벽, B구역, 루프탑, 오버행벽"
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              업데이트가 적용되는 구체적인 벽이나 구역을 입력하세요
            </p>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              설명 (선택사항)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="업데이트 내용을 입력하세요..."
              rows={4}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Instagram URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Instagram 게시물 URL (선택사항)
            </label>
            <input
              type="url"
              value={formData.instagramPostUrl}
              onChange={(e) =>
                setFormData({ ...formData, instagramPostUrl: e.target.value })
              }
              placeholder="https://www.instagram.com/p/..."
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {submitting ? "추가 중..." : "업데이트 추가"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
