import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Compass, UserCheck, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginAsVisitor: () => void;
  onLoginAsUser: () => void;
}

export default function LoginScreen({ onLoginAsVisitor, onLoginAsUser }: LoginScreenProps) {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-orange-500 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Compass className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">BuurtPlay</h1>
          <p className="text-orange-100 font-medium">
            {language === 'en' ? 'The physical-first social network.' : 'Het fysiek-eerst sociale netwerk.'}
          </p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {language === 'en' ? 'Welcome to your neighborhood' : 'Welkom in je buurt'}
            </h2>
            <p className="text-sm text-slate-500">
              {language === 'en' 
                ? 'Join local sports and activities without the hassle of closed groups.' 
                : 'Doe mee aan lokale sporten en activiteiten zonder gedoe met besloten groepen.'}
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onLoginAsVisitor}
              className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-bold transition-all duration-200"
            >
              <UserCheck className="w-5 h-5" />
              <span>{language === 'en' ? 'Check-in as Visitor (No Account)' : 'Check-in als Bezoeker (Geen Account)'}</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">
                  {language === 'en' ? 'or continue with' : 'of ga verder met'}
                </span>
              </div>
            </div>

            <button 
              onClick={onLoginAsUser}
              className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 p-4 rounded-xl font-bold transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>{language === 'en' ? 'Google Login (Saved Profile)' : 'Google Login (Opgeslagen Profiel)'}</span>
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-1 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <p>{language === 'en' ? 'No personal data required for visitors.' : 'Geen persoonlijke gegevens vereist voor bezoekers.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
