"use client";

import { X, Percent, Gift, ShoppingCart, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

const tipiSconto = [
  {
    id: "prodotti",
    titolo: "Sconto sui prodotti",
    descrizione: "Sconto su prodotti o collezioni specifiche",
    icona: Percent,
    colore: "bg-blue-100 text-blue-600",
  },
  {
    id: "buy-x-get-y",
    titolo: "Buy X get Y",
    descrizione: "Sconto su prodotti basato su acquisti",
    icona: Gift,
    colore: "bg-purple-100 text-purple-600",
  },
  {
    id: "ordine",
    titolo: "Sconto sull'ordine",
    descrizione: "Sconto sull'intero ordine",
    icona: ShoppingCart,
    colore: "bg-green-100 text-green-600",
  },
  {
    id: "spedizione",
    titolo: "Spedizione gratuita",
    descrizione: "Spedizione gratuita sull'ordine",
    icona: Truck,
    colore: "bg-orange-100 text-orange-600",
  },
];

interface Props {
  aperto: boolean;
  onChiudi: () => void;
}

export function ModalCreaSconto({ aperto, onChiudi }: Props) {
  const router = useRouter();

  if (!aperto) return null;

  const handleSeleziona = (tipoId: string) => {
    onChiudi();
    const routes: Record<string, string> = {
      prodotti: "/sconti/nuovo",
      "buy-x-get-y": "/sconti/buy-x-get-y",
      ordine: "/sconti/ordine",
      spedizione: "/sconti/spedizione",
    };
    router.push(routes[tipoId] || "/sconti/nuovo");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Seleziona tipo di sconto</h2>
          <button
            onClick={onChiudi}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista tipi */}
        <div className="p-6">
          <div className="space-y-3">
            {tipiSconto.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => handleSeleziona(tipo.id)}
                className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tipo.colore}`}>
                  <tipo.icona size={24} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{tipo.titolo}</div>
                  <div className="text-sm text-gray-500">{tipo.descrizione}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
