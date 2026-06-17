import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, Navigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { token, user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) {
      fetch('/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
    }
  }, [token]);

  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-6">
          <div>
            <Link to="/" className="text-orange-500 text-sm font-bold hover:underline block mb-4">← Retour à l'accueil</Link>
            <h1 className="text-4xl font-black tracking-tight">Mon Espace</h1>
          </div>
          <button onClick={logout} className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">Déconnexion</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Informations Utilisateur */}
          <div className="bg-[#111] p-6 rounded-2xl border border-zinc-800 h-fit">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Mon Profil</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500">Email</p>
                <p className="font-bold">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Statut Compte</p>
                <p className="font-bold text-orange-500">{user?.role === 'ADMIN' ? 'Administrateur' : 'Client Professionnel'}</p>
              </div>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="mt-4 block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded font-bold transition-colors">
                  Ouvrir le portail d'Usine (Admin)
                </Link>
              )}
            </div>
          </div>

          {/* Historique des commandes */}
          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Historique de Production</h2>
            
            {orders.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-[#0d0d0d]">
                <p className="text-zinc-500 mb-4">Aucune commande passée.</p>
                <Link to="/order" className="text-orange-500 font-bold hover:underline">Imprimer une pièce →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="bg-[#111] p-6 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-zinc-400 text-xs">#{order.orderNumber}</span>
                        <span className="bg-orange-500/10 text-orange-500 border border-orange-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                          {order.status}
                        </span>
                      </div>
                      <p className="font-bold truncate max-w-[200px] sm:max-w-[300px]">{order.fileName}</p>
                      <p className="text-xs text-zinc-500 mt-1">{order.process} · {order.material} · {order.finish}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-black text-orange-500">{order.totalPrice} $</p>
                      <p className="text-[10px] text-zinc-600 mt-1">{new Date(order.createdAt).toLocaleDateString('fr-CA')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
