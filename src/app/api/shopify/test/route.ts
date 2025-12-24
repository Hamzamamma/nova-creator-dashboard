import { NextResponse } from 'next/server'

export async function GET() {
  const shopifyUrl = process.env.SHOPIFY_STORE_URL
  const accessToken = process.env.SHOPIFY_ADMIN_TOKEN

  if (!shopifyUrl || !accessToken) {
    return NextResponse.json({ error: 'Missing Shopify credentials' }, { status: 500 })
  }

  try {
    // Test: Get shop info
    const response = await fetch(
      `https://${shopifyUrl}/admin/api/2024-01/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        error: 'Shopify API error',
        status: response.status,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()

    // Get orders count
    const ordersResponse = await fetch(
      `https://${shopifyUrl}/admin/api/2024-01/orders/count.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    )
    const ordersData = await ordersResponse.json()

    // Get products count
    const productsResponse = await fetch(
      `https://${shopifyUrl}/admin/api/2024-01/products/count.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    )
    const productsData = await productsResponse.json()

    return NextResponse.json({
      success: true,
      shop: {
        name: data.shop.name,
        email: data.shop.email,
        domain: data.shop.domain,
        currency: data.shop.currency,
      },
      stats: {
        orders: ordersData.count || 0,
        products: productsData.count || 0,
      }
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
