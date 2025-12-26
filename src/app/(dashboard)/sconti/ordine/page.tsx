"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Search, ShoppingCart, Users, Calendar, Tag, Percent } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

function ScontoOrdineContent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    metodo: "codice",
    codice: "",
    titolo: "",
    tipoValore: "percentuale",
    valoreSconto: "",
    requisitiMinimi: "nessuno",
    importoMinimo: "",
    quantitaMinima: "",
    clientiEligibili: "tutti",
    utilizziMax: false,
    utilizziMaxNumero: "",
    usoPerCliente: false,
    combinazioni: {
      scontiProdotto: true,
      altriScontiOrdine: false,
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
    console.log("Salva sconto ordine:", formData);
    router.push("/sconti");
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/sconti" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sconto sull'ordine</h1>
            <p className="text-sm text-gray-500">Applica uno sconto sul totale dell'ordine</p>
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
                  <input type="text" value={formData.codice} onChange={(e) => setFormData({ ...formData, codice: e.target.value.toUpperCase() })} placeholder="es. ORDINE20" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none" />
                  <button onClick={generaCodice} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"><RefreshCw size={16} />Genera</button>
                </div>
              </div>
            )}
            {formData.metodo === "automatico" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
                <input type="text" value={formData.titolo} onChange={(e) => setFormData({ ...formData, titolo: e.target.value })} placeholder="es. Sconto 20% ordine" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" />
              </div>
            )}
          </div>

          {/* Valore sconto */}
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
              <input type="number" value={formData.valoreSconto} onChange={(e) => setFormData({ ...formData, valoreSconto: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg pr-12" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{formData.tipoValore === "percentuale" ? "%" : "EUR"}</span>
            </div>
          </div>

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
              <div className="mt-4 w-32">
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
                <span>Segmenti specifici</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="clienti" value="clienti" checked={formData.clientiEligibili === "clienti"} onChange={(e) => setFormData({ ...formData, clientiEligibili: e.target.value })} className="w-4 h-4 text-blue-600" />
                <span>Clienti specifici</span>
              </label>
            </div>
            {formData.clientiEligibili !== "tutti" && (
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Cerca..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            )}
          </div>

          {/* Utilizzi massimi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Utilizzi massimi</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox checked={formData.utilizziMax} onCheckedChange={(checked) => setFormData({ ...formData, utilizziMax: checked as boolean })} />
                <div className="flex-1">
                  <span className="text-sm">Limita numero totale di utilizzi</span>
                  {formData.utilizziMax && <input type="number" value={formData.utilizziMaxNumero} onChange={(e) => setFormData({ ...formData, utilizziMaxNumero: e.target.value })} className="mt-2 w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm" />}
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
                <Checkbox checked={formData.combinazioni.scontiProdotto} onCheckedChange={(checked) => setFormData({ ...formData, combinazioni: { ...formData.combinazioni, scontiProdotto: checked as boolean } })} />
                <span className="text-sm">Sconti sui prodotti</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={formData.combinazioni.altriScontiOrdine} onCheckedChange={(checked) => setFormData({ ...formData, combinazioni: { ...formData.combinazioni, altriScontiOrdine: checked as boolean } })} />
                <span className="text-sm">Altri sconti sull'ordine</span>
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

          <div className="flex justify-end gap-3 pb-6">
            <Link href="/sconti" className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Annulla</Link>
            <button onClick={handleSalva} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Salva sconto</button>
          </div>
        </div>
      </div>

      {/* Riepilogo */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
          <h3 className="font-semibold text-gray-900 mb-4">Riepilogo</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ShoppingCart size={16} className="text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Tipo</p>
                <p className="text-sm font-medium">Sconto ordine</p>
              </div>
            </div>
            {formData.metodo === "codice" && formData.codice && (
              <div className="flex items-start gap-3">
                <Tag size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Codice</p>
                  <p className="text-sm font-medium">{formData.codice}</p>
                </div>
              </div>
            )}
            {formData.valoreSconto && (
              <div className="flex items-start gap-3">
                <Percent size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Sconto</p>
                  <p className="text-sm font-medium">{formData.valoreSconto}{formData.tipoValore === "percentuale" ? "%" : " EUR"}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Users size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Clienti</p>
                <p className="text-sm font-medium">{formData.clientiEligibili === "tutti" ? "Tutti" : "Specifici"}</p>
              </div>
            </div>
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
              {formData.combinazioni.scontiProdotto && <Badge variant="outline" className="text-xs">Prodotto</Badge>}
              {formData.combinazioni.altriScontiOrdine && <Badge variant="outline" className="text-xs">Ordine</Badge>}
              {formData.combinazioni.scontiSpedizione && <Badge variant="outline" className="text-xs">Spedizione</Badge>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScontoOrdinePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <ScontoOrdineContent />
    </Suspense>
  );
}
