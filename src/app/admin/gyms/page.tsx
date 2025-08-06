"use client";

import { useState } from "react";
import { Plus, Edit2, Instagram, MapPin, Phone } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_GYMS, GET_BRANDS } from "@/graphql/queries";
import { CREATE_GYM, UPDATE_GYM } from "@/graphql/mutations";

export default function AdminGymsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingGym, setEditingGym] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    brandId: "",
    name: "",
    branchName: "",
    instagramUrl: "",
    instagramHandle: "",
    address: "",
    phone: "",
  });

  // 암장 목록 가져오기
  const { data: gymsData, loading: gymsLoading, refetch: refetchGyms } = useQuery(GET_ALL_GYMS, {
    variables: { activeOnly: false }, // 모든 암장 가져오기
  });

  // 브랜드 목록 가져오기
  const { data: brandsData, loading: brandsLoading } = useQuery(GET_BRANDS);

  // 암장 생성 뮤테이션
  const [createGym] = useMutation(CREATE_GYM);

  // 암장 수정 뮤테이션
  const [updateGym] = useMutation(UPDATE_GYM);

  const gyms = gymsData?.gyms || [];
  const brands = brandsData?.brands || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingGym) {
        // 수정
        await updateGym({
          variables: {
            id: editingGym.id,
            input: formData,
          },
        });
        alert("암장 정보가 수정되었습니다!");
      } else {
        // 추가
        await createGym({
          variables: {
            input: formData,
          },
        });
        alert("새 암장이 추가되었습니다!");
      }

      // 폼 초기화 및 목록 새로고침
      setFormData({
        brandId: "",
        name: "",
        branchName: "",
        instagramUrl: "",
        instagramHandle: "",
        address: "",
        phone: "",
      });
      setEditingGym(null);
      setShowForm(false);
      refetchGyms();
    } catch (error) {
      console.error("Error saving gym:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleEdit = (gym: any) => {
    setEditingGym(gym);
    setFormData({
      brandId: gym.brand?.id || "",
      name: gym.name,
      branchName: gym.branchName,
      instagramUrl: gym.instagramUrl,
      instagramHandle: gym.instagramHandle,
      address: gym.address || "",
      phone: gym.phone || "",
    });
    setShowForm(true);
  };

  const extractInstagramHandle = (url: string) => {
    const match = url.match(/instagram\.com\/([^\/]+)\/?$/);
    return match ? match[1] : "";
  };

  if (gymsLoading || brandsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">암장 관리</h1>
        <button
          onClick={() => {
            setEditingGym(null);
            setFormData({
              brandId: "",
              name: "",
              branchName: "",
              instagramUrl: "",
              instagramHandle: "",
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
                  value={formData.brandId}
                  onChange={(e) =>
                    setFormData({ ...formData, brandId: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">브랜드 선택</option>
                  {brands.map((brand: any) => (
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
                  value={formData.branchName}
                  onChange={(e) =>
                    setFormData({ ...formData, branchName: e.target.value })
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
                  value={formData.instagramUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData({
                      ...formData,
                      instagramUrl: url,
                      instagramHandle: extractInstagramHandle(url),
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
            {gyms.map((gym: any) => (
              <tr key={gym.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{gym.name}</p>
                    <p className="text-sm text-gray-500">{gym.branchName}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {gym.brand?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={gym.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700"
                  >
                    <Instagram className="w-4 h-4" />@{gym.instagramHandle}
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
