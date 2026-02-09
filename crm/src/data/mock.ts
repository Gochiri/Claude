import { Contact, Opportunity, Property, Conversation, Message, Automation, TeamMember, BusinessConfig } from '@/types'

export const mockBusinessConfig: BusinessConfig = {
  name: 'Inmobiliaria Premium',
  email: 'info@inmobiliariapremium.com',
  phone: '+54 11 5555-0100',
  address: 'Av. Libertador 4500, CABA, Argentina',
  website: 'https://inmobiliariapremium.com',
  timezone: 'America/Argentina/Buenos_Aires',
  currency: 'USD',
  socialMedia: {
    instagram: '@inmobiliariapremium',
    facebook: 'InmobiliariaPremium',
    linkedin: 'inmobiliaria-premium',
  },
}

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'María González', email: 'maria@inmobiliariapremium.com', role: 'admin', phone: '+54 11 5555-0101', active: true },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@inmobiliariapremium.com', role: 'agent', phone: '+54 11 5555-0102', active: true },
  { id: '3', name: 'Ana Martínez', email: 'ana@inmobiliariapremium.com', role: 'agent', phone: '+54 11 5555-0103', active: true },
  { id: '4', name: 'Juan López', email: 'juan@inmobiliariapremium.com', role: 'manager', phone: '+54 11 5555-0104', active: true },
  { id: '5', name: 'Laura Fernández', email: 'laura@inmobiliariapremium.com', role: 'agent', phone: '+54 11 5555-0105', active: false },
]

export const mockContacts: Contact[] = [
  {
    id: 'c1', firstName: 'Roberto', lastName: 'Sánchez', email: 'roberto.sanchez@email.com',
    phone: '+54 11 4444-1001', whatsapp: '+5411444410001', source: 'portal',
    status: 'qualified', tags: ['comprador', 'premium', 'belgrano'],
    notes: 'Busca depto 3 ambientes en Belgrano. Presupuesto USD 250k-350k.',
    assignedTo: '2', createdAt: '2026-01-15T10:30:00Z', updatedAt: '2026-02-05T14:20:00Z',
  },
  {
    id: 'c2', firstName: 'Lucía', lastName: 'Pérez', email: 'lucia.perez@email.com',
    phone: '+54 11 4444-1002', whatsapp: '+54114444100002', source: 'instagram',
    status: 'new', tags: ['alquiler', 'palermo'],
    notes: 'Interesada en alquiler en Palermo. Vio publicación en Instagram.',
    assignedTo: '3', createdAt: '2026-02-01T09:15:00Z', updatedAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 'c3', firstName: 'Martín', lastName: 'Díaz', email: 'martin.diaz@email.com',
    phone: '+54 11 4444-1003', source: 'referral',
    status: 'contacted', tags: ['inversor', 'pozo'],
    notes: 'Inversor. Interesado en proyectos en pozo. Referido por cliente anterior.',
    assignedTo: '2', createdAt: '2026-01-20T16:45:00Z', updatedAt: '2026-02-03T11:30:00Z',
  },
  {
    id: 'c4', firstName: 'Sofía', lastName: 'Torres', email: 'sofia.torres@email.com',
    phone: '+54 11 4444-1004', whatsapp: '+54114444100004', source: 'website',
    status: 'qualified', tags: ['vendedora', 'caballito'],
    notes: 'Quiere vender su depto en Caballito. 2 ambientes, 45m2.',
    assignedTo: '4', createdAt: '2026-01-25T08:00:00Z', updatedAt: '2026-02-04T17:00:00Z',
  },
  {
    id: 'c5', firstName: 'Diego', lastName: 'Fernández', email: 'diego.fernandez@email.com',
    phone: '+54 11 4444-1005', source: 'facebook',
    status: 'contacted', tags: ['comprador', 'nuñez', 'familia'],
    notes: 'Busca casa o PH en Nuñez para familia. Presupuesto USD 400k+.',
    assignedTo: '3', createdAt: '2026-01-28T13:20:00Z', updatedAt: '2026-02-02T10:45:00Z',
  },
  {
    id: 'c6', firstName: 'Valentina', lastName: 'Ruiz', email: 'valentina.ruiz@email.com',
    phone: '+54 11 4444-1006', whatsapp: '+54114444100006', source: 'whatsapp',
    status: 'new', tags: ['alquiler_temporal', 'recoleta'],
    notes: 'Busca alquiler temporal en Recoleta por 6 meses.',
    createdAt: '2026-02-05T11:00:00Z', updatedAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'c7', firstName: 'Andrés', lastName: 'Morales', email: 'andres.morales@email.com',
    phone: '+54 11 4444-1007', source: 'portal',
    status: 'unqualified', tags: ['consulta'],
    notes: 'Solo hacía una consulta general. No tiene intención real de compra.',
    assignedTo: '2', createdAt: '2026-01-10T14:30:00Z', updatedAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'c8', firstName: 'Camila', lastName: 'Herrera', email: 'camila.herrera@email.com',
    phone: '+54 11 4444-1008', whatsapp: '+54114444100008', source: 'instagram',
    status: 'qualified', tags: ['compradora', 'palermo', 'monoambiente'],
    notes: 'Primera compra. Busca monoambiente en Palermo. Crédito hipotecario aprobado.',
    assignedTo: '3', createdAt: '2026-01-22T10:00:00Z', updatedAt: '2026-02-06T16:30:00Z',
  },
]

