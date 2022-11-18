export interface BlogEntry {
  slug: string;
  title: string;
  resume: string;
  content: string;
  images?: PostImages
}

export interface PostImages {
  title?: string;
  content?: string;
}