"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Save, ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ROUTE_UPDATE, GET_ALL_GYMS } from "@/graphql/queries";
import { UPDATE_ROUTE_UPDATE } from "@/graphql/mutations";
import { format } from "date-fns";
import Link from "next/link";
import { UpdateType } from "@/types";

export default function AdminUpdateEditPage() {
  const params = useParams();
  const router = useRouter();
  const updateId = params.id as string;

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    gymId: "",
    type: "NEWSET" as UpdateType,
    updateDate: "",
    title: "",
    description: "",
    instagramPostUrl: "",
  });

  // 업데이트 데이터 가져오기
  const { data: updateData, loading: updateLoading } = useQuery(
    GET_ROUTE_UPDATE,
    {
      variables: { id: updateId },
      skip: !updateId,
    }
  );

  // 암장 목록 가져오기
  const { data: gymsData, loading: gymsLoading } = useQuery(GET_ALL_GYMS, {
    variables: { activeOnly: true },
  });

  // 업데이트 수정 뮤테이션
  const [updateRouteUpdate] = useMutation(UPDATE_ROUTE_UPDATE);

  useEffect(() => {
    if (updateData?.routeUpdate) {
      const update = updateData.routeUpdate;

      // updateDate 형식 확인 및 변환
      let formattedDate = update.updateDate;
      if (update.updateDate) {
        // 만약 ISO 형식이라면 YYYY-MM-DD로 변환
        const date = new Date(update.updateDate);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }

      setFormData({
        gymId: update.gymId,
        type: update.type,
        updateDate: formattedDate,
        title: update.title || "",
        description: update.description || "",
        instagramPostUrl: update.instagramPostUrl || "",
      });
    }
  }, [updateData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateRouteUpdate({
        variables: {
          id: updateId,
          input: {
            ...formData,
            isVerified: true,
          },
        },
      });

      alert("업데이트가 수정되었습니다!");
      router.push("/admin/updates/list");
    } catch (error: any) {
      console.error("Error updating:", error);
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
    { value: "NEWSET", label: "뉴셋", color: "text-green-600" },
    { value: "REMOVAL", label: "탈거", color: "text-red-600" },

    { value: "ANNOUNCEMENT", label: "공지", color: "text-blue-600" },
  ];

  const gyms = gymsData?.gyms || [];

  if (updateLoading || gymsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!updateData?.routeUpdate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <p className="text-gray-500">업데이트를 찾을 수 없습니다.</p>
          <Link
            href="/admin/updates/list"
            className="text-blue-600 hover:text-blue-700"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/admin/updates/list"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold">업데이트 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {/* 암장 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              암장
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
              {formData.type === "NEWSET" && "🆕 세팅일"}
              {formData.type === "REMOVAL" && "⚠️ 탈거일"}

              {formData.type === "ANNOUNCEMENT" && "📢 공지일"}
              {!formData.type && "업데이트 날짜"}
            </label>
            {formData.type === "REMOVAL" && (
              <p className="text-sm text-red-600 mb-2">
                💡 탈거 시작 시간도 제목이나 설명에 명시해주세요 (예: 23시부터
                탈거)
              </p>
            )}
            {formData.type === "NEWSET" && (
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
              <Save className="w-5 h-5" />
              {submitting ? "수정 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
