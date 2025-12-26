"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Search, Package, ShoppingBag, Gift, Users, Calendar, Tag, Plus, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

function BuyXGetYContent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    metodo: "codice",
    codice: "",
    titolo: "",
    // Cliente compra
    clienteCompra: {
      tipo: "quantita", // quantita o importo
      quantita: "2",
      importoMinimo: "",
      applicaA: "tutti", // tutti, collezioni, prodotti
      collezioni: [] as string[],
      prodotti: [] as string[],
    },
    // Cliente riceve
    clienteRiceve: {
      tipo: "prodottiSpecifici", // stessiProdotti, prodottiSpecifici
      quantita: "1",
      applicaA: "tutti",
      collezioni: [] as string[],
      prodotti: [] as string[],
      sconto: {
        tipo: "percentuale", // percentuale, fisso, gratis
        valore: "100",
      },
    },
    // Altri settings
    clientiEligibili: "tutti",
    utilizziMax: false,
    utilizziMaxNumero: "",
    usoPerCliente: false,
    combinazioni: {
      altriScontiProdotto: false,
      scontiOrdine: false,
      scontiSpedizione: true,
    },
    dataInizio: new Date().toISOString().split("T")[0],
    oraInizio: "00:00",
    dataFine: "",
    oraFine: "",
    impostaFine: false,
  });

  const generaCodice = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codice = "";
    for (let i = 0; i < 8; i++) {
      codice += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, codice });
  };

  const handleSalva = () => {
    console.log("Salva sconto Buy X Get Y:", formData);
    router.push("/sconti");
  };

  const getScontoLabel = () => {
    if (formData.clienteRiceve.sconto.tipo === "gratis") return "Gratis";
    if (formData.clienteRiceve.sconto.tipo === "percentuale") return `${formData.clienteRiceve.sconto.valore}% di sconto`;
    return `${formData.clienteRiceve.sconto.valore} EUR di sconto`;
  };

  return (
    <div className="flex gap-6">
      {/* Colonna principale */}
      <div className="flex-1 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/sconti" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buy X get Y</h1>
            <p className="text-sm text-gray-500">Crea una promozione "Compra X, Ottieni Y"</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Metodo */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Metodo</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="metodo" value="codice" checked={formData.metodo === "codice"} onChange={(e) => setFormData({ ...formData, metodo: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Codice sconto</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="metodo" value="automatico" checked={formData.metodo === "automatico"} onChange={(e) => setFormData({ ...formData, metodo: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Sconto automatico</span>
              </label>
            </div>

            {formData.metodo === "codice" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Codice sconto</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.codice} onChange={(e) => setFormData({ ...formData, codice: e.target.value.toUpperCase() })} placeholder="es. PRENDI2PAGHI1" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button onClick={generaCodice} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <RefreshCw size={16} />
                    Genera
                  </button>
                </div>
              </div>
            )}

            {formData.metodo === "automatico" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
                <input type="text" value={formData.titolo} onChange={(e) => setFormData({ ...formData, titolo: e.target.value })} placeholder="es. Compra 2, ottieni 1 gratis" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" />
              </div>
            )}
          </div>

          {/* Cliente compra */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingBag size={16} className="text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Cliente compra</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo requisito</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="clienteCompraTipo" value="quantita" checked={formData.clienteCompra.tipo === "quantita"} onChange={(e) => setFormData({ ...formData, clienteCompra: { ...formData.clienteCompra, tipo: e.target.value } })} className="w-4 h-4 text-blue-600" />
                    <span>Quantita minima di articoli</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="clienteCompraTipo" value="importo" checked={formData.clienteCompra.tipo === "importo"} onChange={(e) => setFormData({ ...formData, clienteCompra: { ...formData.clienteCompra, tipo: e.target.value } })} className="w-4 h-4 text-blue-600" />
                    <span>Importo minimo</span>
                  </label>
                </div>
              </div>

              {formData.clienteCompra.tipo === "quantita" && (
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantita</label>
                  <input type="number" value={formData.clienteCompra.quantita} onChange={(e) => setFormData({ ...formData, clienteCompra: { ...formData.clienteCompra, quantita: e.target.value } })} min="1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
              )}

              {formData.clienteCompra.tipo === "importo" && (
                <div className="w-48 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Importo minimo</label>
                  <input type="number" value={formData.clienteCompra.importoMinimo} onChange={(e) => setFormData({ ...formData, clienteCompra: { ...formData.clienteCompra, importoMinimo: e.target.value } })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg pr-12" />
                  <span className="absolute right-4 bottom-2.5 text-gray-500">EUR</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Da qualsiasi articolo di</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="clienteCompraApplica" value="tutti" checked={formData.clienteCompra.applicaA === "tutti"} onChange={(e) => setFormData({ ...formData, clienteCompra: { ...formData.clienteCompra, applicaA: e.target.value } })} className="w-4 h-4 text-blue-600" />
                    <span>Tutti i prodotti</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="clienteCompraApplica" value="collezioni" checked={formData.clienteCompra.applicaA === "collezioni"} onChange={(e) => setFormData({ ...formData, clienteCompra: { ...formData.clienteCompra, applicaA: e.target.value } })} className="w-4 h-4 text-blue-600" />
                    <span>Collezioni specifiche</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="clienteCompraApplica" value="prodotti" checked={formData.clienteCompra.applicaA === "prodotti"} onChange={(e) => setFormData({ ...formData, clienteCompra: { ...formData.clienteCompra, applicaA: e.target.value } })} className="w-4 h-4 text-blue-600" />
                    <span>Prodotti specifici</span>
                  </label>
                </div>

                {formData.clienteCompra.applicaA !== "tutti" && (
                  <div className="mt-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" placeholder={formData.clienteCompra.applicaA === "collezioni" ? "Cerca collezioni..." : "Cerca prodotti..."} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cliente riceve */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Gift size={16} className="text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Cliente riceve</h2>
            </div>

            <div className="space-y-4">
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantita</label>
                <input type="number" value={formData.clienteRiceve.quantita} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, quantita: e.target.value } })} min="1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Articoli da</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="clienteRiceveTipo" value="stessiProdotti" checked={formData.clienteRiceve.tipo === "stessiProdotti"} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, tipo: e.target.value } })} className="w-4 h-4 text-blue-600" />
                    <span>Stessi prodotti che il cliente compra</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="clienteRiceveTipo" value="prodottiSpecifici" checked={formData.clienteRiceve.tipo === "prodottiSpecifici"} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, tipo: e.target.value } })} className="w-4 h-4 text-blue-600" />
                    <span>Prodotti specifici</span>
                  </label>
                </div>

                {formData.clienteRiceve.tipo === "prodottiSpecifici" && (
                  <div className="mt-3 ml-6 space-y-3">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="clienteRiceveApplica" value="tutti" checked={formData.clienteRiceve.applicaA === "tutti"} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, applicaA: e.target.value } })} className="w-4 h-4 text-blue-600" />
                        <span>Tutti i prodotti</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="clienteRiceveApplica" value="collezioni" checked={formData.clienteRiceve.applicaA === "collezioni"} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, applicaA: e.target.value } })} className="w-4 h-4 text-blue-600" />
                        <span>Collezioni specifiche</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="clienteRiceveApplica" value="prodotti" checked={formData.clienteRiceve.applicaA === "prodotti"} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, applicaA: e.target.value } })} className="w-4 h-4 text-blue-600" />
                        <span>Prodotti specifici</span>
                      </label>
                    </div>

                    {formData.clienteRiceve.applicaA !== "tutti" && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Cerca..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Con uno sconto di</label>
                <div className="flex gap-3">
                  <select value={formData.clienteRiceve.sconto.tipo} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, sconto: { ...formData.clienteRiceve.sconto, tipo: e.target.value } } })} className="px-4 py-2.5 border border-gray-300 rounded-lg">
                    <option value="percentuale">Percentuale</option>
                    <option value="fisso">Importo fisso</option>
                    <option value="gratis">Gratis</option>
                  </select>

                  {formData.clienteRiceve.sconto.tipo !== "gratis" && (
                    <div className="relative w-32">
                      <input type="number" value={formData.clienteRiceve.sconto.valore} onChange={(e) => setFormData({ ...formData, clienteRiceve: { ...formData.clienteRiceve, sconto: { ...formData.clienteRiceve.sconto, valore: e.target.value } } })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg pr-12" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{formData.clienteRiceve.sconto.tipo === "percentuale" ? "%" : "EUR"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Idoneita clienti */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Idoneita dei clienti</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="clienti" value="tutti" checked={formData.clientiEligibili === "tutti"} onChange={(e) => setFormData({ ...formData, clientiEligibili: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Tutti i clienti</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="clienti" value="segmenti" checked={formData.clientiEligibili === "segmenti"} onChange={(e) => setFormData({ ...formData, clientiEligibili: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Segmenti specifici</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="clienti" value="clienti" checked={formData.clientiEligibili === "clienti"} onChange={(e) => setFormData({ ...formData, clientiEligibili: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Clienti specifici</span>
              </label>
            </div>
          </div>

          {/* Utilizzi massimi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Utilizzi massimi</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox checked={formData.utilizziMax} onCheckedChange={(checked) => setFormData({ ...formData, utilizziMax: checked as boolean })} />
                <div className="flex-1">
                  <span className="text-sm">Limita numero totale di utilizzi</span>
                  {formData.utilizziMax && (
                    <input type="number" value={formData.utilizziMaxNumero} onChange={(e) => setFormData({ ...formData, utilizziMaxNumero: e.target.value })} placeholder="Numero" className="mt-2 w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={formData.usoPerCliente} onCheckedChange={(checked) => setFormData({ ...formData, usoPerCliente: checked as boolean })} />
                <span className="text-sm">Limita a un utilizzo per cliente</span>
              </div>
            </div>
          </div>

          {/* Combinazioni */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Combinazioni</h2>
            <p className="text-sm text-gray-500 mb-4">Questo sconto puo essere combinato con:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox checked={formData.combinazioni.altriScontiProdotto} onCheckedChange={(checked) => setFormData({ ...formData, combinazioni: { ...formData.combinazioni, altriScontiProdotto: checked as boolean } })} />
                <span className="text-sm">Altri sconti sui prodotti</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={formData.combinazioni.scontiOrdine} onCheckedChange={(checked) => setFormData({ ...formData, combinazioni: { ...formData.combinazioni, scontiOrdine: checked as boolean } })} />
                <span className="text-sm">Sconti sull'ordine</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={formData.combinazioni.scontiSpedizione} onCheckedChange={(checked) => setFormData({ ...formData, combinazioni: { ...formData.combinazioni, scontiSpedizione: checked as boolean } })} />
                <span className="text-sm">Sconti sulla spedizione</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Date di validita</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data inizio</label>
                <input type="date" value={formData.dataInizio} onChange={(e) => setFormData({ ...formData, dataInizio: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ora inizio</label>
                <input type="time" value={formData.oraInizio} onChange={(e) => setFormData({ ...formData, oraInizio: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Checkbox checked={formData.impostaFine} onCheckedChange={(checked) => setFormData({ ...formData, impostaFine: checked as boolean })} />
              <span className="text-sm">Imposta data di fine</span>
            </div>
            {formData.impostaFine && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data fine</label>
                  <input type="date" value={formData.dataFine} onChange={(e) => setFormData({ ...formData, dataFine: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ora fine</label>
                  <input type="time" value={formData.oraFine} onChange={(e) => setFormData({ ...formData, oraFine: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
              </div>
            )}
          </div>

          {/* Bottoni */}
          <div className="flex justify-end gap-3 pb-6">
            <Link href="/sconti" className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</Link>
            <button onClick={handleSalva} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Salva sconto</button>
          </div>
        </div>
      </div>

      {/* Riepilogo laterale */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
          <h3 className="font-semibold text-gray-900 mb-4">Riepilogo</h3>

          <div className="space-y-4">
            {/* Tipo */}
            <div className="flex items-start gap-3">
              <Tag size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Tipo</p>
                <p className="text-sm font-medium">Buy X Get Y</p>
              </div>
            </div>

            {/* Codice */}
            {formData.metodo === "codice" && formData.codice && (
              <div className="flex items-start gap-3">
                <Tag size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Codice</p>
                  <p className="text-sm font-medium">{formData.codice}</p>
                </div>
              </div>
            )}

            {/* Compra */}
            <div className="flex items-start gap-3">
              <ShoppingBag size={16} className="text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Cliente compra</p>
                <p className="text-sm font-medium">
                  {formData.clienteCompra.tipo === "quantita"
                    ? `${formData.clienteCompra.quantita} articoli`
                    : `Min. ${formData.clienteCompra.importoMinimo || "0"} EUR`}
                </p>
              </div>
            </div>

            {/* Riceve */}
            <div className="flex items-start gap-3">
              <Gift size={16} className="text-green-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Cliente riceve</p>
                <p className="text-sm font-medium">{formData.clienteRiceve.quantita} articolo - {getScontoLabel()}</p>
              </div>
            </div>

            {/* Clienti */}
            <div className="flex items-start gap-3">
              <Users size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Clienti</p>
                <p className="text-sm font-medium">{formData.clientiEligibili === "tutti" ? "Tutti" : "Specifici"}</p>
              </div>
            </div>

            {/* Data */}
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Inizio</p>
                <p className="text-sm font-medium">{formData.dataInizio}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Combinabile con</h4>
            <div className="flex flex-wrap gap-1">
              {formData.combinazioni.altriScontiProdotto && <Badge variant="outline" className="text-xs">Prodotto</Badge>}
              {formData.combinazioni.scontiOrdine && <Badge variant="outline" className="text-xs">Ordine</Badge>}
              {formData.combinazioni.scontiSpedizione && <Badge variant="outline" className="text-xs">Spedizione</Badge>}
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">
              <strong>Esempio:</strong> Compra {formData.clienteCompra.quantita} articoli, ricevi {formData.clienteRiceve.quantita} {getScontoLabel().toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyXGetYPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <BuyXGetYContent />
    </Suspense>
  );
}
