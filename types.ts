export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  STANDARD = '4:3',
  VERTICAL = '3:4',
}

export interface CreativeTextConfig {
  textContent: string;
  fontStyle: string;
  textSize: string;
  textColor: string;
  textPosition: string;
  textShadow: string;
  backgroundBlur: string;
}

export interface AdConfiguration {
  modelImage: string | null; // Base64
  productImage: string | null; // Base64
  productDescription: string;
  brandText: string;
  creativeText: CreativeTextConfig;
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

export type Theme = 'light' | 'dark' | 'white';

export type View = 'generator' | 'templates' | 'showcase' | 'pricing' | 'auth';

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: any;
  config: Partial<AdConfiguration>;
  color: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}