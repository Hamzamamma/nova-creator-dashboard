"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Search, X, Users, Tag, Calendar, Percent, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

function NuovoScontoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tipo = searchParams.get("tipo") || "prodotti";

  const [formData, setFormData] = useState({
    metodo: "codice",
    codice: "",
    titolo: "",
    valoreSconto: "",
    tipoValore: "percentuale",
    applicaA: "tutti",
    collezioniSelezionate: [] as string[],
    prodottiSelezionati: [] as string[],
    requisitiMinimi: "nessuno",
    importoMinimo: "",
    quantitaMinima: "",
    clientiEligibili: "tutti",
    segmentiSelezionati: [] as string[],
    clientiSelezionati: [] as string[],
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

  const titoliTipo: Record<string, string> = {
    prodotti: "Sconto sui prodotti",
    "buy-x-get-y": "Buy X get Y",
    ordine: "Sconto sull'ordine",
    spedizione: "Spedizione gratuita",
  };

  const generaCodice = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codice = "";
    for (let i = 0; i < 8; i++) {
      codice += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, codice });
  };

  const handleSalva = () => {
    console.log("Salva sconto:", formData);
    router.push("/sconti");
  };

  // Riepilogo dinamico
  const getRiepilogo = () => {
    const items = [];

    if (formData.metodo === "codice" && formData.codice) {
      items.push({ icon: <Tag size={16} />, label: "Codice", value: formData.codice });
    } else if (formData.metodo === "automatico") {
      items.push({ icon: <Tag size={16} />, label: "Tipo", value: "Automatico" });
    }

    if (formData.valoreSconto) {
      const valore = formData.tipoValore === "percentuale"
        ? `${formData.valoreSconto}%`
        : `${formData.valoreSconto} EUR`;
      items.push({ icon: <Percent size={16} />, label: "Sconto", value: valore });
    }

    if (formData.applicaA === "tutti") {
      items.push({ icon: <Package size={16} />, label: "Si applica a", value: "Tutti i prodotti" });
    } else if (formData.applicaA === "collezioni") {
      items.push({ icon: <Package size={16} />, label: "Si applica a", value: "Collezioni specifiche" });
    } else {
      items.push({ icon: <Package size={16} />, label: "Si applica a", value: "Prodotti specifici" });
    }

    if (formData.requisitiMinimi === "importo" && formData.importoMinimo) {
      items.push({ icon: <ShoppingBag size={16} />, label: "Minimo", value: `${formData.importoMinimo} EUR` });
    } else if (formData.requisitiMinimi === "quantita" && formData.quantitaMinima) {
      items.push({ icon: <ShoppingBag size={16} />, label: "Minimo", value: `${formData.quantitaMinima} articoli` });
    }

    if (formData.clientiEligibili === "tutti") {
      items.push({ icon: <Users size={16} />, label: "Clienti", value: "Tutti" });
    } else {
      items.push({ icon: <Users size={16} />, label: "Clienti", value: "Specifici" });
    }

    if (formData.dataInizio) {
      items.push({ icon: <Calendar size={16} />, label: "Inizio", value: formData.dataInizio });
    }

    return items;
  };

  return (
    <div className="flex gap-6">
      {/* Colonna principale - Form */}
      <div className="flex-1 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/sconti" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{titoliTipo[tipo]}</h1>
            <p className="text-sm text-gray-500">Crea un nuovo sconto per i tuoi clienti</p>
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
                  <input type="text" value={formData.codice} onChange={(e) => setFormData({ ...formData, codice: e.target.value.toUpperCase() })} placeholder="es. ESTATE2024" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  <button onClick={generaCodice} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <RefreshCw size={16} />
                    Genera
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">I clienti inseriranno questo codice al checkout</p>
              </div>
            )}

            {formData.metodo === "automatico" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
                <input type="text" value={formData.titolo} onChange={(e) => setFormData({ ...formData, titolo: e.target.value })} placeholder="es. Sconto Estate" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                <p className="text-xs text-gray-500 mt-2">I clienti vedranno questo titolo al checkout</p>
              </div>
            )}
          </div>

          {/* Valore sconto */}
          {tipo !== "spedizione" && tipo !== "buy-x-get-y" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Valore dello sconto</h2>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipoValore" value="percentuale" checked={formData.tipoValore === "percentuale"} onChange={(e) => setFormData({ ...formData, tipoValore: e.target.value })} className="w-4 h-4 text-blue-600" />
                  <span>Percentuale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipoValore" value="fisso" checked={formData.tipoValore === "fisso"} onChange={(e) => setFormData({ ...formData, tipoValore: e.target.value })} className="w-4 h-4 text-blue-600" />
                  <span>Importo fisso</span>
                </label>
              </div>
              <div className="relative w-48">
                <input type="number" value={formData.valoreSconto} onChange={(e) => setFormData({ ...formData, valoreSconto: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{formData.tipoValore === "percentuale" ? "%" : "EUR"}</span>
              </div>
            </div>
          )}

          {/* Si applica a */}
          {tipo === "prodotti" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Si applica a</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="applicaA" value="tutti" checked={formData.applicaA === "tutti"} onChange={(e) => setFormData({ ...formData, applicaA: e.target.value })} className="w-4 h-4 text-blue-600" />
                  <span>Tutti i prodotti</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="applicaA" value="collezioni" checked={formData.applicaA === "collezioni"} onChange={(e) => setFormData({ ...formData, applicaA: e.target.value })} className="w-4 h-4 text-blue-600" />
                  <span>Collezioni specifiche</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="applicaA" value="prodotti" checked={formData.applicaA === "prodotti"} onChange={(e) => setFormData({ ...formData, applicaA: e.target.value })} className="w-4 h-4 text-blue-600" />
                  <span>Prodotti specifici</span>
                </label>
              </div>

              {(formData.applicaA === "collezioni" || formData.applicaA === "prodotti") && (
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder={formData.applicaA === "collezioni" ? "Cerca collezioni..." : "Cerca prodotti..."} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <button className="mt-2 text-sm text-blue-600 hover:underline">Sfoglia</button>
                </div>
              )}
            </div>
          )}

          {/* Requisiti minimi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Requisiti minimi di acquisto</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="requisiti" value="nessuno" checked={formData.requisitiMinimi === "nessuno"} onChange={(e) => setFormData({ ...formData, requisitiMinimi: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Nessun requisito minimo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="requisiti" value="importo" checked={formData.requisitiMinimi === "importo"} onChange={(e) => setFormData({ ...formData, requisitiMinimi: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Importo minimo di acquisto</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="requisiti" value="quantita" checked={formData.requisitiMinimi === "quantita"} onChange={(e) => setFormData({ ...formData, requisitiMinimi: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Quantita minima di articoli</span>
              </label>
            </div>
            {formData.requisitiMinimi === "importo" && (
              <div className="mt-4 relative w-48">
                <input type="number" value={formData.importoMinimo} onChange={(e) => setFormData({ ...formData, importoMinimo: e.target.value })} placeholder="0.00" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg pr-12" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">EUR</span>
              </div>
            )}
            {formData.requisitiMinimi === "quantita" && (
              <div className="mt-4 w-48">
                <input type="number" value={formData.quantitaMinima} onChange={(e) => setFormData({ ...formData, quantitaMinima: e.target.value })} placeholder="1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              </div>
            )}
          </div>

          {/* Idoneita clienti */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Idoneita dei clienti</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="clienti" value="tutti" checked={formData.clientiEligibili === "tutti"} onChange={(e) => setFormData({ ...formData, clientiEligibili: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Tutti i clienti</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="clienti" value="segmenti" checked={formData.clientiEligibili === "segmenti"} onChange={(e) => setFormData({ ...formData, clientiEligibili: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Segmenti di clienti specifici</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="clienti" value="clienti" checked={formData.clientiEligibili === "clienti"} onChange={(e) => setFormData({ ...formData, clientiEligibili: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Clienti specifici</span>
              </label>
            </div>

            {(formData.clientiEligibili === "segmenti" || formData.clientiEligibili === "clienti") && (
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder={formData.clientiEligibili === "segmenti" ? "Cerca segmenti..." : "Cerca clienti..."} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
                </div>
                <button className="mt-2 text-sm text-blue-600 hover:underline">Sfoglia</button>
              </div>
            )}
          </div>

          {/* Utilizzi massimi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Utilizzi massimi dello sconto</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox checked={formData.utilizziMax} onCheckedChange={(checked) => setFormData({ ...formData, utilizziMax: checked as boolean })} />
                <div className="flex-1">
                  <span className="text-sm">Limita il numero totale di utilizzi</span>
                  {formData.utilizziMax && (
                    <input type="number" value={formData.utilizziMaxNumero} onChange={(e) => setFormData({ ...formData, utilizziMaxNumero: e.target.value })} placeholder="Numero massimo" className="mt-2 w-48 px-4 py-2 border border-gray-300 rounded-lg text-sm" />
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

          {/* Date di validita */}
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

          {/* Bottoni azione */}
          <div className="flex justify-end gap-3 pb-6">
            <Link href="/sconti" className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</Link>
            <button onClick={handleSalva} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Salva sconto</button>
          </div>
        </div>
      </div>

      {/* Colonna laterale - Riepilogo */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
          <h3 className="font-semibold text-gray-900 mb-4">Riepilogo</h3>

          {getRiepilogo().length > 0 ? (
            <div className="space-y-3">
              {getRiepilogo().map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="text-gray-400 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nessun dettaglio ancora configurato</p>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Combinabile con</h4>
            <div className="flex flex-wrap gap-1">
              {formData.combinazioni.altriScontiProdotto && <Badge variant="outline" className="text-xs">Sconti prodotto</Badge>}
              {formData.combinazioni.scontiOrdine && <Badge variant="outline" className="text-xs">Sconti ordine</Badge>}
              {formData.combinazioni.scontiSpedizione && <Badge variant="outline" className="text-xs">Sconti spedizione</Badge>}
              {!formData.combinazioni.altriScontiProdotto && !formData.combinazioni.scontiOrdine && !formData.combinazioni.scontiSpedizione && (
                <span className="text-xs text-gray-400">Nessuno</span>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Suggerimento:</strong> Gli sconti automatici vengono applicati al checkout senza bisogno di inserire un codice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NuovoScontoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <NuovoScontoContent />
    </Suspense>
  );
}
