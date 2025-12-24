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
    // Fetch multiple data in parallel
    const [shopRes, ordersRes, productsRes, ordersListRes] = await Promise.all([
      fetch(`https://${shopifyUrl}/admin/api/2024-01/shop.json`, { headers }),
      fetch(`https://${shopifyUrl}/admin/api/2024-01/orders/count.json`, { headers }),
      fetch(`https://${shopifyUrl}/admin/api/2024-01/products/count.json`, { headers }),
      fetch(`https://${shopifyUrl}/admin/api/2024-01/orders.json?status=any&limit=50`, { headers }),
    ])

    const [shopData, ordersCount, productsCount, ordersList] = await Promise.all([
      shopRes.json(),
      ordersRes.json(),
      productsRes.json(),
      ordersListRes.json(),
    ])

    // Calculate analytics from orders
    const orders = ordersList.orders || []

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.total_price || 0)
    }, 0)

    // Calculate fulfilled orders
    const fulfilledOrders = orders.filter((o: any) => o.fulfillment_status === 'fulfilled').length

    // Get unique customers
    const uniqueCustomers = new Set(orders.map((o: any) => o.customer?.id).filter(Boolean)).size

    // Calculate average order value
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    // Calculate discounts total
    const totalDiscounts = orders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.total_discounts || 0)
    }, 0)

    // Calculate refunds
    const totalRefunds = orders.reduce((sum: number, order: any) => {
      const refunds = order.refunds || []
      return sum + refunds.reduce((rSum: number, refund: any) => {
        return rSum + refund.transactions?.reduce((tSum: number, t: any) => tSum + parseFloat(t.amount || 0), 0) || 0
      }, 0)
    }, 0)

    // Orders by day (last 7 days)
    const last7Days: { [key: string]: number } = {}
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = dayNames[date.getDay()]
      last7Days[dayName] = 0
    }

    orders.forEach((order: any) => {
      const orderDate = new Date(order.created_at)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays < 7) {
        const dayName = dayNames[orderDate.getDay()]
        if (last7Days[dayName] !== undefined) {
          last7Days[dayName]++
        }
      }
    })

    const ordersChartData = Object.entries(last7Days).map(([giorno, ordini]) => ({
      giorno,
      ordini
    }))

    return NextResponse.json({
      success: true,
      shop: {
        name: shopData.shop?.name || 'Store',
        currency: shopData.shop?.currency || 'EUR',
        domain: shopData.shop?.domain,
      },
      metrics: {
        totalRevenue: totalRevenue.toFixed(2),
        ordersCount: ordersCount.count || orders.length,
        productsCount: productsCount.count || 0,
        fulfilledOrders,
        uniqueCustomers,
        avgOrderValue: avgOrderValue.toFixed(2),
        totalDiscounts: totalDiscounts.toFixed(2),
        totalRefunds: totalRefunds.toFixed(2),
      },
      ordersChartData,
      recentOrders: orders.slice(0, 5).map((order: any) => ({
        id: order.name || order.id,
        customer: order.customer?.first_name
          ? `${order.customer.first_name} ${order.customer.last_name || ''}`
          : order.email || 'Cliente',
        date: new Date(order.created_at).toLocaleDateString('it-IT', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        status: order.fulfillment_status || 'pending',
        total: `${shopData.shop?.currency || 'EUR'} ${parseFloat(order.total_price).toFixed(2)}`,
        totalPrice: parseFloat(order.total_price),
      })),
    })

  } catch (error) {
    console.error('Shopify API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
