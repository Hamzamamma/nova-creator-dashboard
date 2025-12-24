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
    // Fetch all data in parallel
    const [shopRes, ordersRes, productsRes, customersRes] = await Promise.all([
      fetch(`https://${shopifyUrl}/admin/api/2024-01/shop.json`, { headers }),
      fetch(`https://${shopifyUrl}/admin/api/2024-01/orders.json?status=any&limit=50`, { headers }),
      fetch(`https://${shopifyUrl}/admin/api/2024-01/products.json?limit=50`, { headers }),
      fetch(`https://${shopifyUrl}/admin/api/2024-01/customers.json?limit=50`, { headers }),
    ])

    const [shopData, ordersData, productsData, customersData] = await Promise.all([
      shopRes.json(),
      ordersRes.json(),
      productsRes.json(),
      customersRes.json(),
    ])

    const shop = shopData.shop || {}
    const orders = ordersData.orders || []
    const products = productsData.products || []
    const customers = customersData.customers || []
    const currency = shop.currency || 'EUR'

    // Calculate metrics
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.total_price || 0)
    }, 0)

    const fulfilledOrders = orders.filter((o: any) => o.fulfillment_status === 'fulfilled').length

    // Recent transactions (orders)
    const recentTransactions = orders.slice(0, 5).map((order: any) => {
      const customerName = order.customer
        ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
        : order.email?.split('@')[0] || 'Cliente'

      const customerEmail = order.customer?.email || order.email || 'N/A'

      // Calculate time ago
      const orderDate = new Date(order.created_at)
      const now = new Date()
      const diffMs = now.getTime() - orderDate.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      let timeAgo = ''
      if (diffDays > 0) {
        timeAgo = `${diffDays} giorni fa`
      } else if (diffHours > 0) {
        timeAgo = `${diffHours} ore fa`
      } else {
        timeAgo = 'Poco fa'
      }

      // Determine status
      let status = 'pending'
      if (order.financial_status === 'paid' && order.fulfillment_status === 'fulfilled') {
        status = 'completed'
      } else if (order.financial_status === 'refunded' || order.cancelled_at) {
        status = 'failed'
      } else if (order.financial_status === 'paid') {
        status = 'pending'
      }

      return {
        id: order.name || `#${order.order_number}`,
        customer: {
          name: customerName || 'Cliente',
          email: customerEmail,
          initials: customerName ? customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'C',
        },
        amount: `${currency} ${parseFloat(order.total_price).toFixed(2)}`,
        status,
        date: timeAgo,
      }
    })

    // Top products - calculate from line items in orders
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {}

    orders.forEach((order: any) => {
      const lineItems = order.line_items || []
      lineItems.forEach((item: any) => {
        const productId = item.product_id?.toString() || item.name
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.name || 'Prodotto',
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[productId].quantity += item.quantity || 1
        productSales[productId].revenue += parseFloat(item.price || 0) * (item.quantity || 1)
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        sales: data.quantity,
        revenue: `${currency} ${data.revenue.toFixed(2)}`,
        revenueValue: data.revenue,
      }))
      .sort((a, b) => b.revenueValue - a.revenueValue)
      .slice(0, 5)

    // If no orders, show products from catalog
    const catalogProducts = products.slice(0, 5).map((product: any, index: number) => ({
      id: product.id,
      name: product.title,
      sales: 0,
      revenue: `${currency} 0.00`,
      revenueValue: 0,
      price: product.variants?.[0]?.price || '0',
      inventory: product.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 0,
    }))

    // Sales chart data - last 7 days
    const salesByDay: { [key: string]: number } = {}
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = dayNames[date.getDay()]
      salesByDay[dayName] = 0
    }

    orders.forEach((order: any) => {
      const orderDate = new Date(order.created_at)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays < 7) {
        const dayName = dayNames[orderDate.getDay()]
        if (salesByDay[dayName] !== undefined) {
          salesByDay[dayName] += parseFloat(order.total_price || 0)
        }
      }
    })

    const salesChartData = Object.entries(salesByDay).map(([day, amount]) => ({
      day,
      sales: Math.round(amount * 100) / 100,
    }))

    return NextResponse.json({
      success: true,
      shop: {
        name: shop.name || 'Store',
        currency,
        domain: shop.domain,
      },
      metrics: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        fulfilledOrders,
        conversionRate: orders.length > 0 ? ((fulfilledOrders / orders.length) * 100).toFixed(1) : '0',
      },
      recentTransactions,
      topProducts: topProducts.length > 0 ? topProducts : catalogProducts,
      salesChartData,
    })

  } catch (error) {
    console.error('Shopify API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
