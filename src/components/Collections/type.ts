export interface CollectionProps {
  id: number;
  name: string;
  description: string;
  image_url: string;
  number_of_vocabularies: number;
}

export interface AllCollectionProps {
  data: CollectionProps[];
  total: number;
}

export interface CollectionDetails {
  id: number;
  name: string;
  description: string;
  image_url: string;
  number_of_vocabularies: number;
}

export interface CollectionAddForm {
  image_url: string;
  name: string;
  description: string;
}