export const mockProperties: Property[] = [
  {
    id: 'p1', title: 'Departamento 3 ambientes en Belgrano', type: 'apartment', operation: 'sale',
    price: 295000, currency: 'USD', address: 'Av. Cabildo 2100', neighborhood: 'Belgrano',
    city: 'CABA', bedrooms: 2, bathrooms: 1, area: 78, coveredArea: 72,
    description: 'Hermoso departamento de 3 ambientes en el corazón de Belgrano. Luminoso, balcón, cochera.',
    features: ['Balcón', 'Cochera', 'Pileta', 'SUM', 'Seguridad 24hs'],
    images: [], status: 'available', ownerName: 'Carlos Méndez', ownerPhone: '+54 11 3333-0001',
    createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'p2', title: 'Monoambiente moderno en Palermo', type: 'apartment', operation: 'sale',
    price: 125000, currency: 'USD', address: 'Honduras 5500', neighborhood: 'Palermo',
    city: 'CABA', bedrooms: 0, bathrooms: 1, area: 38, coveredArea: 35,
    description: 'Monoambiente a estrenar. Diseño moderno, amenities completos. Ideal primera vivienda o inversión.',
    features: ['Amenities', 'Laundry', 'Bicicletero', 'Terraza común'],
    images: [], status: 'available', ownerName: 'Desarrolladora Norte', ownerPhone: '+54 11 3333-0002',
    createdAt: '2026-01-12T14:00:00Z', updatedAt: '2026-01-30T09:00:00Z',
  },
  {
    id: 'p3', title: 'PH reciclado con jardín en Nuñez', type: 'house', operation: 'sale',
    price: 420000, currency: 'USD', address: 'Av. Crisólogo Larralde 3200', neighborhood: 'Nuñez',
    city: 'CABA', bedrooms: 3, bathrooms: 2, area: 150, coveredArea: 120,
    description: 'PH reciclado a nuevo con jardín propio. 3 dormitorios, 2 baños, garage. Ideal familia.',
    features: ['Jardín', 'Garage', 'Parrilla', 'Terraza', 'Reciclado a nuevo'],
    images: [], status: 'available', ownerName: 'Martha de Gómez', ownerPhone: '+54 11 3333-0003',
    createdAt: '2026-01-05T11:00:00Z', updatedAt: '2026-02-03T15:00:00Z',
  },
  {
    id: 'p4', title: 'Depto 2 amb en Caballito', type: 'apartment', operation: 'sale',
    price: 98000, currency: 'USD', address: 'Av. Rivadavia 5800', neighborhood: 'Caballito',
    city: 'CABA', bedrooms: 1, bathrooms: 1, area: 45, coveredArea: 42,
    description: 'Departamento de 2 ambientes. Muy luminoso, piso alto, vista abierta.',
    features: ['Luminoso', 'Piso alto', 'Ascensor', 'Balcón'],
    images: [], status: 'available', ownerId: 'c4', ownerName: 'Sofía Torres', ownerPhone: '+54 11 4444-1004',
    createdAt: '2026-01-25T08:30:00Z', updatedAt: '2026-02-04T17:30:00Z',
  },
  {
    id: 'p5', title: 'Alquiler 2 amb Palermo Soho', type: 'apartment', operation: 'rent',
    price: 850, currency: 'USD', address: 'Thames 1800', neighborhood: 'Palermo',
    city: 'CABA', bedrooms: 1, bathrooms: 1, area: 52, coveredArea: 48,
    description: 'Depto 2 ambientes amueblado en Palermo Soho. Excelente ubicación.',
    features: ['Amueblado', 'Balcón', 'Laundry'],
    images: [], status: 'available', ownerName: 'Pedro Álvarez', ownerPhone: '+54 11 3333-0005',
    createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'p6', title: 'Alquiler temporal Recoleta', type: 'apartment', operation: 'temporary_rent',
    price: 1200, currency: 'USD', address: 'Av. Alvear 1600', neighborhood: 'Recoleta',
    city: 'CABA', bedrooms: 1, bathrooms: 1, area: 55, coveredArea: 50,
    description: 'Depto amueblado y equipado para alquiler temporal. Zona premium de Recoleta.',
    features: ['Full amueblado', 'Equipado', 'WiFi', 'Cable', 'Seguridad'],
    images: [], status: 'available', ownerName: 'Gloria Vidal', ownerPhone: '+54 11 3333-0006',
    createdAt: '2026-01-20T12:00:00Z', updatedAt: '2026-02-02T14:00:00Z',
  },
  {
    id: 'p7', title: 'Oficina en Microcentro', type: 'office', operation: 'rent',
    price: 2500, currency: 'USD', address: 'Av. Corrientes 800', neighborhood: 'Microcentro',
    city: 'CABA', area: 120, coveredArea: 120,
    description: 'Oficina comercial en pleno microcentro. Piso completo, recepción, 4 privados.',
    features: ['Recepción', '4 privados', 'Sala de reuniones', 'Kitchenette'],
    images: [], status: 'reserved', ownerName: 'Grupo Inmobiliario SA', ownerPhone: '+54 11 3333-0007',
    createdAt: '2026-01-08T09:00:00Z', updatedAt: '2026-02-05T10:00:00Z',
  },
]

