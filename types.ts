export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  STANDARD = '4:3',
  VERTICAL = '3:4',
}

export interface AdConfiguration {
  modelImage: string | null; // Base64
  productImage: string | null; // Base64
  productDescription: string;
  brandText: string;
  sceneDescription: string;
  aspectRatio: AspectRatio;
  mode: 'auto' | 'object' | 'garment' | 'person';
}

export interface GenerationResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export type OptimizeTarget = 'product' | 'scene';