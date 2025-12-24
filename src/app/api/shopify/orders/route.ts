import { NextResponse } from 'next/server'

export async function GET() {
  const shopifyUrl = process.env.SHOPIFY_STORE_URL
  const accessToken = process.env.SHOPIFY_ADMIN_TOKEN

  if (!shopifyUrl || !accessToken) {
    return NextResponse.json({ error: 'Missing Shopify credentials' }, { status: 500 })
  }

  const headers = {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  }

  try {
    // Fetch orders
    const ordersRes = await fetch(
      `https://${shopifyUrl}/admin/api/2024-01/orders.json?status=any&limit=100`,
      { headers }
    )
    const ordersData = await ordersRes.json()
    const orders = ordersData.orders || []

    // Get shop info for currency
    const shopRes = await fetch(`https://${shopifyUrl}/admin/api/2024-01/shop.json`, { headers })
    const shopData = await shopRes.json()
    const currency = shopData.shop?.currency || 'EUR'

    // Calculate stats
    const totalOrders = orders.length
    const totalItems = orders.reduce((sum: number, order: any) => {
      return sum + (order.line_items?.reduce((s: number, item: any) => s + (item.quantity || 1), 0) || 0)
    }, 0)

    const refundedOrders = orders.filter((o: any) => o.financial_status === 'refunded').length
    const fulfilledOrders = orders.filter((o: any) => o.fulfillment_status === 'fulfilled').length
    const deliveredOrders = fulfilledOrders // In Shopify fulfilled = delivered

    // Orders by day for chart
    const ordersByDay: { [key: string]: number } = {}
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = dayNames[date.getDay()]
      ordersByDay[dayName] = 0
    }

    orders.forEach((order: any) => {
      const orderDate = new Date(order.created_at)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays < 7) {
        const dayName = dayNames[orderDate.getDay()]
        if (ordersByDay[dayName] !== undefined) {
          ordersByDay[dayName]++
        }
      }
    })

    const chartData = Object.entries(ordersByDay).map(([giorno, ordini]) => ({
      giorno,
      ordini,
    }))

    // Top products
    const productSales: { [key: string]: { nome: string; vendite: number } } = {}
    orders.forEach((order: any) => {
      order.line_items?.forEach((item: any) => {
        const name = item.name || 'Prodotto'
        if (!productSales[name]) {
          productSales[name] = { nome: name, vendite: 0 }
        }
        productSales[name].vendite += item.quantity || 1
      })
    })

    const topProdotti = Object.values(productSales)
      .sort((a, b) => b.vendite - a.vendite)
      .slice(0, 4)

    // Recent orders for table
    const ordiniRecenti = orders.slice(0, 10).map((order: any) => {
      const customerName = order.customer
        ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
        : order.email?.split('@')[0] || 'Cliente'

      const firstProduct = order.line_items?.[0]?.name || 'Prodotto'

      // Determine status
      let stato = 'in_lavorazione'
      if (order.fulfillment_status === 'fulfilled') {
        stato = 'consegnato'
      } else if (order.fulfillment_status === 'partial') {
        stato = 'spedito'
      } else if (order.cancelled_at) {
        stato = 'annullato'
      }

      return {
        id: order.name || `#${order.order_number}`,
        prodotto: firstProduct,
        cliente: customerName,
        data: new Date(order.created_at).toLocaleDateString('it-IT', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        stato,
        totale: `${currency} ${parseFloat(order.total_price).toFixed(2)}`,
      }
    })

    return NextResponse.json({
      success: true,
      currency,
      stats: {
        totalOrders,
        totalItems,
        refundedOrders,
        fulfilledOrders,
        deliveredOrders,
        refundRate: totalOrders > 0 ? ((refundedOrders / totalOrders) * 100).toFixed(1) : '0',
        fulfillmentRate: totalOrders > 0 ? ((fulfilledOrders / totalOrders) * 100).toFixed(0) : '0',
      },
      chartData,
      topProdotti,
      ordiniRecenti,
    })

  } catch (error) {
    console.error('Shopify API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
