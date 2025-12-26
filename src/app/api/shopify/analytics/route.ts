import { NextResponse } from "next/server"

export async function GET() {
  const shopifyUrl = process.env.SHOPIFY_STORE_URL
  const accessToken = process.env.SHOPIFY_ADMIN_TOKEN

  if (!shopifyUrl || !accessToken) {
    return NextResponse.json({ error: "Missing Shopify credentials" }, { status: 500 })
  }

  const headers = {
    "X-Shopify-Access-Token": accessToken,
    "Content-Type": "application/json",
  }

  try {
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

    const orders = ordersList.orders || []

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + parseFloat(order.total_price || 0)
    }, 0)

    const fulfilledOrders = orders.filter((o) => o.fulfillment_status === "fulfilled").length
    const uniqueCustomers = new Set(orders.map((o) => o.customer?.id).filter(Boolean)).size
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    const totalDiscounts = orders.reduce((sum, order) => {
      return sum + parseFloat(order.total_discounts || 0)
    }, 0)

    const totalRefunds = orders.reduce((sum, order) => {
      const refunds = order.refunds || []
      return sum + refunds.reduce((rSum, refund) => {
        return rSum + (refund.transactions?.reduce((tSum, t) => tSum + parseFloat(t.amount || 0), 0) || 0)
      }, 0)
    }, 0)

    const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
    const last7Days = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = dayNames[date.getDay()]
      last7Days[dayName] = 0
    }

    orders.forEach((order) => {
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

    // AOV by day
    const aovByDay = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = dayNames[date.getDay()]
      aovByDay[dayName] = { total: 0, count: 0 }
    }
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays < 7) {
        const dayName = dayNames[orderDate.getDay()]
        if (aovByDay[dayName]) {
          aovByDay[dayName].total += parseFloat(order.total_price || 0)
          aovByDay[dayName].count++
        }
      }
    })
    const aovChartData = Object.entries(aovByDay).map(([giorno, data]) => ({
      giorno,
      aov: data.count > 0 ? parseFloat((data.total / data.count).toFixed(2)) : 0
    }))

    // Sales by channel
    const salesByChannel = {}
    orders.forEach((order) => {
      const channel = order.source_name || "web"
      if (!salesByChannel[channel]) {
        salesByChannel[channel] = { revenue: 0, orders: 0 }
      }
      salesByChannel[channel].revenue += parseFloat(order.total_price || 0)
      salesByChannel[channel].orders++
    })
    const channelData = Object.entries(salesByChannel).map(([name, data]) => ({
      channel: name === "web" ? "Negozio Online" : name === "pos" ? "POS" : name,
      revenue: parseFloat(data.revenue.toFixed(2)),
      orders: data.orders
    }))

    // Returning customers rate
    const customerOrdersMap = {}
    orders.forEach((order) => {
      const customerId = order.customer?.id
      if (customerId) {
        customerOrdersMap[customerId] = (customerOrdersMap[customerId] || 0) + 1
      }
    })
    const totalCustomersCount = Object.keys(customerOrdersMap).length
    const returningCustomersCount = Object.values(customerOrdersMap).filter(count => count > 1).length
    const returningRate = totalCustomersCount > 0 ? ((returningCustomersCount / totalCustomersCount) * 100).toFixed(1) : "0"

    // Customer cohort data
    const cohortData = {}
    const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]
    const seenCustomers = new Set()
    const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    sortedOrders.forEach((order) => {
      const date = new Date(order.created_at)
      const monthKey = monthNames[date.getMonth()] + " " + date.getFullYear()
      const customerId = order.customer?.id
      if (!cohortData[monthKey]) {
        cohortData[monthKey] = { newCustomers: 0, returning: 0 }
      }
      if (customerId) {
        if (seenCustomers.has(customerId)) {
          cohortData[monthKey].returning++
        } else {
          cohortData[monthKey].newCustomers++
          seenCustomers.add(customerId)
        }
      }
    })
    const cohortChartData = Object.entries(cohortData).slice(-6).map(([month, data]) => ({
      month,
      nuovi: data.newCustomers,
      ricorrenti: data.returning
    }))

    return NextResponse.json({
      success: true,
      shop: {
        name: shopData.shop?.name || "Store",
        currency: shopData.shop?.currency || "EUR",
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
      aovChartData,
      channelData,
      returningRate,
      cohortChartData,
      recentOrders: orders.slice(0, 5).map((order) => ({
        id: order.name || order.id,
        customer: order.customer?.first_name
          ? order.customer.first_name + " " + (order.customer.last_name || "")
          : order.email || "Cliente",
        date: new Date(order.created_at).toLocaleDateString("it-IT", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        status: order.fulfillment_status || "pending",
        total: (shopData.shop?.currency || "EUR") + " " + parseFloat(order.total_price).toFixed(2),
        totalPrice: parseFloat(order.total_price),
      })),
    })

  } catch (error) {
    console.error("Shopify API error:", error)
    return NextResponse.json({
      error: "Failed to fetch analytics",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
