import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }: any) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', address: '', city: '', zipCode: '' });
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = mode === 'REGISTER' ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        login(data.token, data.user); // Sauvegarde la session
        onAuthSuccess(); // Lance l'action parent (Ex: Envoi de la commande)
      } else {
        alert(data.error || 'Erreur lors de la connexion');
      }
    } catch (error) {
      alert('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-white text-xl">✕</button>
        
        <h2 className="text-2xl font-black text-white mb-1">
          {mode === 'REGISTER' ? 'Créer un compte' : 'Bon retour !'}
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          {mode === 'REGISTER' ? 'Vos informations de facturation et de livraison.' : 'Connectez-vous à votre espace usine.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'REGISTER' && (
            <>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Prénom</label>
                  <input name="firstName" required onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded p-2.5 text-white focus:border-orange-500 outline-none text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Nom</label>
                  <input name="lastName" required onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded p-2.5 text-white focus:border-orange-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Adresse de livraison</label>
                <input name="address" required onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded p-2.5 text-white focus:border-orange-500 outline-none text-sm" />
              </div>
              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Ville</label>
                  <input name="city" required onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded p-2.5 text-white focus:border-orange-500 outline-none text-sm" />
                </div>
                <div className="flex-[1]">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Code Postal</label>
                  <input name="zipCode" required onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded p-2.5 text-white focus:border-orange-500 outline-none text-sm" />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Email Pro</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded p-2.5 text-white focus:border-orange-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Mot de passe</label>
            <input name="password" type="password" required onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded p-2.5 text-white focus:border-orange-500 outline-none text-sm" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest p-3 rounded mt-4 transition-colors">
            {loading ? 'Connexion...' : (mode === 'REGISTER' ? 'Créer mon compte' : 'Se connecter')}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500">
          {mode === 'REGISTER' ? 'Déjà un compte ?' : "Pas encore inscrit ?"}
          <button onClick={() => setMode(mode === 'REGISTER' ? 'LOGIN' : 'REGISTER')} className="text-orange-500 font-bold ml-2 hover:underline">
            {mode === 'REGISTER' ? 'Se connecter' : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
};
