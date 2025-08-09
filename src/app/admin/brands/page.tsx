"use client";

import { useState } from "react";
import { Plus, Edit2, Globe, ExternalLink, Trash2 } from "lucide-react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { GET_BRANDS, GET_BRAND } from "@/graphql/queries";
import { CREATE_BRAND, UPDATE_BRAND, DELETE_BRAND } from "@/graphql/mutations";

export default function AdminBrandsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
  });

  // Apollo Client
  const client = useApolloClient();

  // 브랜드 목록 가져오기
  const {
    data: brandsData,
    loading: brandsLoading,
    refetch: refetchBrands,
  } = useQuery(GET_BRANDS);

  // 브랜드 생성 뮤테이션
  const [createBrand] = useMutation(CREATE_BRAND);

  // 브랜드 수정 뮤테이션
  const [updateBrand] = useMutation(UPDATE_BRAND);

  // 브랜드 삭제 뮤테이션
  const [deleteBrand] = useMutation(DELETE_BRAND);

  const brands = brandsData?.brands || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBrand) {
        // 수정
        await updateBrand({
          variables: {
            id: editingBrand.id,
            input: formData,
          },
        });
        alert("브랜드 정보가 수정되었습니다!");
      } else {
        // 추가
        await createBrand({
          variables: {
            input: formData,
          },
        });
        alert("새 브랜드가 추가되었습니다!");
      }

      // 폼 초기화 및 목록 새로고침
      setFormData({
        name: "",
        logoUrl: "",
        websiteUrl: "",
      });
      setEditingBrand(null);
      setShowForm(false);
      refetchBrands();
    } catch (error: any) {
      console.error("Error saving brand:", error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logoUrl: brand.logoUrl || "",
      websiteUrl: brand.websiteUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (brand: any) => {
    try {
      // 먼저 브랜드와 연결된 암장 정보를 조회
      const brandResult = await client.query({
        query: GET_BRAND,
        variables: { id: brand.id },
        fetchPolicy: "network-only",
      });

      const connectedGyms = brandResult.data?.brand?.gyms || [];
      const activeGyms = connectedGyms.filter((gym: any) => gym.isActive);

      let confirmMessage = `정말로 "${brand.name}" 브랜드를 삭제하시겠습니까?`;

      if (connectedGyms.length > 0) {
        confirmMessage = `⚠️ 경고: "${brand.name}" 브랜드를 삭제하면 연결된 ${
          connectedGyms.length
        }개의 암장도 모두 삭제됩니다!\n\n삭제될 암장들:\n${connectedGyms
          .map((gym: any) => `• ${gym.branchName}`)
          .join(
            "\n"
          )}\n\n⚠️ 각 암장의 모든 업데이트 기록과 데이터도 함께 삭제됩니다.\n\n정말로 삭제하시겠습니까?`;
      }

      if (!confirm(confirmMessage)) {
        return;
      }

      // 연결된 암장이 있는 경우 추가 확인
      if (connectedGyms.length > 0) {
        const confirmPhrase = "하위 지점들을 모두 함께 삭제합니다";
        const finalConfirm = prompt(
          `⚠️ 정말로 삭제하시려면 다음 문구를 정확히 입력해주세요:\n\n"${confirmPhrase}"`
        );

        if (finalConfirm !== confirmPhrase) {
          alert("입력한 문구가 일치하지 않습니다. 삭제가 취소되었습니다.");
          return;
        }
      }

      await deleteBrand({
        variables: {
          id: brand.id,
        },
      });

      alert(
        `브랜드 "${brand.name}"${
          connectedGyms.length > 0
            ? `와 연결된 ${connectedGyms.length}개 암장`
            : ""
        }이 삭제되었습니다.`
      );
      refetchBrands();
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  if (brandsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">브랜드 관리</h1>
        <button
          onClick={() => {
            setEditingBrand(null);
            setFormData({
              name: "",
              logoUrl: "",
              websiteUrl: "",
            });
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />새 브랜드 추가
        </button>
      </div>

      {/* 브랜드 추가/수정 폼 */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingBrand ? "브랜드 정보 수정" : "새 브랜드 추가"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-500">브랜드명 *</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="예: 더클라임"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  로고 URL
                </label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  placeholder="https://example.com/logo.png (선택사항)"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  웹사이트 URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  placeholder="https://example.com (선택사항)"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingBrand ? "수정하기" : "추가하기"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBrand(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 브랜드 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                브랜드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                로고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                웹사이트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.map((brand: any) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-lg">{brand.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {brand.logoUrl ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} 로고`}
                        className="w-8 h-8 object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <a
                        href={brand.logoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">없음</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {brand.websiteUrl ? (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Globe className="w-4 h-4" />
                      웹사이트
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">없음</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {new Date(brand.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="text-blue-600 hover:text-blue-700"
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(brand)}
                      className="text-red-600 hover:text-red-700"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {brands.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            등록된 브랜드가 없습니다. 새 브랜드를 추가해보세요!
          </div>
        )}
      </div>
    </div>
  );
}
