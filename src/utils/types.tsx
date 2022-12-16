export interface Media {
  id: number;
  name: string;
  type: string;
  created: string;
  updated: string;
  duration: number;
  hashed_id: string;
  description: string;
  progress: number;
  status: string;
  thumbnail: Thumbnail;
  project: Project;
  assets: Asset[];
}

export interface Asset {
  url: string;
  width: number;
  height: number;
  fileSize: number;
  contentType: string;
  type: string;
}

export interface Project {
  id: number;
  name: string;
  hashed_id: string;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
