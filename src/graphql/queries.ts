import { gql } from '@apollo/client';

export const GET_ALL_GYMS = gql`
  query GetAllGyms($activeOnly: Boolean = true) {
    gyms(activeOnly: $activeOnly) {
      id
      name
      branchName
      instagramUrl
      instagramHandle
      address
      phone
      latitude
      longitude
      isActive
      createdAt
      updatedAt
      brand {
        id
        name
        logoUrl
        websiteUrl
      }
    }
  }
`;

export const GET_GYM = gql`
  query GetGym($id: ID!) {
    gym(id: $id) {
      id
      name
      branchName
      instagramUrl
      instagramHandle
      address
      phone
      latitude
      longitude
      isActive
      createdAt
      updatedAt
      brand {
        id
        name
        logoUrl
        websiteUrl
      }
    }
  }
`;

export const GET_ROUTE_UPDATES = gql`
  query GetRouteUpdates(
    $gymId: ID
    $type: UpdateType
    $limit: Int = 10
    $offset: Int = 0
  ) {
    routeUpdates(gymId: $gymId, type: $type, limit: $limit, offset: $offset) {
      id
      gymId
      type
      updateDate
      title
      description
      instagramPostUrl
      instagramPostId
      imageUrls
      rawCaption
      parsedData
      isVerified
      createdAt
      updatedAt
      gym {
        id
        name
        branchName
        instagramHandle
        brand {
          id
          name
          logoUrl
        }
      }
    }
  }
`;

export const GET_ROUTE_UPDATE = gql`
  query GetRouteUpdate($id: ID!) {
    routeUpdate(id: $id) {
      id
      gymId
      type
      updateDate
      title
      description
      instagramPostUrl
      instagramPostId
      imageUrls
      rawCaption
      parsedData
      isVerified
      createdAt
      updatedAt
      gym {
        id
        name
        branchName
        instagramHandle
        brand {
          id
          name
          logoUrl
        }
      }
    }
  }
`;

export const GET_BRANDS = gql`
  query GetBrands {
    brands {
      id
      name
      logoUrl
      websiteUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_BRAND = gql`
  query GetBrand($id: ID!) {
    brand(id: $id) {
      id
      name
      logoUrl
      websiteUrl
      createdAt
      updatedAt
      gyms {
        id
        name
        branchName
        isActive
      }
    }
  }
`;

export const GET_CRAWL_LOGS = gql`
  query GetCrawlLogs($gymId: ID) {
    crawlLogs(gymId: $gymId) {
      id
      gymId
      status
      postsFound
      postsNew
      errorMessage
      startedAt
      completedAt
      createdAt
      gym {
        id
        name
        branchName
        brand {
          id
          name
        }
      }
    }
  }
`; 