export const mockOpportunities: Opportunity[] = [
  {
    id: 'o1', title: 'Roberto Sánchez - Depto Belgrano', contactId: 'c1', contactName: 'Roberto Sánchez',
    stage: 'visit_done', value: 295000, currency: 'USD', propertyId: 'p1',
    propertyTitle: 'Departamento 3 ambientes en Belgrano', probability: 60,
    expectedCloseDate: '2026-03-15', notes: 'Visitó el depto. Le gustó mucho. Pide negociar precio.',
    assignedTo: '2', createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-02-05T14:20:00Z',
  },
  {
    id: 'o2', title: 'Camila Herrera - Monoambiente Palermo', contactId: 'c8', contactName: 'Camila Herrera',
    stage: 'negotiation', value: 125000, currency: 'USD', propertyId: 'p2',
    propertyTitle: 'Monoambiente moderno en Palermo', probability: 75,
    expectedCloseDate: '2026-02-28', notes: 'Ofreció USD 118k. Propietario pide mínimo USD 122k.',
    assignedTo: '3', createdAt: '2026-01-25T10:00:00Z', updatedAt: '2026-02-06T16:30:00Z',
  },
  {
    id: 'o3', title: 'Diego Fernández - PH Nuñez', contactId: 'c5', contactName: 'Diego Fernández',
    stage: 'visit_scheduled', value: 420000, currency: 'USD', propertyId: 'p3',
    propertyTitle: 'PH reciclado con jardín en Nuñez', probability: 30,
    expectedCloseDate: '2026-04-30', notes: 'Visita programada para el sábado.',
    assignedTo: '3', createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-02T10:45:00Z',
  },
  {
    id: 'o4', title: 'Sofía Torres - Venta Caballito', contactId: 'c4', contactName: 'Sofía Torres',
    stage: 'proposal', value: 98000, currency: 'USD', propertyId: 'p4',
    propertyTitle: 'Depto 2 amb en Caballito', probability: 80,
    expectedCloseDate: '2026-02-20', notes: 'Tasación realizada. Firmamos exclusiva por 90 días.',
    assignedTo: '4', createdAt: '2026-01-25T08:30:00Z', updatedAt: '2026-02-04T17:00:00Z',
  },
  {
    id: 'o5', title: 'Lucía Pérez - Alquiler Palermo', contactId: 'c2', contactName: 'Lucía Pérez',
    stage: 'new_lead', value: 850, currency: 'USD', propertyId: 'p5',
    propertyTitle: 'Alquiler 2 amb Palermo Soho', probability: 15,
    expectedCloseDate: '2026-03-01', notes: 'Contacto nuevo desde Instagram.',
    assignedTo: '3', createdAt: '2026-02-01T09:15:00Z', updatedAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 'o6', title: 'Valentina Ruiz - Temp Recoleta', contactId: 'c6', contactName: 'Valentina Ruiz',
    stage: 'contacted', value: 1200, currency: 'USD',  propertyId: 'p6',
    propertyTitle: 'Alquiler temporal Recoleta', probability: 40,
    expectedCloseDate: '2026-02-25', notes: 'Respondió al WhatsApp. Interesada en ver el depto.',
    createdAt: '2026-02-05T11:30:00Z', updatedAt: '2026-02-06T09:00:00Z',
  },
  {
    id: 'o7', title: 'Martín Díaz - Inversión pozo', contactId: 'c3', contactName: 'Martín Díaz',
    stage: 'contacted', value: 200000, currency: 'USD', probability: 20,
    expectedCloseDate: '2026-06-30', notes: 'Interesado en proyectos en pozo. Enviar catálogo.',
    assignedTo: '2', createdAt: '2026-01-20T16:45:00Z', updatedAt: '2026-02-03T11:30:00Z',
  },
]

