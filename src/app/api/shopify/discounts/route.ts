import { NextRequest, NextResponse } from "next/server"

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_URL
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN
const API_VERSION = "2024-10"

// GET - Leggi tutti gli sconti da Shopify
export async function GET() {
  try {
    // Ottieni price rules (sconti)
    const priceRulesRes = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/price_rules.json`,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN!,
          "Content-Type": "application/json",
        },
      }
    )

    if (!priceRulesRes.ok) {
      const error = await priceRulesRes.text()
      return NextResponse.json({ success: false, error }, { status: priceRulesRes.status })
    }

    const priceRulesData = await priceRulesRes.json()
    const priceRules = priceRulesData.price_rules || []

    // Per ogni price rule, ottieni i codici sconto
    const scontiCompleti = await Promise.all(
      priceRules.map(async (rule: any) => {
        const codesRes = await fetch(
          `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/price_rules/${rule.id}/discount_codes.json`,
          {
            headers: {
              "X-Shopify-Access-Token": SHOPIFY_TOKEN!,
              "Content-Type": "application/json",
            },
          }
        )
        const codesData = await codesRes.json()
        const codes = codesData.discount_codes || []

        // Determina tipo e valore
        let tipo = "prodotti"
        let tipoLabel = "Sconto prodotti"
        let valore = ""

        if (rule.target_type === "shipping_line") {
          tipo = "spedizione"
          tipoLabel = "Spedizione gratuita"
          valore = "Gratis"
        } else if (rule.value_type === "percentage") {
          valore = `${Math.abs(parseFloat(rule.value))}%`
        } else {
          valore = `€${Math.abs(parseFloat(rule.value))}`
        }

        // Determina stato
        let stato = "attivo"
        const now = new Date()
        const startDate = rule.starts_at ? new Date(rule.starts_at) : null
        const endDate = rule.ends_at ? new Date(rule.ends_at) : null

        if (endDate && now > endDate) {
          stato = "scaduto"
        } else if (startDate && now < startDate) {
          stato = "programmato"
        }

        return {
          id: rule.id.toString(),
          codice: codes[0]?.code || rule.title,
          tipo,
          tipoLabel,
          valore,
          stato,
          utilizzi: rule.usage_count || 0,
          utilizziMax: rule.usage_limit,
          dataInizio: rule.starts_at ? new Date(rule.starts_at).toLocaleDateString("it-IT") : null,
          dataFine: rule.ends_at ? new Date(rule.ends_at).toLocaleDateString("it-IT") : null,
          shopifyId: rule.id,
          discountCodeId: codes[0]?.id,
        }
      })
    )

    return NextResponse.json({
      success: true,
      sconti: scontiCompleti,
      totale: scontiCompleti.length,
    })
  } catch (error) {
    console.error("Errore fetch sconti:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// POST - Crea nuovo sconto su Shopify
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      codice,
      tipo,
      tipoValore,
      valoreSconto,
      applicaA,
      requisitiMinimi,
      importoMinimo,
      quantitaMinima,
      utilizziMax,
      utilizziMaxNumero,
      usoPerCliente,
      dataInizio,
      dataFine,
    } = body

    // Costruisci price rule
    const priceRule: any = {
      title: codice,
      target_type: tipo === "spedizione" ? "shipping_line" : "line_item",
      target_selection: applicaA === "tutti" ? "all" : "entitled",
      allocation_method: "across",
      value_type: tipoValore === "percentuale" ? "percentage" : "fixed_amount",
      value: tipoValore === "percentuale" ? `-${valoreSconto}` : `-${valoreSconto}`,
      customer_selection: "all",
      starts_at: dataInizio ? new Date(dataInizio).toISOString() : new Date().toISOString(),
    }

    // Data fine
    if (dataFine) {
      priceRule.ends_at = new Date(dataFine).toISOString()
    }

    // Requisiti minimi
    if (requisitiMinimi === "importo" && importoMinimo) {
      priceRule.prerequisite_subtotal_range = {
        greater_than_or_equal_to: importoMinimo,
      }
    } else if (requisitiMinimi === "quantita" && quantitaMinima) {
      priceRule.prerequisite_quantity_range = {
        greater_than_or_equal_to: parseInt(quantitaMinima),
      }
    }

    // Limiti utilizzo
    if (utilizziMax && utilizziMaxNumero) {
      priceRule.usage_limit = parseInt(utilizziMaxNumero)
    }
    if (usoPerCliente) {
      priceRule.once_per_customer = true
    }

    // Crea price rule
    const priceRuleRes = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/price_rules.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price_rule: priceRule }),
      }
    )

    if (!priceRuleRes.ok) {
      const error = await priceRuleRes.text()
      return NextResponse.json({ success: false, error }, { status: priceRuleRes.status })
    }

    const priceRuleData = await priceRuleRes.json()
    const createdRule = priceRuleData.price_rule

    // Crea codice sconto associato
    const discountCodeRes = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/price_rules/${createdRule.id}/discount_codes.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discount_code: { code: codice },
        }),
      }
    )

    const discountCodeData = await discountCodeRes.json()

    return NextResponse.json({
      success: true,
      sconto: {
        id: createdRule.id,
        codice: codice,
        shopifyPriceRuleId: createdRule.id,
        shopifyDiscountCodeId: discountCodeData.discount_code?.id,
      },
    })
  } catch (error) {
    console.error("Errore creazione sconto:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// DELETE - Elimina sconto da Shopify
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const priceRuleId = searchParams.get("id")

    if (!priceRuleId) {
      return NextResponse.json({ success: false, error: "ID mancante" }, { status: 400 })
    }

    const res = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/price_rules/${priceRuleId}.json`,
      {
        method: "DELETE",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN!,
        },
      }
    )

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ success: false, error }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Errore eliminazione sconto:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
