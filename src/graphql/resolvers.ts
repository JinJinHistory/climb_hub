import { prisma } from "@/lib/database";

// 날짜를 ISO 문자열로 변환하는 헬퍼 함수
const formatDate = (date: any): string => {
  if (!date) return "";
  return new Date(date).toISOString();
};

const formatDateOnly = (date: any): string => {
  if (!date) return "";

  // 이미 YYYY-MM-DD 형식이면 그대로 반환
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // DATE 타입을 YYYY-MM-DD 형식으로 반환 (시간대 변환 없이)
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  // UTC가 아닌 로컬 시간으로 YYYY-MM-DD 반환
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const resolvers = {
  Query: {
    brands: async () => {
      try {
        // 데이터베이스 연결 확인
        await prisma.$connect();
        
        const brands = await prisma.brand.findMany({
          orderBy: { name: 'asc' }
        });
        
        return brands.map((brand) => ({
          ...brand,
          logoUrl: brand.logoUrl,
          websiteUrl: brand.websiteUrl,
          createdAt: formatDate(brand.createdAt),
          updatedAt: formatDate(brand.updatedAt),
        }));
      } catch (error: any) {
        console.error('brands query error:', error);
        
        if (error.code === "P1001") {
          throw new Error("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        
        throw new Error("브랜드 목록을 가져오는 중 오류가 발생했습니다.");
      } finally {
        await prisma.$disconnect();
      }
    },

    brand: async (_: any, { id }: { id: string }) => {
      const brand = await prisma.brand.findUnique({
        where: { id }
      });
      
      if (!brand) return null;

      return {
        ...brand,
        logoUrl: brand.logoUrl,
        websiteUrl: brand.websiteUrl,
        createdAt: formatDate(brand.createdAt),
        updatedAt: formatDate(brand.updatedAt),
      };
    },

    gyms: async (_: any, { activeOnly = true }: { activeOnly?: boolean }) => {
      const gyms = await prisma.gym.findMany({
        where: activeOnly ? { isActive: true } : {},
        include: {
          brand: true
        },
        orderBy: { name: 'asc' }
      });

      return gyms.map((gym) => ({
        ...gym,
        brandId: gym.brandId,
        branchName: gym.branchName,
        instagramUrl: gym.instagramUrl,
        instagramHandle: gym.instagramHandle,
        isActive: gym.isActive,
        createdAt: formatDate(gym.createdAt),
        updatedAt: formatDate(gym.updatedAt),
        brand: {
          ...gym.brand,
          logoUrl: gym.brand.logoUrl,
          websiteUrl: gym.brand.websiteUrl,
          createdAt: formatDate(gym.brand.createdAt),
          updatedAt: formatDate(gym.brand.updatedAt),
        },
      }));
    },

    gym: async (_: any, { id }: { id: string }) => {
      const gym = await prisma.gym.findUnique({
        where: { id },
        include: {
          brand: true
        }
      });

      if (!gym) return null;

      return {
        ...gym,
        brandId: gym.brandId,
        branchName: gym.branchName,
        instagramUrl: gym.instagramUrl,
        instagramHandle: gym.instagramHandle,
        isActive: gym.isActive,
        createdAt: formatDate(gym.createdAt),
        updatedAt: formatDate(gym.updatedAt),
        brand: {
          ...gym.brand,
          logoUrl: gym.brand.logoUrl,
          websiteUrl: gym.brand.websiteUrl,
          createdAt: formatDate(gym.brand.createdAt),
          updatedAt: formatDate(gym.brand.updatedAt),
        },
      };
    },

    routeUpdates: async (
      _: any,
      {
        gymId,
        type,
        limit = 10,
        offset = 0,
      }: {
        gymId?: string;
        type?: string;
        limit?: number;
        offset?: number;
      }
    ) => {
      const where: any = {};
      
      if (gymId) {
        where.gymId = gymId;
      }
      
      if (type) {
        where.type = type as any;
      }

      const routeUpdates = await prisma.routeUpdate.findMany({
        where,
        include: {
          gym: {
            include: {
              brand: true
            }
          }
        },
        orderBy: { updateDate: 'desc' },
        take: limit,
        skip: offset
      });

      return routeUpdates.map((update) => ({
        id: update.id,
        gymId: update.gymId,
        type: update.type,
        updateDate: formatDateOnly(update.updateDate),
        title: update.title,
        description: update.description,
        instagramPostUrl: update.instagramPostUrl,
        instagramPostId: update.instagramPostId,
        imageUrls: update.imageUrls,
        rawCaption: update.rawCaption,
        parsedData: update.parsedData,
        isVerified: update.isVerified,
        createdAt: formatDate(update.createdAt),
        updatedAt: formatDate(update.updatedAt),
        gym: {
          id: update.gym.id,
          name: update.gym.name,
          branchName: update.gym.branchName,
          instagramHandle: update.gym.instagramHandle,
          brand: {
            id: update.gym.brand.id,
            name: update.gym.brand.name,
            logoUrl: update.gym.brand.logoUrl,
          },
        },
      }));
    },

    routeUpdate: async (_: any, { id }: { id: string }) => {
      const routeUpdate = await prisma.routeUpdate.findUnique({
        where: { id },
        include: {
          gym: {
            include: {
              brand: true
            }
          }
        }
      });

      if (!routeUpdate) return null;

      return {
        id: routeUpdate.id,
        gymId: routeUpdate.gymId,
        type: routeUpdate.type,
        updateDate: formatDateOnly(routeUpdate.updateDate),
        title: routeUpdate.title,
        description: routeUpdate.description,
        instagramPostUrl: routeUpdate.instagramPostUrl,
        instagramPostId: routeUpdate.instagramPostId,
        imageUrls: routeUpdate.imageUrls,
        rawCaption: routeUpdate.rawCaption,
        parsedData: routeUpdate.parsedData,
        isVerified: routeUpdate.isVerified,
        createdAt: formatDate(routeUpdate.createdAt),
        updatedAt: formatDate(routeUpdate.updatedAt),
        gym: {
          id: routeUpdate.gym.id,
          name: routeUpdate.gym.name,
          branchName: routeUpdate.gym.branchName,
          instagramHandle: routeUpdate.gym.instagramHandle,
          brand: {
            id: routeUpdate.gym.brand.id,
            name: routeUpdate.gym.brand.name,
            logoUrl: routeUpdate.gym.brand.logoUrl,
          },
        },
      };
    },

    crawlLogs: async (_: any, { gymId }: { gymId?: string }) => {
      const where: any = {};
      
      if (gymId) {
        where.gymId = gymId;
      }

      const crawlLogs = await prisma.crawlLog.findMany({
        where,
        include: {
          gym: {
            include: {
              brand: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return crawlLogs.map((log) => ({
        ...log,
        gym: {
          id: log.gym.id,
          name: log.gym.name,
          branchName: log.gym.branchName,
          brand: {
            id: log.gym.brand.id,
            name: log.gym.brand.name,
          },
        },
      }));
    },

    crawlLog: async (_: any, { id }: { id: string }) => {
      const crawlLog = await prisma.crawlLog.findUnique({
        where: { id },
        include: {
          gym: {
            include: {
              brand: true
            }
          }
        }
      });

      if (!crawlLog) return null;

      return {
        ...crawlLog,
        gym: {
          id: crawlLog.gym.id,
          name: crawlLog.gym.name,
          branchName: crawlLog.gym.branchName,
          brand: {
            id: crawlLog.gym.brand.id,
            name: crawlLog.gym.brand.name,
          },
        },
      };
    },
  },

  Mutation: {
    createBrand: async (_: any, { input }: { input: any }) => {
      try {
        // 데이터베이스 연결 확인
        await prisma.$connect();
        
        const brand = await prisma.brand.create({
          data: {
            name: input.name,
            logoUrl: input.logoUrl,
            websiteUrl: input.websiteUrl,
          },
        });
        return {
          ...brand,
          logoUrl: brand.logoUrl,
          websiteUrl: brand.websiteUrl,
          createdAt: formatDate(brand.createdAt),
          updatedAt: formatDate(brand.updatedAt),
        };
      } catch (error: any) {
        console.error('createBrand error:', error);
        
        if (error.code === "P1001") {
          throw new Error("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        
        if (
          error.code === "P2002" &&
          error.meta?.target === "Brand_name_key"
        ) {
          throw new Error(
            `브랜드명 "${input.name}"이 이미 존재합니다. 다른 이름을 사용해주세요.`
          );
        }
        
        if (error.code === "P2003") {
          throw new Error("데이터 무결성 오류가 발생했습니다.");
        }
        
        throw new Error("브랜드 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        await prisma.$disconnect();
      }
    },

    updateBrand: async (_: any, { id, input }: { id: string; input: any }) => {
      try {
        // 데이터베이스 연결 확인
        await prisma.$connect();
        
        const brand = await prisma.brand.update({
          where: { id },
          data: {
            name: input.name,
            logoUrl: input.logoUrl,
            websiteUrl: input.websiteUrl,
          },
        });
        return {
          ...brand,
          logoUrl: brand.logoUrl,
          websiteUrl: brand.websiteUrl,
          createdAt: formatDate(brand.createdAt),
          updatedAt: formatDate(brand.updatedAt),
        };
      } catch (error: any) {
        console.error('updateBrand error:', error);
        
        if (error.code === "P1001") {
          throw new Error("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        
        if (error.code === "P2025") {
          throw new Error("해당 브랜드를 찾을 수 없습니다.");
        }
        
        if (
          error.code === "P2002" &&
          error.meta?.target === "Brand_name_key"
        ) {
          throw new Error(
            `브랜드명 "${input.name}"이 이미 존재합니다. 다른 이름을 사용해주세요.`
          );
        }
        
        throw new Error("브랜드 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        await prisma.$disconnect();
      }
    },

    deleteBrand: async (_: any, { id }: { id: string }) => {
      try {
        // 데이터베이스 연결 확인
        await prisma.$connect();
        
        await prisma.brand.delete({
          where: { id }
        });
        return true;
      } catch (error: any) {
        console.error('deleteBrand error:', error);
        
        if (error.code === "P1001") {
          throw new Error("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        
        if (error.code === "P2025") {
          throw new Error("해당 브랜드를 찾을 수 없습니다.");
        }
        
        if (error.code === "P2003") {
          throw new Error("이 브랜드와 연결된 암장이 있어서 삭제할 수 없습니다. 먼저 연결된 암장을 삭제해주세요.");
        }
        
        throw new Error("브랜드 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        await prisma.$disconnect();
      }
    },

    createGym: async (_: any, { input }: { input: any }) => {
      try {
        const gym = await prisma.gym.create({
          data: {
            brandId: input.brandId,
            name: input.name,
            branchName: input.branchName,
            instagramUrl: input.instagramUrl,
            instagramHandle: input.instagramHandle,
            address: input.address,
            phone: input.phone,
            latitude: input.latitude,
            longitude: input.longitude,
            isActive: input.isActive,
          },
        });

        const brand = await prisma.brand.findUnique({
          where: { id: gym.brandId }
        });

        return {
          ...gym,
          brandId: gym.brandId,
          branchName: gym.branchName,
          instagramUrl: gym.instagramUrl,
          instagramHandle: gym.instagramHandle,
          isActive: gym.isActive,
          createdAt: formatDate(gym.createdAt),
          updatedAt: formatDate(gym.updatedAt),
          brand: {
            ...brand,
            logoUrl: brand.logoUrl,
            websiteUrl: brand.websiteUrl,
            createdAt: formatDate(brand.createdAt),
            updatedAt: formatDate(brand.updatedAt),
          },
        };
      } catch (error: any) {
        if (error.code === "P2002") {
          if (error.meta?.target === "Gym_brandId_branchName_key") {
            // 브랜드명 조회
            const brand = await prisma.brand.findUnique({
              where: { id: input.brandId }
            });
            const brandName = brand?.name || "해당 브랜드";
            throw new Error(
              `${brandName}에 "${input.branchName}" 지점이 이미 존재합니다. 다른 지점명을 사용해주세요.`
            );
          }
          if (error.meta?.target === "Gym_instagramHandle_key") {
            throw new Error(
              `인스타그램 핸들 "${input.instagramHandle}"이 이미 사용 중입니다. 다른 핸들을 사용해주세요.`
            );
          }
        }
        throw error;
      }
    },

    updateGym: async (_: any, { id, input }: { id: string; input: any }) => {
      const gym = await prisma.gym.update({
        where: { id },
        data: {
          brandId: input.brandId,
          name: input.name,
          branchName: input.branchName,
          instagramUrl: input.instagramUrl,
          instagramHandle: input.instagramHandle,
          address: input.address,
          phone: input.phone,
          latitude: input.latitude,
          longitude: input.longitude,
          isActive: input.isActive,
        },
      });

      const brand = await prisma.brand.findUnique({
        where: { id: gym.brandId }
      });

      return {
        ...gym,
        brandId: gym.brandId,
        branchName: gym.branchName,
        instagramUrl: gym.instagramUrl,
        instagramHandle: gym.instagramHandle,
        isActive: gym.isActive,
        createdAt: formatDate(gym.createdAt),
        updatedAt: formatDate(gym.updatedAt),
        brand: {
          ...brand,
          logoUrl: brand.logoUrl,
          websiteUrl: brand.websiteUrl,
          createdAt: formatDate(brand.createdAt),
          updatedAt: formatDate(brand.updatedAt),
        },
      };
    },

    deleteGym: async (_: any, { id }: { id: string }) => {
      await prisma.gym.delete({
        where: { id }
      });
      return true;
    },

    createRouteUpdate: async (_: any, { input }: { input: any }) => {
      try {
        // 데이터베이스 연결 확인
        await prisma.$connect();
        
        // enum 값이 이미 소문자로 전달됨
        const prismaType = input.type;
        
        // 날짜 문자열을 Date 객체로 변환
        const updateDate = new Date(input.updateDate);
        
        const update = await prisma.routeUpdate.create({
          data: {
            gymId: input.gymId,
            type: prismaType as any,
            updateDate: updateDate,
            title: input.title,
            description: input.description,
            instagramPostUrl: input.instagramPostUrl,
            instagramPostId: input.instagramPostId,
            imageUrls: input.imageUrls || [],
            rawCaption: input.rawCaption,
            parsedData: input.parsedData,
            isVerified: input.isVerified || false,
          },
        });

        const gym = await prisma.gym.findUnique({
          where: { id: update.gymId },
          include: {
            brand: true
          }
        });

        if (!gym) {
          throw new Error("해당 암장을 찾을 수 없습니다.");
        }

        return {
          id: update.id,
          gymId: update.gymId,
          type: update.type,
          updateDate: formatDateOnly(update.updateDate),
          title: update.title,
          description: update.description,
          instagramPostUrl: update.instagramPostUrl,
          instagramPostId: update.instagramPostId,
          imageUrls: update.imageUrls,
          rawCaption: update.rawCaption,
          parsedData: update.parsedData,
          isVerified: update.isVerified,
          createdAt: formatDate(update.createdAt),
          updatedAt: formatDate(update.updatedAt),
          gym: {
            id: gym.id,
            name: gym.name,
            branchName: gym.branchName,
            instagramHandle: gym.instagramHandle,
            brand: {
              id: gym.brand.id,
              name: gym.brand.name,
              logoUrl: gym.brand.logoUrl,
            },
          },
        };
      } catch (error: any) {
        console.error('createRouteUpdate error:', error);
        
        if (error.code === "P1001") {
          throw new Error("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        
        if (error.code === "P2003") {
          throw new Error("해당 암장을 찾을 수 없습니다.");
        }
        
        if (error.message.includes("Invalid value for argument `type`")) {
          throw new Error("잘못된 업데이트 타입입니다. 'newset', 'removal', 'partial_removal', 'announcement' 중 하나를 선택해주세요.");
        }
        
        if (error.message.includes("Invalid value for argument `updateDate`")) {
          throw new Error("잘못된 날짜 형식입니다. YYYY-MM-DD 형식으로 입력해주세요.");
        }
        
        throw new Error("업데이트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        await prisma.$disconnect();
      }
    },

    updateRouteUpdate: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      try {
        // 데이터베이스 연결 확인
        await prisma.$connect();
        
        // enum 값이 이미 소문자로 전달됨
        const prismaType = input.type;
        
        const updateData: any = {};
        if (input.gymId !== undefined) updateData.gymId = input.gymId;
        if (prismaType !== undefined) updateData.type = prismaType as any;
        if (input.updateDate !== undefined) updateData.updateDate = new Date(input.updateDate);
        if (input.title !== undefined) updateData.title = input.title;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.instagramPostUrl !== undefined) updateData.instagramPostUrl = input.instagramPostUrl;
        if (input.instagramPostId !== undefined) updateData.instagramPostId = input.instagramPostId;
        if (input.imageUrls !== undefined) updateData.imageUrls = input.imageUrls;
        if (input.rawCaption !== undefined) updateData.rawCaption = input.rawCaption;
        if (input.parsedData !== undefined) updateData.parsedData = input.parsedData;
        if (input.isVerified !== undefined) updateData.isVerified = input.isVerified;
        
        const update = await prisma.routeUpdate.update({
          where: { id },
          data: updateData,
        });

        const gym = await prisma.gym.findUnique({
          where: { id: update.gymId },
          include: {
            brand: true
          }
        });

        if (!gym) {
          throw new Error("해당 암장을 찾을 수 없습니다.");
        }

        return {
          id: update.id,
          gymId: update.gymId,
          type: update.type,
          updateDate: formatDateOnly(update.updateDate),
          title: update.title,
          description: update.description,
          instagramPostUrl: update.instagramPostUrl,
          instagramPostId: update.instagramPostId,
          imageUrls: update.imageUrls,
          rawCaption: update.rawCaption,
          parsedData: update.parsedData,
          isVerified: update.isVerified,
          createdAt: formatDate(update.createdAt),
          updatedAt: formatDate(update.updatedAt),
          gym: {
            id: gym.id,
            name: gym.name,
            branchName: gym.branchName,
            instagramHandle: gym.instagramHandle,
            brand: {
              id: gym.brand.id,
              name: gym.brand.name,
              logoUrl: gym.brand.logoUrl,
            },
          },
        };
      } catch (error: any) {
        console.error('updateRouteUpdate error:', error);
        
        if (error.code === "P1001") {
          throw new Error("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        
        if (error.code === "P2025") {
          throw new Error("해당 업데이트를 찾을 수 없습니다.");
        }
        
        if (error.code === "P2003") {
          throw new Error("해당 암장을 찾을 수 없습니다.");
        }
        
        if (error.message.includes("Invalid value for argument `type`")) {
          throw new Error("잘못된 업데이트 타입입니다. 'newset', 'removal', 'partial_removal', 'announcement' 중 하나를 선택해주세요.");
        }
        
        if (error.message.includes("Invalid value for argument `updateDate`")) {
          throw new Error("잘못된 날짜 형식입니다. YYYY-MM-DD 형식으로 입력해주세요.");
        }
        
        throw new Error("업데이트 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        await prisma.$disconnect();
      }
    },

    deleteRouteUpdate: async (_: any, { id }: { id: string }) => {
      await prisma.routeUpdate.delete({
        where: { id }
      });
      return true;
    },

    createCrawlLog: async (_: any, { input }: { input: any }) => {
      const log = await prisma.crawlLog.create({
        data: {
          gymId: input.gymId,
          status: input.status,
          postsFound: input.postsFound,
          postsNew: input.postsNew,
          errorMessage: input.errorMessage,
          startedAt: input.startedAt,
          completedAt: input.completedAt,
        },
      });

      const gym = await prisma.gym.findUnique({
        where: { id: log.gymId },
        include: {
          brand: true
        }
      });

      return {
        ...log,
        gym: {
          id: gym.id,
          name: gym.name,
          branchName: gym.branchName,
          brand: {
            id: gym.brand.id,
            name: gym.brand.name,
          },
        },
      };
    },

    updateCrawlLog: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      const log = await prisma.crawlLog.update({
        where: { id },
        data: {
          gymId: input.gymId,
          status: input.status,
          postsFound: input.postsFound,
          postsNew: input.postsNew,
          errorMessage: input.errorMessage,
          startedAt: input.startedAt,
          completedAt: input.completedAt,
        },
      });

      const gym = await prisma.gym.findUnique({
        where: { id: log.gymId },
        include: {
          brand: true
        }
      });

      return {
        ...log,
        gym: {
          id: gym.id,
          name: gym.name,
          branchName: gym.branchName,
          brand: {
            id: gym.brand.id,
            name: gym.brand.name,
          },
        },
      };
    },
  },

  Brand: {
    gyms: async (parent: any) => {
      const gyms = await prisma.gym.findMany({
        where: { brandId: parent.id },
        orderBy: { name: 'asc' }
      });

      return gyms.map((gym) => ({
        id: gym.id,
        name: gym.name,
        branchName: gym.branchName,
        instagramUrl: gym.instagramUrl,
        instagramHandle: gym.instagramHandle,
        address: gym.address,
        phone: gym.phone,
        latitude: gym.latitude,
        longitude: gym.longitude,
        isActive: gym.isActive,
        createdAt: formatDate(gym.createdAt),
        updatedAt: formatDate(gym.updatedAt),
        brand: {
          id: gym.brandId,
          name: gym.brand.name,
          logoUrl: gym.brand.logoUrl,
          websiteUrl: gym.brand.websiteUrl,
        },
      }));
    },
  },

  Gym: {
    routeUpdates: async (parent: any) => {
      const routeUpdates = await prisma.routeUpdate.findMany({
        where: { gymId: parent.id },
        include: {
          gym: {
            include: {
              brand: true
            }
          }
        },
        orderBy: { updateDate: 'desc' }
      });

      return routeUpdates.map((update) => ({
        id: update.id,
        gymId: update.gymId,
        type: update.type,
        updateDate: formatDateOnly(update.updateDate),
        title: update.title,
        description: update.description,
        instagramPostUrl: update.instagramPostUrl,
        instagramPostId: update.instagramPostId,
        imageUrls: update.imageUrls,
        rawCaption: update.rawCaption,
        parsedData: update.parsedData,
        isVerified: update.isVerified,
        createdAt: formatDate(update.createdAt),
        updatedAt: formatDate(update.updatedAt),
        gym: {
          id: update.gym.id,
          name: update.gym.name,
          branchName: update.gym.branchName,
          instagramHandle: update.gym.instagramHandle,
          brand: {
            id: update.gym.brand.id,
            name: update.gym.brand.name,
            logoUrl: update.gym.brand.logoUrl,
          },
        },
      }));
    },
  },
};
