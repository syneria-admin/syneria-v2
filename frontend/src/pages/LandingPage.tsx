import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from '../components/auth/AuthModal';
import '../landing.css'; 

export const LandingPage = () => {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  
  // On récupère les infos de l'utilisateur connecté
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  const t = (enText: string, frText: string) => lang === 'fr' ? frText : enText;

  // Si l'utilisateur se connecte depuis l'accueil, on l'envoie sur son profil
  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    navigate('/profile');
  };

  return (
    <div className="landing-wrapper">
      <div className="ann">
        <span>{t("Québec launch 2028 — We're looking for early adopters.", "Lancement Québec 2028 — Nous recherchons des early adopters.")}</span> 
        <a href="https://docs.google.com/forms/..." target="_blank" rel="noreferrer">
          {t("Share your feedback", "Donnez votre avis")}
        </a>
      </div>

      <nav>
        <a href="#" className="logo">
          <span className="logo-brand">SYNERIA</span>
          <span className="logo-sub">Additive Solutions</span>
        </a>
        <ul className="navlinks">
          <li><a href="#platform">{t("Order", "Commander")}</a></li>
          <li><a href="#usecases">{t("Use Cases", "Cas d'usage")}</a></li>
          <li><a href="#materials">{t("Materials", "Matériaux")}</a></li>
          <li><a href="#industries">{t("Industries", "Secteurs")}</a></li>
        </ul>
        <div className="nav-right">
          <div className="lang-tog">
            <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')}>FR</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          
          {/* === GESTION DE L'AFFICHAGE DU PROFIL === */}
          {token ? (
            <Link to="/profile" className="navcta" style={{ background: '#222', color: '#fff', border: '1px solid #444' }}>
              {t("My Profile", "Mon Profil")} ({user?.firstName || 'Client'})
            </Link>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)} 
              className="navcta" 
              style={{ background: 'transparent', color: '#111', border: '1px solid #ccc', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {t("Login", "Connexion")}
            </button>
          )}

          <Link to="/order" className="navcta">{t("Launch App", "Lancer l'App")}</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-l">
          <div className="eyeline">{t("Industrial 3D Printing · Québec", "Impression 3D industrielle · Québec")}</div>
          <h1>
            {t("YOUR FILE.", "VOTRE FICHIER.")}<br/>
            <span className="o">{t("OUR", "NOTRE")}</span><br/>
            {t("FACTORY.", "USINE.")}
          </h1>
          <p className="hero-sub">
            {t("SLS · Resin SLA · Technical FDM — instant online quoting, delivery across Québec in 2–5 business days.", "SLS · Résine SLA · FDM technique — devis en ligne instantané, livraison partout au Québec en 2 à 5 jours ouvrés.")}
          </p>
          <div className="btnrow">
            <Link to="/order" className="btn-o">
              <span>{t("Open 3D Configurator", "Ouvrir le Configurateur 3D")}</span> 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </Link>
            <a href="#usecases" className="btn-g">{t("Explore Use Cases", "Voir les cas d'usage")}</a>
          </div>
        </div>
      </div>

      <section className="sec dk" id="platform">
        <div className="mw text-center" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="ey">{t("Platform", "Plateforme")}</div>
          <h2 className="sh w">{t("Upload. Configure. Order.", "Téléversez. Configurez. Commandez.")}</h2>
          <p className="sl w mx-auto" style={{ margin: '0 auto', marginBottom: '40px' }}>
            {t("Drop your STL file in our dedicated web application. Rotate and inspect your model, choose your process, material, finish, and color — get an instant price estimate.", "Déposez votre fichier STL dans notre application dédiée. Pivotez et inspectez votre modèle, choisissez procédé, matériau, finition et couleur — obtenez une estimation de prix instantanée.")}
          </p>
          
          <div style={{ background: '#111', padding: '60px 40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
             <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '20px' }}>
                {t("Ready to analyze your CAD file?", "Prêt à analyser votre fichier CAO ?")}
             </h3>
             <Link to="/order" className="btn-o" style={{ fontSize: '18px', padding: '18px 40px' }}>
                {t("Launch the Manufacturing Platform", "Lancer la Plateforme de Production")}
             </Link>
          </div>
        </div>
      </section>

      <footer>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="ft-bot">
            <span>© 2026 SYNERIA Additive Solutions — Québec · syneria.additive@gmail.com</span>
          </div>
        </div>
      </footer>

      {/* Intégration de la Modale */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
};