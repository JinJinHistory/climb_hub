import { gql } from '@apollo/client';

export const CREATE_BRAND = gql`
  mutation CreateBrand($input: CreateBrandInput!) {
    createBrand(input: $input) {
      id
      name
      logoUrl
      websiteUrl
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BRAND = gql`
  mutation UpdateBrand($id: ID!, $input: UpdateBrandInput!) {
    updateBrand(id: $id, input: $input) {
      id
      name
      logoUrl
      websiteUrl
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_BRAND = gql`
  mutation DeleteBrand($id: ID!) {
    deleteBrand(id: $id)
  }
`;

export const CREATE_GYM = gql`
  mutation CreateGym($input: CreateGymInput!) {
    createGym(input: $input) {
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

export const UPDATE_GYM = gql`
  mutation UpdateGym($id: ID!, $input: UpdateGymInput!) {
    updateGym(id: $id, input: $input) {
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

export const DELETE_GYM = gql`
  mutation DeleteGym($id: ID!) {
    deleteGym(id: $id)
  }
`;

export const CREATE_ROUTE_UPDATE = gql`
  mutation CreateRouteUpdate($input: CreateRouteUpdateInput!) {
    createRouteUpdate(input: $input) {
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

export const UPDATE_ROUTE_UPDATE = gql`
  mutation UpdateRouteUpdate($id: ID!, $input: UpdateRouteUpdateInput!) {
    updateRouteUpdate(id: $id, input: $input) {
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

export const DELETE_ROUTE_UPDATE = gql`
  mutation DeleteRouteUpdate($id: ID!) {
    deleteRouteUpdate(id: $id)
  }
`;

export const CREATE_CRAWL_LOG = gql`
  mutation CreateCrawlLog($input: CreateCrawlLogInput!) {
    createCrawlLog(input: $input) {
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

export const UPDATE_CRAWL_LOG = gql`
  mutation UpdateCrawlLog($id: ID!, $input: UpdateCrawlLogInput!) {
    updateCrawlLog(id: $id, input: $input) {
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