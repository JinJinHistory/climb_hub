"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Gym } from "@/types";
import { format } from "date-fns";

export default function AdminUpdatesPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [formData, setFormData] = useState({
    gym_id: "",
    type: "newset" as const,
    update_date: format(new Date(), "yyyy-MM-dd"),
    title: "",
    description: "",
    instagram_post_url: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    const { data } = await supabase
      .from("gyms")
      .select("*, brand:brands(*)")
      .eq("is_active", true)
      .order("name");

    if (data) setGyms(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("route_updates").insert({
        ...formData,
        is_verified: true, // 관리자가 입력한 것은 검증됨으로 표시
      });

      console.log("[error]::: ", error);

      if (error) throw error;

      alert("업데이트가 추가되었습니다!");

      // 폼 초기화
      setFormData({
        gym_id: "",
        type: "newset",
        update_date: format(new Date(), "yyyy-MM-dd"),
        title: "",
        description: "",
        instagram_post_url: "",
      });
    } catch (error) {
      console.error("Error adding update:", error);
      alert("오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateTypes = [
    { value: "newset", label: "뉴셋", color: "text-green-600" },
    { value: "removal", label: "탈거", color: "text-red-600" },
    { value: "partial_removal", label: "부분탈거", color: "text-orange-600" },
    { value: "announcement", label: "공지", color: "text-blue-600" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">수동 업데이트 추가</h1>

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
              value={formData.gym_id}
              onChange={(e) =>
                setFormData({ ...formData, gym_id: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">암장을 선택하세요</option>
              {gyms.map((gym) => (
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
            <div className="grid grid-cols-4 gap-2">
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
              업데이트 날짜
            </label>
            <input
              type="date"
              required
              value={formData.update_date}
              onChange={(e) =>
                setFormData({ ...formData, update_date: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              제목 (선택사항)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="예: 1월 3주차 뉴셋"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium mb-2">설명</label>
            <textarea
              required
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
              value={formData.instagram_post_url}
              onChange={(e) =>
                setFormData({ ...formData, instagram_post_url: e.target.value })
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
