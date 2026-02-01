export const BlogsTypes = {
  posts: "posts",
} as const

export type BlogType = (typeof BlogsTypes)[keyof typeof BlogsTypes]
