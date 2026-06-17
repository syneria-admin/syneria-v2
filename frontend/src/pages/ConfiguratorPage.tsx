import { Suspense, useState, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Link, useNavigate } from 'react-router-dom';
import { useConfigStore } from '../store/useConfigStore';
import { usePriceCalculator } from '../hooks/usePriceCalculator';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuthStore } from '../store/useAuthStore';

const STLViewer = ({ url }: { url: string }) => {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#F26522" roughness={0.4} metalness={0.1} />
    </mesh>
  );
};

export const ConfiguratorPage = () => {
  const { file, setFile, options, updateOptions } = useConfigStore();
  const { totalPrice } = usePriceCalculator();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      useConfigStore.getState().setSpecs({ volume: 25000, name: e.target.files[0].name });
    }
  };

  const executeOrder = async () => {
    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`
        },
        body: JSON.stringify({
          orderDetails: {
            fileName: file?.name || 'model.stl',
            material: options.materialId,
            process: options.process,
            finish: options.finishId,
            price: totalPrice
          }
        })
      });
      if (response.ok) {
        alert('Commande transmise avec succès !');
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderClick = () => {
    if (!file) return;
    if (!token) {
      setAuthModalOpen(true);
    } else {
      executeOrder();
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    executeOrder();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-[#0a0a0a] text-white font-sans">
      
      {/* Visualiseur 3D */}
      <div className="flex-1 min-w-0 min-h-0 relative flex flex-col h-[50vh] lg:h-screen">
        
        <div className="p-4 lg:p-6 border-b border-zinc-800 flex justify-between items-center bg-[#0d0d0d] z-20 shrink-0 box-border">
          <Link to="/" className="font-black text-xl lg:text-2xl tracking-tighter hover:opacity-80 transition-opacity no-underline text-white flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>SYN<span className="text-orange-500">ERIA</span></span>
          </Link>
          <div className="text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 hidden sm:block">Production Platform</div>
        </div>

        <div className="flex-1 relative w-full h-full">
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }} className="!outline-none">
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.5}>
                {file && <STLViewer url={URL.createObjectURL(file)} />}
              </Stage>
            </Suspense>
            <OrbitControls makeDefault />
          </Canvas>

          {!file && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm p-4">
              <div 
                className="w-full max-w-md border-2 border-dashed border-orange-500/50 hover:border-orange-500 bg-[#111] hover:bg-[#1a1a1a] transition-all rounded-2xl p-8 lg:p-12 text-center cursor-pointer transform hover:-translate-y-1 shadow-2xl box-border"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" accept=".stl" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <svg className="w-12 h-12 lg:w-16 lg:h-16 text-orange-500 mx-auto mb-4 lg:mb-6 opacity-90 block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-xl lg:text-2xl font-black text-white mb-2 lg:mb-3 leading-none">Déposez votre fichier STL</div>
                <div className="text-xs lg:text-sm text-zinc-400 font-medium">ou cliquez pour parcourir vos dossiers</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panneau de Configuration */}
      <div className="w-full lg:w-[400px] max-w-full bg-[#111] border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col z-20 shadow-2xl shrink-0 h-[50vh] lg:h-screen">
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 box-border">
            
            {/* Options : Procédé */}
            <div>
                <div className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-3 leading-none">Procédé</div>
                <div className="flex bg-[#0a0a0a] p-1.5 rounded-lg border border-zinc-800 w-full box-border h-[48px]">
                    {['fdm', 'sla', 'sls'].map(proc => (
                        <button 
                            key={proc}
                            onClick={() => updateOptions({ process: proc as any })}
                            className={`flex-1 flex items-center justify-center text-xs font-black uppercase rounded-md transition-all duration-200 m-0 border-none outline-none leading-none cursor-pointer ${options.process === proc ? 'bg-orange-500 text-white shadow-md' : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
                        >
                            {proc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Options : Matériaux */}
            <div>
                <div className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-3 leading-none">Matériau</div>
                <div className="grid grid-cols-2 gap-3 w-full box-border">
                    <button 
                      onClick={() => updateOptions({ materialId: 'pla' })} 
                      className={`w-full flex flex-col items-start justify-center h-[72px] px-4 rounded-xl border-2 transition-all duration-200 outline-none m-0 cursor-pointer text-left box-border ${options.materialId === 'pla' ? 'bg-orange-500/10 border-orange-500' : 'bg-[#0a0a0a] border-zinc-800 hover:border-zinc-600'}`}
                    >
                        <span className={`text-sm font-black mb-1.5 leading-none ${options.materialId === 'pla' ? 'text-orange-500' : 'text-zinc-200'}`}>PLA Basic</span>
                        <span className="text-[11px] text-zinc-500 font-medium leading-none">Standard / Visuel</span>
                    </button>
                    <button 
                      onClick={() => updateOptions({ materialId: 'abs' })} 
                      className={`w-full flex flex-col items-start justify-center h-[72px] px-4 rounded-xl border-2 transition-all duration-200 outline-none m-0 cursor-pointer text-left box-border ${options.materialId === 'abs' ? 'bg-orange-500/10 border-orange-500' : 'bg-[#0a0a0a] border-zinc-800 hover:border-zinc-600'}`}
                    >
                        <span className={`text-sm font-black mb-1.5 leading-none ${options.materialId === 'abs' ? 'text-orange-500' : 'text-zinc-200'}`}>ABS Tough</span>
                        <span className="text-[11px] text-zinc-500 font-medium leading-none">Ingénierie</span>
                    </button>
                </div>
            </div>

            {/* Options : Finition */}
            <div>
                <div className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-3 leading-none">Finition & Couche</div>
                <div className="grid grid-cols-2 gap-3 w-full box-border">
                    <button 
                      onClick={() => updateOptions({ finishId: 'std' })} 
                      className={`w-full flex flex-col items-start justify-center h-[72px] px-4 rounded-xl border-2 transition-all duration-200 outline-none m-0 cursor-pointer text-left box-border ${options.finishId === 'std' ? 'bg-orange-500/10 border-orange-500' : 'bg-[#0a0a0a] border-zinc-800 hover:border-zinc-600'}`}
                    >
                        <span className={`text-sm font-black mb-1.5 leading-none ${options.finishId === 'std' ? 'text-orange-500' : 'text-zinc-200'}`}>Standard</span>
                        <span className="text-[11px] text-zinc-500 font-medium leading-none">0.2mm</span>
                    </button>
                    <button 
                      onClick={() => updateOptions({ finishId: 'fine' })} 
                      className={`w-full flex flex-col items-start justify-center h-[72px] px-4 rounded-xl border-2 transition-all duration-200 outline-none m-0 cursor-pointer text-left box-border ${options.finishId === 'fine' ? 'bg-orange-500/10 border-orange-500' : 'bg-[#0a0a0a] border-zinc-800 hover:border-zinc-600'}`}
                    >
                        <span className={`text-sm font-black mb-1.5 leading-none ${options.finishId === 'fine' ? 'text-orange-500' : 'text-zinc-200'}`}>Fine</span>
                        <span className="text-[11px] text-zinc-500 font-medium leading-none">0.1mm</span>
                    </button>
                </div>
            </div>

        </div>

        {/* Pied de page Fixe */}
        <div className="p-6 bg-[#0a0a0a] border-t border-zinc-800 shrink-0 box-border w-full">
            <div className="flex justify-between items-end mb-5">
                <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.15em] leading-none">Total estimé</span>
                <span className="text-3xl font-black text-orange-500 tracking-tighter leading-none">{totalPrice > 0 ? `${totalPrice} $` : '—'}</span>
            </div>
            <button 
                onClick={handleOrderClick}
                disabled={!file}
                className={`w-full h-[56px] flex items-center justify-center rounded-lg font-black text-sm uppercase tracking-widest transition-all duration-300 border-none m-0 outline-none cursor-pointer box-border ${file ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(242,101,34,0.3)]' : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed'}`}
            >
                {file ? 'Commander la pièce' : 'Téléversez un fichier'}
            </button>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
};
