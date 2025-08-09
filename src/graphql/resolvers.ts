import pool from "@/lib/database";

// 날짜를 ISO 문자열로 변환하는 헬퍼 함수
const formatDate = (date: any): string => {
  if (!date) return "";
  return new Date(date).toISOString();
};

export const resolvers = {
  Query: {
    brands: async () => {
      const result = await pool.query("SELECT * FROM brands ORDER BY name");
      return result.rows.map((row) => ({
        ...row,
        logoUrl: row.logo_url,
        websiteUrl: row.website_url,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
      }));
    },

    brand: async (_: any, { id }: { id: string }) => {
      const result = await pool.query("SELECT * FROM brands WHERE id = $1", [
        id,
      ]);
      const row = result.rows[0];
      if (!row) return null;

      return {
        ...row,
        logoUrl: row.logo_url,
        websiteUrl: row.website_url,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
      };
    },

    gyms: async (_: any, { activeOnly = true }: { activeOnly?: boolean }) => {
      let query = `
        SELECT g.*, b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url, b.website_url as brand_website_url, b.created_at as brand_created_at, b.updated_at as brand_updated_at
        FROM gyms g
        LEFT JOIN brands b ON g.brand_id = b.id
      `;

      if (activeOnly) {
        query += " WHERE g.is_active = true";
      }

      query += " ORDER BY g.name";

      const result = await pool.query(query);
      return result.rows.map((row) => ({
        ...row,
        brandId: row.brand_id,
        branchName: row.branch_name,
        instagramUrl: row.instagram_url,
        instagramHandle: row.instagram_handle,
        isActive: row.is_active,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
        brand: {
          id: row.brand_id,
          name: row.brand_name,
          logoUrl: row.brand_logo_url,
          websiteUrl: row.brand_website_url,
          createdAt: formatDate(row.brand_created_at),
          updatedAt: formatDate(row.brand_updated_at),
        },
      }));
    },

    gym: async (_: any, { id }: { id: string }) => {
      const result = await pool.query(
        `
        SELECT g.*, b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url, b.website_url as brand_website_url, b.created_at as brand_created_at, b.updated_at as brand_updated_at
        FROM gyms g
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE g.id = $1
      `,
        [id]
      );

      const row = result.rows[0];
      if (!row) return null;

      return {
        ...row,
        brandId: row.brand_id,
        branchName: row.branch_name,
        instagramUrl: row.instagram_url,
        instagramHandle: row.instagram_handle,
        isActive: row.is_active,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
        brand: {
          id: row.brand_id,
          name: row.brand_name,
          logoUrl: row.brand_logo_url,
          websiteUrl: row.brand_website_url,
          createdAt: formatDate(row.brand_created_at),
          updatedAt: formatDate(row.brand_updated_at),
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
      let query = `
        SELECT ru.*, g.id as gym_id, g.name as gym_name, g.branch_name as gym_branch_name, g.instagram_handle as gym_instagram_handle,
               b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url
        FROM route_updates ru
        LEFT JOIN gyms g ON ru.gym_id = g.id
        LEFT JOIN brands b ON g.brand_id = b.id
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (gymId) {
        query += ` WHERE ru.gym_id = $${paramIndex}`;
        params.push(gymId);
        paramIndex++;
      }

      if (type) {
        const whereClause = gymId ? "AND" : "WHERE";
        query += ` ${whereClause} ru.type = $${paramIndex}`;
        params.push(type.toLowerCase());
        paramIndex++;
      }

      query +=
        " ORDER BY ru.update_date DESC LIMIT $" +
        paramIndex +
        " OFFSET $" +
        (paramIndex + 1);
      params.push(limit, offset);

      const result = await pool.query(query, params);
      return result.rows.map((row) => ({
        ...row,
        gym: {
          id: row.gym_id,
          name: row.gym_name,
          branchName: row.gym_branch_name,
          instagramHandle: row.gym_instagram_handle,
          brand: {
            id: row.brand_id,
            name: row.brand_name,
            logoUrl: row.brand_logo_url,
          },
        },
      }));
    },

    routeUpdate: async (_: any, { id }: { id: string }) => {
      const result = await pool.query(
        `
        SELECT ru.*, g.id as gym_id, g.name as gym_name, g.branch_name as gym_branch_name, g.instagram_handle as gym_instagram_handle,
               b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url
        FROM route_updates ru
        LEFT JOIN gyms g ON ru.gym_id = g.id
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE ru.id = $1
      `,
        [id]
      );

      const row = result.rows[0];
      if (!row) return null;

      return {
        ...row,
        gym: {
          id: row.gym_id,
          name: row.gym_name,
          branchName: row.gym_branch_name,
          instagramHandle: row.gym_instagram_handle,
          brand: {
            id: row.brand_id,
            name: row.brand_name,
            logoUrl: row.brand_logo_url,
          },
        },
      };
    },

    crawlLogs: async (_: any, { gymId }: { gymId?: string }) => {
      let query = `
        SELECT cl.*, g.id as gym_id, g.name as gym_name, g.branch_name as gym_branch_name,
               b.id as brand_id, b.name as brand_name
        FROM crawl_logs cl
        LEFT JOIN gyms g ON cl.gym_id = g.id
        LEFT JOIN brands b ON g.brand_id = b.id
      `;

      const params: any[] = [];

      if (gymId) {
        query += " WHERE cl.gym_id = $1";
        params.push(gymId);
      }

      query += " ORDER BY cl.created_at DESC";

      const result = await pool.query(query, params);
      return result.rows.map((row) => ({
        ...row,
        gym: {
          id: row.gym_id,
          name: row.gym_name,
          branchName: row.gym_branch_name,
          brand: {
            id: row.brand_id,
            name: row.brand_name,
          },
        },
      }));
    },

    crawlLog: async (_: any, { id }: { id: string }) => {
      const result = await pool.query(
        `
        SELECT cl.*, g.id as gym_id, g.name as gym_name, g.branch_name as gym_branch_name,
               b.id as brand_id, b.name as brand_name
        FROM crawl_logs cl
        LEFT JOIN gyms g ON cl.gym_id = g.id
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE cl.id = $1
      `,
        [id]
      );

      const row = result.rows[0];
      if (!row) return null;

      return {
        ...row,
        gym: {
          id: row.gym_id,
          name: row.gym_name,
          branchName: row.gym_branch_name,
          brand: {
            id: row.brand_id,
            name: row.brand_name,
          },
        },
      };
    },
  },

  Mutation: {
    createBrand: async (_: any, { input }: { input: any }) => {
      const result = await pool.query(
        "INSERT INTO brands (name, logo_url, website_url) VALUES ($1, $2, $3) RETURNING *",
        [input.name, input.logoUrl, input.websiteUrl]
      );
      const row = result.rows[0];
      return {
        ...row,
        logoUrl: row.logo_url,
        websiteUrl: row.website_url,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
      };
    },

    updateBrand: async (_: any, { id, input }: { id: string; input: any }) => {
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (input.name !== undefined) {
        fields.push(`name = $${paramIndex}`);
        values.push(input.name);
        paramIndex++;
      }
      if (input.logoUrl !== undefined) {
        fields.push(`logo_url = $${paramIndex}`);
        values.push(input.logoUrl);
        paramIndex++;
      }
      if (input.websiteUrl !== undefined) {
        fields.push(`website_url = $${paramIndex}`);
        values.push(input.websiteUrl);
        paramIndex++;
      }

      values.push(id);
      const result = await pool.query(
        `UPDATE brands SET ${fields.join(
          ", "
        )}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
        values
      );
      const row = result.rows[0];
      return {
        ...row,
        logoUrl: row.logo_url,
        websiteUrl: row.website_url,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
      };
    },

    deleteBrand: async (_: any, { id }: { id: string }) => {
      await pool.query("DELETE FROM brands WHERE id = $1", [id]);
      return true;
    },

    createGym: async (_: any, { input }: { input: any }) => {
      const result = await pool.query(
        `
        INSERT INTO gyms (brand_id, name, branch_name, instagram_url, instagram_handle, address, phone, latitude, longitude, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
        [
          input.brandId,
          input.name,
          input.branchName,
          input.instagramUrl,
          input.instagramHandle,
          input.address,
          input.phone,
          input.latitude,
          input.longitude,
          input.isActive,
        ]
      );

      const gym = result.rows[0];
      const brandResult = await pool.query(
        "SELECT * FROM brands WHERE id = $1",
        [gym.brand_id]
      );
      const brand = brandResult.rows[0];

      return {
        ...gym,
        brandId: gym.brand_id,
        branchName: gym.branch_name,
        instagramUrl: gym.instagram_url,
        instagramHandle: gym.instagram_handle,
        isActive: gym.is_active,
        createdAt: formatDate(gym.created_at),
        updatedAt: formatDate(gym.updated_at),
        brand: {
          ...brand,
          logoUrl: brand.logo_url,
          websiteUrl: brand.website_url,
          createdAt: formatDate(brand.created_at),
          updatedAt: formatDate(brand.updated_at),
        },
      };
    },

    updateGym: async (_: any, { id, input }: { id: string; input: any }) => {
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (input.brandId !== undefined) {
        fields.push(`brand_id = $${paramIndex}`);
        values.push(input.brandId);
        paramIndex++;
      }
      if (input.name !== undefined) {
        fields.push(`name = $${paramIndex}`);
        values.push(input.name);
        paramIndex++;
      }
      if (input.branchName !== undefined) {
        fields.push(`branch_name = $${paramIndex}`);
        values.push(input.branchName);
        paramIndex++;
      }
      if (input.instagramUrl !== undefined) {
        fields.push(`instagram_url = $${paramIndex}`);
        values.push(input.instagramUrl);
        paramIndex++;
      }
      if (input.instagramHandle !== undefined) {
        fields.push(`instagram_handle = $${paramIndex}`);
        values.push(input.instagramHandle);
        paramIndex++;
      }
      if (input.address !== undefined) {
        fields.push(`address = $${paramIndex}`);
        values.push(input.address);
        paramIndex++;
      }
      if (input.phone !== undefined) {
        fields.push(`phone = $${paramIndex}`);
        values.push(input.phone);
        paramIndex++;
      }
      if (input.latitude !== undefined) {
        fields.push(`latitude = $${paramIndex}`);
        values.push(input.latitude);
        paramIndex++;
      }
      if (input.longitude !== undefined) {
        fields.push(`longitude = $${paramIndex}`);
        values.push(input.longitude);
        paramIndex++;
      }
      if (input.isActive !== undefined) {
        fields.push(`is_active = $${paramIndex}`);
        values.push(input.isActive);
        paramIndex++;
      }

      values.push(id);
      const result = await pool.query(
        `UPDATE gyms SET ${fields.join(
          ", "
        )}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      const gym = result.rows[0];
      const brandResult = await pool.query(
        "SELECT * FROM brands WHERE id = $1",
        [gym.brand_id]
      );
      const brand = brandResult.rows[0];

      return {
        ...gym,
        brandId: gym.brand_id,
        branchName: gym.branch_name,
        instagramUrl: gym.instagram_url,
        instagramHandle: gym.instagram_handle,
        isActive: gym.is_active,
        createdAt: formatDate(gym.created_at),
        updatedAt: formatDate(gym.updated_at),
        brand: {
          ...brand,
          logoUrl: brand.logo_url,
          websiteUrl: brand.website_url,
          createdAt: formatDate(brand.created_at),
          updatedAt: formatDate(brand.updated_at),
        },
      };
    },

    deleteGym: async (_: any, { id }: { id: string }) => {
      await pool.query("DELETE FROM gyms WHERE id = $1", [id]);
      return true;
    },

    createRouteUpdate: async (_: any, { input }: { input: any }) => {
      const result = await pool.query(
        `
        INSERT INTO route_updates (gym_id, type, update_date, title, description, instagram_post_url, instagram_post_id, image_urls, raw_caption, parsed_data, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `,
        [
          input.gymId,
          input.type,
          input.updateDate,
          input.title,
          input.description,
          input.instagramPostUrl,
          input.instagramPostId,
          input.imageUrls,
          input.rawCaption,
          input.parsedData,
          input.isVerified,
        ]
      );

      const update = result.rows[0];
      const gymResult = await pool.query(
        `
        SELECT g.*, b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url
        FROM gyms g
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE g.id = $1
      `,
        [update.gym_id]
      );

      return {
        ...update,
        gym: {
          id: gymResult.rows[0].id,
          name: gymResult.rows[0].name,
          branchName: gymResult.rows[0].branch_name,
          instagramHandle: gymResult.rows[0].instagram_handle,
          brand: {
            id: gymResult.rows[0].brand_id,
            name: gymResult.rows[0].brand_name,
            logoUrl: gymResult.rows[0].brand_logo_url,
          },
        },
      };
    },

    updateRouteUpdate: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (input.gymId !== undefined) {
        fields.push(`gym_id = $${paramIndex}`);
        values.push(input.gymId);
        paramIndex++;
      }
      if (input.type !== undefined) {
        fields.push(`type = $${paramIndex}`);
        values.push(input.type);
        paramIndex++;
      }
      if (input.updateDate !== undefined) {
        fields.push(`update_date = $${paramIndex}`);
        values.push(input.updateDate);
        paramIndex++;
      }
      if (input.title !== undefined) {
        fields.push(`title = $${paramIndex}`);
        values.push(input.title);
        paramIndex++;
      }
      if (input.description !== undefined) {
        fields.push(`description = $${paramIndex}`);
        values.push(input.description);
        paramIndex++;
      }
      if (input.instagramPostUrl !== undefined) {
        fields.push(`instagram_post_url = $${paramIndex}`);
        values.push(input.instagramPostUrl);
        paramIndex++;
      }
      if (input.instagramPostId !== undefined) {
        fields.push(`instagram_post_id = $${paramIndex}`);
        values.push(input.instagramPostId);
        paramIndex++;
      }
      if (input.imageUrls !== undefined) {
        fields.push(`image_urls = $${paramIndex}`);
        values.push(input.imageUrls);
        paramIndex++;
      }
      if (input.rawCaption !== undefined) {
        fields.push(`raw_caption = $${paramIndex}`);
        values.push(input.rawCaption);
        paramIndex++;
      }
      if (input.parsedData !== undefined) {
        fields.push(`parsed_data = $${paramIndex}`);
        values.push(input.parsedData);
        paramIndex++;
      }
      if (input.isVerified !== undefined) {
        fields.push(`is_verified = $${paramIndex}`);
        values.push(input.isVerified);
        paramIndex++;
      }

      values.push(id);
      const result = await pool.query(
        `UPDATE route_updates SET ${fields.join(
          ", "
        )}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      const update = result.rows[0];
      const gymResult = await pool.query(
        `
        SELECT g.*, b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url
        FROM gyms g
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE g.id = $1
      `,
        [update.gym_id]
      );

      return {
        ...update,
        gym: {
          id: gymResult.rows[0].id,
          name: gymResult.rows[0].name,
          branchName: gymResult.rows[0].branch_name,
          instagramHandle: gymResult.rows[0].instagram_handle,
          brand: {
            id: gymResult.rows[0].brand_id,
            name: gymResult.rows[0].brand_name,
            logoUrl: gymResult.rows[0].brand_logo_url,
          },
        },
      };
    },

    deleteRouteUpdate: async (_: any, { id }: { id: string }) => {
      await pool.query("DELETE FROM route_updates WHERE id = $1", [id]);
      return true;
    },

    createCrawlLog: async (_: any, { input }: { input: any }) => {
      const result = await pool.query(
        `
        INSERT INTO crawl_logs (gym_id, status, posts_found, posts_new, error_message, started_at, completed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
        [
          input.gymId,
          input.status,
          input.postsFound,
          input.postsNew,
          input.errorMessage,
          input.startedAt,
          input.completedAt,
        ]
      );

      const log = result.rows[0];
      const gymResult = await pool.query(
        `
        SELECT g.*, b.id as brand_id, b.name as brand_name
        FROM gyms g
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE g.id = $1
      `,
        [log.gym_id]
      );

      return {
        ...log,
        gym: {
          id: gymResult.rows[0].id,
          name: gymResult.rows[0].name,
          branchName: gymResult.rows[0].branch_name,
          brand: {
            id: gymResult.rows[0].brand_id,
            name: gymResult.rows[0].brand_name,
          },
        },
      };
    },

    updateCrawlLog: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (input.gymId !== undefined) {
        fields.push(`gym_id = $${paramIndex}`);
        values.push(input.gymId);
        paramIndex++;
      }
      if (input.status !== undefined) {
        fields.push(`status = $${paramIndex}`);
        values.push(input.status);
        paramIndex++;
      }
      if (input.postsFound !== undefined) {
        fields.push(`posts_found = $${paramIndex}`);
        values.push(input.postsFound);
        paramIndex++;
      }
      if (input.postsNew !== undefined) {
        fields.push(`posts_new = $${paramIndex}`);
        values.push(input.postsNew);
        paramIndex++;
      }
      if (input.errorMessage !== undefined) {
        fields.push(`error_message = $${paramIndex}`);
        values.push(input.errorMessage);
        paramIndex++;
      }
      if (input.startedAt !== undefined) {
        fields.push(`started_at = $${paramIndex}`);
        values.push(input.startedAt);
        paramIndex++;
      }
      if (input.completedAt !== undefined) {
        fields.push(`completed_at = $${paramIndex}`);
        values.push(input.completedAt);
        paramIndex++;
      }

      values.push(id);
      const result = await pool.query(
        `UPDATE crawl_logs SET ${fields.join(
          ", "
        )} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      const log = result.rows[0];
      const gymResult = await pool.query(
        `
        SELECT g.*, b.id as brand_id, b.name as brand_name
        FROM gyms g
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE g.id = $1
      `,
        [log.gym_id]
      );

      return {
        ...log,
        gym: {
          id: gymResult.rows[0].id,
          name: gymResult.rows[0].name,
          branchName: gymResult.rows[0].branch_name,
          brand: {
            id: gymResult.rows[0].brand_id,
            name: gymResult.rows[0].brand_name,
          },
        },
      };
    },
  },

  Brand: {
    gyms: async (parent: any) => {
      const result = await pool.query(
        `
        SELECT g.*, b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url, b.website_url as brand_website_url
        FROM gyms g
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE g.brand_id = $1
        ORDER BY g.name
      `,
        [parent.id]
      );

      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        branchName: row.branch_name,
        instagramUrl: row.instagram_url,
        instagramHandle: row.instagram_handle,
        address: row.address,
        phone: row.phone,
        latitude: row.latitude,
        longitude: row.longitude,
        isActive: row.is_active,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
        brand: {
          id: row.brand_id,
          name: row.brand_name,
          logoUrl: row.brand_logo_url,
          websiteUrl: row.brand_website_url,
        },
      }));
    },
  },

  Gym: {
    routeUpdates: async (parent: any) => {
      const result = await pool.query(
        `
        SELECT ru.*, g.id as gym_id, g.name as gym_name, g.branch_name as gym_branch_name, g.instagram_handle as gym_instagram_handle,
               b.id as brand_id, b.name as brand_name, b.logo_url as brand_logo_url
        FROM route_updates ru
        LEFT JOIN gyms g ON ru.gym_id = g.id
        LEFT JOIN brands b ON g.brand_id = b.id
        WHERE ru.gym_id = $1
        ORDER BY ru.update_date DESC
      `,
        [parent.id]
      );

      return result.rows.map((row) => ({
        ...row,
        gym: {
          id: row.gym_id,
          name: row.gym_name,
          branchName: row.gym_branch_name,
          instagramHandle: row.gym_instagram_handle,
          brand: {
            id: row.brand_id,
            name: row.brand_name,
            logoUrl: row.brand_logo_url,
          },
        },
      }));
    },
  },
};
