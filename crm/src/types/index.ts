export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  whatsapp?: string
  source: 'website' | 'whatsapp' | 'instagram' | 'facebook' | 'referral' | 'portal' | 'other'
  status: 'new' | 'contacted' | 'qualified' | 'unqualified'
  tags: string[]
  notes: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface Opportunity {
  id: string
  title: string
  contactId: string
  contactName: string
  stage: 'new_lead' | 'contacted' | 'visit_scheduled' | 'visit_done' | 'negotiation' | 'proposal' | 'closed_won' | 'closed_lost'
  value: number
  currency: string
  propertyId?: string
  propertyTitle?: string
  probability: number
  expectedCloseDate: string
  notes: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface Property {
  id: string
  title: string
  type: 'apartment' | 'house' | 'land' | 'commercial' | 'office' | 'warehouse'
  operation: 'sale' | 'rent' | 'temporary_rent'
  price: number
  currency: string
  address: string
  neighborhood: string
  city: string
  bedrooms?: number
  bathrooms?: number
  area: number
  coveredArea?: number
  description: string
  features: string[]
  images: string[]
  status: 'available' | 'reserved' | 'sold' | 'rented'
  ownerId?: string
  ownerName?: string
  ownerPhone?: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  contactId: string
  contactName: string
  channel: 'whatsapp' | 'email' | 'instagram' | 'facebook' | 'sms'
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  status: 'open' | 'closed' | 'pending'
  messages: Message[]
}

export interface Message {
  id: string
  conversationId: string
  content: string
  sender: 'agent' | 'contact'
  channel: 'whatsapp' | 'email' | 'instagram' | 'facebook' | 'sms'
  timestamp: string
  read: boolean
}

export interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  actions: AutomationAction[]
  active: boolean
  executionCount: number
  lastExecuted?: string
  createdAt: string
}

export interface AutomationAction {
  id: string
  type: 'send_whatsapp' | 'send_email' | 'assign_agent' | 'move_stage' | 'add_tag' | 'wait' | 'condition'
  config: Record<string, string>
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'agent' | 'manager'
  avatar?: string
  phone?: string
  active: boolean
}

export interface BusinessConfig {
  name: string
  logo?: string
  email: string
  phone: string
  address: string
  website?: string
  timezone: string
  currency: string
  socialMedia: {
    instagram?: string
    facebook?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
}

export type PipelineStage = {
  id: Opportunity['stage']
  label: string
  color: string
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'new_lead', label: 'Nuevo Lead', color: '#6366f1' },
  { id: 'contacted', label: 'Contactado', color: '#8b5cf6' },
  { id: 'visit_scheduled', label: 'Visita Agendada', color: '#a855f7' },
  { id: 'visit_done', label: 'Visita Realizada', color: '#d946ef' },
  { id: 'negotiation', label: 'Negociación', color: '#f59e0b' },
  { id: 'proposal', label: 'Propuesta', color: '#f97316' },
  { id: 'closed_won', label: 'Ganada', color: '#22c55e' },
  { id: 'closed_lost', label: 'Perdida', color: '#ef4444' },
]
