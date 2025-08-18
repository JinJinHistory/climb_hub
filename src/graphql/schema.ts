import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Brand {
    id: ID!
    name: String!
    logoUrl: String
    websiteUrl: String
    createdAt: String!
    updatedAt: String!
    gyms: [Gym!]!
  }

  type Gym {
    id: ID!
    brandId: String!
    name: String!
    branchName: String!
    instagramUrl: String!
    instagramHandle: String!
    address: String
    phone: String
    latitude: Float
    longitude: Float
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
    brand: Brand!
    routeUpdates: [RouteUpdate!]!
  }

  type RouteUpdate {
    id: ID!
    gymId: String!
    type: UpdateType!
    updateDate: String!
    title: String
    description: String
    instagramPostUrl: String
    instagramPostId: String
    imageUrls: [String!]!
    rawCaption: String
    parsedData: JSON
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
    gym: Gym!
  }

  type CrawlLog {
    id: ID!
    gymId: String!
    status: CrawlStatus!
    postsFound: Int!
    postsNew: Int!
    errorMessage: String
    startedAt: String!
    completedAt: String
    createdAt: String!
    gym: Gym!
  }

  enum UpdateType {
    newset
    removal
    partial_removal
    announcement
  }

  enum CrawlStatus {
    success
    failed
    partial
  }

  scalar JSON

  type Query {
    brands: [Brand!]!
    brand(id: ID!): Brand
    gyms(activeOnly: Boolean = true): [Gym!]!
    gym(id: ID!): Gym
    routeUpdates(
      gymId: ID
      type: UpdateType
      limit: Int = 10
      offset: Int = 0
    ): [RouteUpdate!]!
    routeUpdate(id: ID!): RouteUpdate
    crawlLogs(gymId: ID): [CrawlLog!]!
    crawlLog(id: ID!): CrawlLog
  }

  type Mutation {
    createBrand(input: CreateBrandInput!): Brand!
    updateBrand(id: ID!, input: UpdateBrandInput!): Brand!
    deleteBrand(id: ID!): Boolean!

    createGym(input: CreateGymInput!): Gym!
    updateGym(id: ID!, input: UpdateGymInput!): Gym!
    deleteGym(id: ID!): Boolean!

    createRouteUpdate(input: CreateRouteUpdateInput!): RouteUpdate!
    updateRouteUpdate(id: ID!, input: UpdateRouteUpdateInput!): RouteUpdate!
    deleteRouteUpdate(id: ID!): Boolean!

    createCrawlLog(input: CreateCrawlLogInput!): CrawlLog!
    updateCrawlLog(id: ID!, input: UpdateCrawlLogInput!): CrawlLog!
  }

  input CreateBrandInput {
    name: String!
    logoUrl: String
    websiteUrl: String
  }

  input UpdateBrandInput {
    name: String
    logoUrl: String
    websiteUrl: String
  }

  input CreateGymInput {
    brandId: String!
    name: String!
    branchName: String!
    instagramUrl: String!
    instagramHandle: String!
    address: String
    phone: String
    latitude: Float
    longitude: Float
    isActive: Boolean = true
  }

  input UpdateGymInput {
    brandId: String
    name: String
    branchName: String
    instagramUrl: String
    instagramHandle: String
    address: String
    phone: String
    latitude: Float
    longitude: Float
    isActive: Boolean
  }

  input CreateRouteUpdateInput {
    gymId: String!
    type: UpdateType!
    updateDate: String!
    title: String
    description: String
    instagramPostUrl: String
    instagramPostId: String
    imageUrls: [String!] = []
    rawCaption: String
    parsedData: JSON
    isVerified: Boolean = false
  }

  input UpdateRouteUpdateInput {
    gymId: String
    type: UpdateType
    updateDate: String
    title: String
    description: String
    instagramPostUrl: String
    instagramPostId: String
    imageUrls: [String!]
    rawCaption: String
    parsedData: JSON
    isVerified: Boolean
  }

  input CreateCrawlLogInput {
    gymId: String!
    status: CrawlStatus!
    postsFound: Int!
    postsNew: Int!
    errorMessage: String
    startedAt: String!
    completedAt: String
  }

  input UpdateCrawlLogInput {
    gymId: String
    status: CrawlStatus
    postsFound: Int
    postsNew: Int
    errorMessage: String
    startedAt: String
    completedAt: String
  }
`;
