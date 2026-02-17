
export interface FallingItem {
  id: number;
  left: number;
  delay: number;
  duration: number;
  type: 'chocolate' | 'cat';
  rotation: number;
  size: number;
}

export interface CatGif {
  id: string;
  url: string;
  x: number;
  y: number;
}
