export interface User {
  id: string
  email: string
  role: 'company' | 'user'
}

export interface Company {
  id: string
  user_id: string
  name: string
  description?: string
  logo_url?: string
  website_url?: string
  created_at: string
}

export interface Product {
  id: string
  company_id: string
  name: string
  model_number?: string
  category: string
  description: string
  image_url?: string
  is_published: boolean
  moss_index_id?: string
  created_at: string
  companies?: {
    name: string
    logo_url?: string
    description?: string
  }
  knowledge_documents?: KnowledgeDocument[]
}

export interface KnowledgeDocument {
  id: string
  product_id: string
  title: string
  type: 'pdf' | 'text' | 'link' | 'video_link'
  file_url?: string
  external_url?: string
  page_count?: number
  chunk_count?: number
  indexed: boolean
  indexing_error?: string
  created_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  input_type: 'text' | 'voice' | 'image'
  image_url?: string
  sources?: SourceCitation[]
  retrieval_ms?: number
  created_at: Date
}

export interface SourceCitation {
  doc_title: string
  page?: number
  section?: string
  score: number
  snippet: string
}

export interface DiagnosticSession {
  session_token: string
  product_id: string
  diagnostic_step: number
}

export type ProductCategory =
  | 'scooter'
  | 'ac'
  | 'washing_machine'
  | 'electronics'
  | 'appliance'
  | 'other'

export const CATEGORIES: { value: ProductCategory; label: string; icon: string }[] = [
  { value: 'scooter',          label: 'Scooters & Bikes', icon: '🛵' },
  { value: 'ac',               label: 'Air Conditioners', icon: '❄️' },
  { value: 'washing_machine',  label: 'Washing Machines', icon: '🫧' },
  { value: 'electronics',      label: 'Electronics',      icon: '⚡' },
  { value: 'appliance',        label: 'Appliances',       icon: '🏠' },
  { value: 'other',            label: 'Other',            icon: '🔧' },
]
