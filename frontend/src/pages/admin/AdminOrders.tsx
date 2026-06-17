import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    fetch('/api/admin/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur serveur');
        return data;
      })
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      })
      .catch(err => {
        console.error("Erreur Admin:", err);
        setError(err.message);
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-10 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white">Portail Usine <span className="text-orange-500">SYNERIA</span></h1>
            <p className="text-zinc-500 text-sm mt-1 font-bold">Vue d'ensemble des productions</p>
          </div>
          <Link to="/profile" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">
            ← Retour au Profil
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 font-bold text-sm">
            ❌ Erreur : {error}
          </div>
        )}

        <div className="overflow-x-auto shadow-2xl rounded-xl border border-zinc-800 bg-[#111]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d0d0d] border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">
                <th className="p-4 font-black">N°</th>
                <th className="p-4 font-black">Client</th>
                <th className="p-4 font-black">Fichier STL</th>
                <th className="p-4 font-black">Spécifications</th>
                <th className="p-4 font-black">Prix</th>
                <th className="p-4 font-black">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && !error ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">Aucune commande dans le système.</td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 text-sm font-mono text-zinc-400">#{order.orderNumber}</td>
                    <td className="p-4 text-sm">
                      <div className="font-bold text-white">{order.user?.firstName || 'Client'} {order.user?.lastName || ''}</div>
                      <div className="text-xs text-zinc-500">{order.user?.email}</div>
                    </td>
                    <td className="p-4 text-xs font-mono text-zinc-300 truncate max-w-[200px]">{order.fileName}</td>
                    <td className="p-4 text-xs text-zinc-400">
                      {order.material} <br/> <span className="text-zinc-600">({order.finish})</span>
                    </td>
                    <td className="p-4 font-black text-orange-500">{order.totalPrice} $</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/30 text-[10px] font-black rounded uppercase tracking-wider">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