const conversationMessages: Record<string, Message[]> = {
  conv1: [
    { id: 'm1', conversationId: 'conv1', content: 'Hola, vi el departamento en Belgrano que publicaron. Está disponible?', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-05T10:00:00Z', read: true },
    { id: 'm2', conversationId: 'conv1', content: 'Hola Roberto! Sí, el departamento de Av. Cabildo 2100 sigue disponible. Te gustaría coordinar una visita?', sender: 'agent', channel: 'whatsapp', timestamp: '2026-02-05T10:05:00Z', read: true },
    { id: 'm3', conversationId: 'conv1', content: 'Sí, puede ser el sábado a la mañana?', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-05T10:08:00Z', read: true },
    { id: 'm4', conversationId: 'conv1', content: 'Perfecto, te agendo para el sábado a las 10hs. Te mando la dirección exacta por acá.', sender: 'agent', channel: 'whatsapp', timestamp: '2026-02-05T10:12:00Z', read: true },
    { id: 'm5', conversationId: 'conv1', content: 'Genial, gracias! Nos vemos el sábado.', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-05T10:15:00Z', read: true },
  ],
  conv2: [
    { id: 'm6', conversationId: 'conv2', content: 'Hola! Vi el monoambiente en Palermo en su Instagram. Cuánto sale?', sender: 'contact', channel: 'instagram', timestamp: '2026-02-06T14:00:00Z', read: true },
    { id: 'm7', conversationId: 'conv2', content: 'Hola Camila! El monoambiente está en USD 125.000. Es a estrenar con amenities completos. Te interesaría visitarlo?', sender: 'agent', channel: 'instagram', timestamp: '2026-02-06T14:10:00Z', read: true },
    { id: 'm8', conversationId: 'conv2', content: 'Ya lo visité la semana pasada! Quería saber si hay margen para negociar. Mi presupuesto es USD 118k.', sender: 'contact', channel: 'instagram', timestamp: '2026-02-06T14:15:00Z', read: true },
    { id: 'm9', conversationId: 'conv2', content: 'Entiendo. Déjame consultar con el propietario y te confirmo. El mínimo que me había mencionado es USD 122k.', sender: 'agent', channel: 'instagram', timestamp: '2026-02-06T14:20:00Z', read: true },
    { id: 'm10', conversationId: 'conv2', content: 'Ok, si llega a USD 120k cierro. Avisame!', sender: 'contact', channel: 'instagram', timestamp: '2026-02-06T14:25:00Z', read: false },
  ],
  conv3: [
    { id: 'm11', conversationId: 'conv3', content: 'Buenas tardes, me interesa el alquiler temporal en Recoleta. Está disponible desde marzo?', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-05T11:00:00Z', read: true },
    { id: 'm12', conversationId: 'conv3', content: 'Hola Valentina! Sí, está disponible desde el 1 de marzo. El precio es USD 1.200/mes con un mínimo de 3 meses.', sender: 'agent', channel: 'whatsapp', timestamp: '2026-02-05T11:15:00Z', read: true },
    { id: 'm13', conversationId: 'conv3', content: 'Perfecto, necesito 6 meses. Hay algún descuento por esa cantidad de tiempo?', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-06T09:00:00Z', read: false },
  ],
  conv4: [
    { id: 'm14', conversationId: 'conv4', content: 'Hola, me pasaron su contacto. Estoy buscando una casa o PH en zona Nuñez.', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-01T13:20:00Z', read: true },
    { id: 'm15', conversationId: 'conv4', content: 'Hola Diego! Tenemos varias opciones en Nuñez. Qué presupuesto manejás y cuántos ambientes necesitás?', sender: 'agent', channel: 'whatsapp', timestamp: '2026-02-01T13:30:00Z', read: true },
    { id: 'm16', conversationId: 'conv4', content: 'Somos familia con 2 hijos, así que mínimo 3 dormitorios. Presupuesto arriba de USD 400k.', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-01T13:35:00Z', read: true },
    { id: 'm17', conversationId: 'conv4', content: 'Tengo un PH reciclado ideal para ustedes. 3 dormitorios, jardín, garage. USD 420k. Te armo una visita?', sender: 'agent', channel: 'whatsapp', timestamp: '2026-02-01T13:40:00Z', read: true },
    { id: 'm18', conversationId: 'conv4', content: 'Dale, puede ser el fin de semana?', sender: 'contact', channel: 'whatsapp', timestamp: '2026-02-02T10:00:00Z', read: true },
  ],
  conv5: [
    { id: 'm19', conversationId: 'conv5', content: 'Estimada Sofía, le envío la tasación actualizada de su propiedad en Caballito. El valor de mercado estimado es USD 98.000.', sender: 'agent', channel: 'email', timestamp: '2026-02-03T10:00:00Z', read: true },
    { id: 'm20', conversationId: 'conv5', content: 'Gracias por la tasación. Me parece bien el valor. Cómo seguimos con la exclusiva?', sender: 'contact', channel: 'email', timestamp: '2026-02-03T15:00:00Z', read: true },
    { id: 'm21', conversationId: 'conv5', content: 'Le envío el contrato de exclusiva por 90 días para su revisión. Cualquier duda me consulta.', sender: 'agent', channel: 'email', timestamp: '2026-02-04T09:00:00Z', read: true },
  ],
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv1', contactId: 'c1', contactName: 'Roberto Sánchez', channel: 'whatsapp',
    lastMessage: 'Genial, gracias! Nos vemos el sábado.', lastMessageAt: '2026-02-05T10:15:00Z',
    unreadCount: 0, status: 'open', messages: conversationMessages.conv1,
  },
  {
    id: 'conv2', contactId: 'c8', contactName: 'Camila Herrera', channel: 'instagram',
    lastMessage: 'Ok, si llega a USD 120k cierro. Avisame!', lastMessageAt: '2026-02-06T14:25:00Z',
    unreadCount: 1, status: 'open', messages: conversationMessages.conv2,
  },
  {
    id: 'conv3', contactId: 'c6', contactName: 'Valentina Ruiz', channel: 'whatsapp',
    lastMessage: 'Perfecto, necesito 6 meses. Hay algún descuento por esa cantidad de tiempo?', lastMessageAt: '2026-02-06T09:00:00Z',
    unreadCount: 1, status: 'open', messages: conversationMessages.conv3,
  },
  {
    id: 'conv4', contactId: 'c5', contactName: 'Diego Fernández', channel: 'whatsapp',
    lastMessage: 'Dale, puede ser el fin de semana?', lastMessageAt: '2026-02-02T10:00:00Z',
    unreadCount: 0, status: 'open', messages: conversationMessages.conv4,
  },
  {
    id: 'conv5', contactId: 'c4', contactName: 'Sofía Torres', channel: 'email',
    lastMessage: 'Le envío el contrato de exclusiva por 90 días para su revisión.', lastMessageAt: '2026-02-04T09:00:00Z',
    unreadCount: 0, status: 'open', messages: conversationMessages.conv5,
  },
]

export const mockAutomations: Automation[] = [
  {
    id: 'a1', name: 'Bienvenida nuevo lead', description: 'Envía mensaje de bienvenida cuando se registra un nuevo contacto',
    trigger: 'Nuevo contacto creado', active: true, executionCount: 45, lastExecuted: '2026-02-05T11:00:00Z',
    createdAt: '2026-01-01T10:00:00Z',
    actions: [
      { id: 'act1', type: 'send_whatsapp', config: { message: 'Hola {nombre}! Gracias por contactarnos. Un asesor se comunicará contigo pronto.' } },
      { id: 'act2', type: 'assign_agent', config: { method: 'round_robin' } },
      { id: 'act3', type: 'add_tag', config: { tag: 'nuevo' } },
    ],
  },
  {
    id: 'a2', name: 'Seguimiento post-visita', description: 'Envía email de seguimiento 24hs después de una visita',
    trigger: 'Oportunidad movida a "Visita Realizada"', active: true, executionCount: 12, lastExecuted: '2026-02-04T10:00:00Z',
    createdAt: '2026-01-05T14:00:00Z',
    actions: [
      { id: 'act4', type: 'wait', config: { duration: '24h' } },
      { id: 'act5', type: 'send_email', config: { subject: 'Cómo fue tu visita?', template: 'post_visit_followup' } },
    ],
  },
  {
    id: 'a3', name: 'Alerta lead inactivo', description: 'Notifica al agente si un lead no tiene actividad en 7 días',
    trigger: 'Sin actividad por 7 días', active: true, executionCount: 8, lastExecuted: '2026-02-01T08:00:00Z',
    createdAt: '2026-01-10T09:00:00Z',
    actions: [
      { id: 'act6', type: 'send_email', config: { to: 'agent', subject: 'Lead inactivo: {contacto}', template: 'inactive_alert' } },
      { id: 'act7', type: 'add_tag', config: { tag: 'seguimiento_pendiente' } },
    ],
  },
  {
    id: 'a4', name: 'Nurturing compradores', description: 'Secuencia de emails con propiedades nuevas para compradores activos',
    trigger: 'Cada 7 días para contactos con tag "comprador"', active: false, executionCount: 0,
    createdAt: '2026-02-01T10:00:00Z',
    actions: [
      { id: 'act8', type: 'condition', config: { field: 'tags', operator: 'contains', value: 'comprador' } },
      { id: 'act9', type: 'send_email', config: { subject: 'Nuevas propiedades para ti', template: 'new_properties_digest' } },
    ],
  },
]
