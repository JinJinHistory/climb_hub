"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Instagram, MapPin, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Gym, Brand } from "@/types";

export default function AdminGymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGym, setEditingGym] = useState<Gym | null>(null);
  const [formData, setFormData] = useState({
    brand_id: "",
    name: "",
    branch_name: "",
    instagram_url: "",
    instagram_handle: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [gymsData, brandsData] = await Promise.all([
      supabase.from("gyms").select("*, brand:brands(*)").order("name"),
      supabase.from("brands").select("*").order("name"),
    ]);

    if (gymsData.data) setGyms(gymsData.data);
    if (brandsData.data) setBrands(brandsData.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingGym) {
        // 수정
        const { error } = await supabase
          .from("gyms")
          .update(formData)
          .eq("id", editingGym.id);

        if (error) throw error;
        alert("암장 정보가 수정되었습니다!");
      } else {
        // 추가
        const { error } = await supabase.from("gyms").insert(formData);

        if (error) throw error;
        alert("새 암장이 추가되었습니다!");
      }

      // 폼 초기화 및 목록 새로고침
      setFormData({
        brand_id: "",
        name: "",
        branch_name: "",
        instagram_url: "",
        instagram_handle: "",
        address: "",
        phone: "",
      });
      setEditingGym(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error("Error saving gym:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleEdit = (gym: Gym) => {
    setEditingGym(gym);
    setFormData({
      brand_id: gym.brand_id,
      name: gym.name,
      branch_name: gym.branch_name,
      instagram_url: gym.instagram_url,
      instagram_handle: gym.instagram_handle,
      address: gym.address || "",
      phone: gym.phone || "",
    });
    setShowForm(true);
  };

  const extractInstagramHandle = (url: string) => {
    const match = url.match(/instagram\.com\/([^\/]+)\/?$/);
    return match ? match[1] : "";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">암장 관리</h1>
        <button
          onClick={() => {
            setEditingGym(null);
            setFormData({
              brand_id: "",
              name: "",
              branch_name: "",
              instagram_url: "",
              instagram_handle: "",
              address: "",
              phone: "",
            });
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />새 암장 추가
        </button>
      </div>

      {/* 암장 추가/수정 폼 */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingGym ? "암장 정보 수정" : "새 암장 추가"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">브랜드</label>
                <select
                  required
                  value={formData.brand_id}
                  onChange={(e) =>
                    setFormData({ ...formData, brand_id: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">브랜드 선택</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">지점명</label>
                <input
                  required
                  type="text"
                  value={formData.branch_name}
                  onChange={(e) =>
                    setFormData({ ...formData, branch_name: e.target.value })
                  }
                  placeholder="예: 일산점"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  암장 전체 이름
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="예: 더클라임 일산점"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Instagram URL
                </label>
                <input
                  required
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData({
                      ...formData,
                      instagram_url: url,
                      instagram_handle: extractInstagramHandle(url),
                    });
                  }}
                  placeholder="https://www.instagram.com/username"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">주소</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="선택사항"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  전화번호
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="선택사항"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingGym ? "수정하기" : "추가하기"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingGym(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 암장 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                암장
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                브랜드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Instagram
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {gyms.map((gym) => (
              <tr key={gym.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{gym.name}</p>
                    <p className="text-sm text-gray-500">{gym.branch_name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {gym.brand?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={gym.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700"
                  >
                    <Instagram className="w-4 h-4" />@{gym.instagram_handle}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {gym.address && (
                      <p className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {gym.address}
                      </p>
                    )}
                    {gym.phone && (
                      <p className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-3 h-3" />
                        {gym.phone}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(gym)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
