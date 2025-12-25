import { NextRequest, NextResponse } from 'next/server'

// Shopify webhook endpoint
// Riceve notifiche in tempo reale quando ci sono nuovi ordini, prodotti, ecc.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const topic = request.headers.get('x-shopify-topic')
    const shop = request.headers.get('x-shopify-shop-domain')

    console.log(`[Webhook] Received ${topic} from ${shop}`)
    console.log('[Webhook] Data:', JSON.stringify(body, null, 2))

    // Gestisci diversi tipi di webhook
    switch (topic) {
      case 'orders/create':
        console.log('[Webhook] Nuovo ordine ricevuto:', body.name)
        // Qui puoi aggiungere logica per notificare il frontend
        // o salvare nel database
        break

      case 'orders/updated':
        console.log('[Webhook] Ordine aggiornato:', body.name)
        break

      case 'orders/fulfilled':
        console.log('[Webhook] Ordine evaso:', body.name)
        break

      case 'products/create':
        console.log('[Webhook] Nuovo prodotto:', body.title)
        break

      case 'products/update':
        console.log('[Webhook] Prodotto aggiornato:', body.title)
        break

      case 'customers/create':
        console.log('[Webhook] Nuovo cliente:', body.email)
        break

      default:
        console.log('[Webhook] Topic non gestito:', topic)
    }

    // Rispondi sempre 200 OK a Shopify
    return NextResponse.json({ received: true, topic }, { status: 200 })

  } catch (error) {
    console.error('[Webhook] Errore:', error)
    // Anche in caso di errore, rispondi 200 per evitare retry infiniti
    return NextResponse.json({ error: 'Processing failed' }, { status: 200 })
  }
}

// Shopify verifica l'endpoint con GET
export async function GET() {
  return NextResponse.json({
    status: 'Webhook endpoint attivo',
    message: 'Usa POST per ricevere webhook da Shopify'
  })
}
