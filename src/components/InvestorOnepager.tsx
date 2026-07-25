import React, { useState } from 'react';
import { 
  Smartphone, 
  TrendingUp, 
  Coins, 
  ShieldAlert, 
  Sparkles, 
  Send,
  CheckCircle2,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function InvestorOnepager() {
  const { language, t } = useLanguage();

  // Calculator States
  const [fundingAmount, setFundingAmount] = useState<number>(150000);
  const [targetCities, setTargetCities] = useState<number>(5);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [investorName, setInvestorName] = useState<string>('');
  const [investorEmail, setInvestorEmail] = useState<string>('');
  const [investorCompany, setInvestorCompany] = useState<string>('');

  // Dynamic calculations for Investor simulation
  const computedImpactHours = Math.round((fundingAmount / 50) * targetCities);
  const computedIsolationReduction = (0.8 * (fundingAmount / 50000) * (targetCities / 2)).toFixed(1);
  const computedActivePlayers = Math.round((fundingAmount / 20) * (targetCities / 3));
  const computedLockerNodes = Math.round((fundingAmount / 1500) * 1.2);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (investorName.trim() && investorEmail.trim()) {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 text-left" id="investor-onepager-container">
      {/* Premium Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {t('pitchBadge')}
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl leading-tight tracking-tight">
            {language === 'en' ? 'Targeting the Crisis:' : 'Aanpak van de Epidemie:'}{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              {language === 'en' ? 'Loneliness & Screen Addiction' : 'Eenzaamheid & Schermverslaving'}
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            {t('pitchHeroDesc')}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Seed Target</p>
              <p className="text-lg font-bold font-mono text-orange-400">€450,000</p>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{language === 'en' ? 'Current Commitments' : 'Huidige Toezeggingen'}</p>
              <p className="text-lg font-bold font-mono text-emerald-400">€180,000</p>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{language === 'en' ? 'Focus Region' : 'Focus Regio'}</p>
              <p className="text-lg font-bold text-slate-200">The Netherlands & EU</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Double Crisis section (Targeting the Epidemics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Crisis 1: Screen Addiction */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              {t('pitchCrisis1')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en' ? (
                <>Gen Z spends an average of <strong className="text-rose-600">7.2 hours per day</strong> glued to algorithms engineered to keep them sedentary, passive, and separated.</>
              ) : (
                <>Jongeren besteden gemiddeld <strong className="text-rose-600">7,2 uur per dag</strong> aan algoritmen die zijn ontworpen om hen passief, zittend en gescheiden te houden.</>
              )}
            </p>
            <div className="space-y-3.5 pt-2">
              <div className="bg-rose-50/50 border border-rose-100/60 p-3.5 rounded-2xl flex items-start space-x-3">
                <span className="text-base">🧠</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t('pitchDopamine')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('pitchDopamineDesc')}</p>
                </div>
              </div>
              <div className="bg-rose-50/50 border border-rose-100/60 p-3.5 rounded-2xl flex items-start space-x-3">
                <span className="text-base">📉</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t('pitchThirdPlace')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('pitchThirdPlaceDesc')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Source: Dutch Trimbos Institute (2025)</span>
            <span className="text-rose-500 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {language === 'en' ? 'High Urgency' : 'Hoge Urgentie'}
            </span>
          </div>
        </div>

        {/* Crisis 2: Loneliness */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              {t('pitchCrisis2')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en' ? (
                <>In the Netherlands, over <strong className="text-amber-600">45% of young adults</strong> report feeling lonely or socially disconnected from their neighborhood nodes.</>
              ) : (
                <>In Nederland geeft meer dan <strong className="text-amber-600">45% van de jongvolwassenen</strong> aan zich eenzaam of sociaal losgekoppeld te voelen van hun buurt.</>
              )}
            </p>
            <div className="space-y-3.5 pt-2">
              <div className="bg-amber-50/50 border border-amber-100/60 p-3.5 rounded-2xl flex items-start space-x-3">
                <span className="text-base">🔒</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t('pitchClique')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('pitchCliqueDesc')}</p>
                </div>
              </div>
              <div className="bg-amber-50/50 border border-amber-100/60 p-3.5 rounded-2xl flex items-start space-x-3">
                <span className="text-base">💔</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t('pitchFamine')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('pitchFamineDesc')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Source: CBS Dutch National Statistics (2025)</span>
            <span className="text-amber-500 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {language === 'en' ? 'High Urgency' : 'Hoge Urgentie'}
            </span>
          </div>
        </div>
      </div>

      {/* Why Existing Solutions Fail VS BuurtPlay */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl text-white">
            {language === 'en' ? 'Why Gated Chats & Standard Apps Fail' : 'Waarom WhatsApp & Sportapps Falen'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'en' ? 'Comparing legacy platforms to our low-barrier connection loop' : 'Vergelijking van traditionele platforms met ons laagdrempelige model'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-xs text-slate-300 uppercase">
              {language === 'en' ? 'Legacy Platforms (e.g. WhatsApp)' : 'Bestaande Groepen (o.a. WhatsApp)'}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-rose-500 font-bold">❌</span>
                <span>{language === 'en' ? 'Highly exclusive, gated invite links, chaotic notifications' : 'Zeer exclusief, verborgen uitnodigingslinks, chaotische meldingen'}</span>
              </li>
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-rose-500 font-bold">❌</span>
                <span>{language === 'en' ? 'No physical storage integration (gear is expensive to buy)' : 'Geen integratie met fysieke deelkasten (sportspullen zijn duur)'}</span>
              </li>
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-rose-500 font-bold">❌</span>
                <span>{language === 'en' ? 'Zero support or guidance for socially anxious newcomers' : 'Geen enkele ondersteuning of begeleiding voor introverte nieuwkomers'}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-xs text-slate-300 uppercase">
              {language === 'en' ? 'Standard Sport Apps' : 'Traditionele Sport Apps'}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-rose-500 font-bold">❌</span>
                <span>{language === 'en' ? 'Hyper-competitive focus, skill barriers, intimidating' : 'Sterke focus op competitie en prestatie, intimiderend niveau'}</span>
              </li>
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-rose-500 font-bold">❌</span>
                <span>{language === 'en' ? 'Ignore non-athletic neighbors who just want interaction' : 'Negeren buren die gewoon voor de gezelligheid en contact komen'}</span>
              </li>
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-rose-500 font-bold">❌</span>
                <span>{language === 'en' ? 'Require immediate commitment without safe, warm introductions' : 'Eisen directe actieve deelname zonder veilige, warme ontvangst'}</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-600/25 border border-orange-500/50 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-xs text-orange-300 uppercase">The BuurtPlay Loop</h4>
            <ul className="space-y-2 text-[11px] text-slate-200">
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-emerald-400 font-bold">✅</span>
                <span><strong>Multi-Role RSVP</strong>: {language === 'en' ? 'Join as Spectator or Welcomer—no pressure' : 'Sluit aan als toeschouwer of verwelkomer—zonder prestatiedruk'}</span>
              </li>
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-emerald-400 font-bold">✅</span>
                <span><strong>IoT Smart Lockers</strong>: {language === 'en' ? 'Free physical hobby gear at the point of play' : 'Gratis sport- en hobby-uitrusting direct bij het plein'}</span>
              </li>
              <li className="flex items-start gap-1.5 text-left">
                <span className="text-emerald-400 font-bold">✅</span>
                <span><strong>Aura Catalysts</strong>: {language === 'en' ? 'Trained local leaders to guide cozy integrations' : 'Opgeleide buurtcoaches die zorgen voor een warm welkom'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Core Flywheel Diagram */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900">{t('pitchFlywheelTitle')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('pitchFlywheelDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 relative text-left sm:text-center">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center mx-auto text-xs">1</div>
            <p className="text-xs font-bold text-slate-800">{language === 'en' ? 'Map & Lock' : 'Plein & Deelkast'}</p>
            <p className="text-[10px] text-slate-500">
              {language === 'en' ? 'Local courts get active on the platform. The IoT Smart Locker is installed with free sports/hobby gear.' : 'Pleinen worden actief. De IoT Smart Deelkast wordt geïnstalleerd met gratis sport- en hobby-uitrusting.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 relative text-left sm:text-center">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center mx-auto text-xs">2</div>
            <p className="text-xs font-bold text-slate-800">{language === 'en' ? 'Multi-Role RSVPs' : 'Inclusieve Rollen'}</p>
            <p className="text-[10px] text-slate-500">
              {language === 'en' ? 'Shy or non-athletic neighbors sign up safely as "Spectators" or "Cozy Welcomers" to sit and chat.' : 'Buurtbewoners kunnen zich veilig aanmelden als toeschouwer of verwelkomer om te praten en te supporteren.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 relative text-left sm:text-center">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center mx-auto text-xs">3</div>
            <p className="text-xs font-bold text-slate-800">{language === 'en' ? 'Catalyst Welcomes' : 'Catalyst Ontvangst'}</p>
            <p className="text-[10px] text-slate-500">
              {language === 'en' ? 'Certified local Aura Catalysts lead each session, actively greeting outliers, opening lockers, and seeding snacks.' : 'Gecertificeerde coaches leiden de sessie, heten nieuwkomers welkom en regelen gratis snacks en drinken.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 relative text-left sm:text-center">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center mx-auto text-xs">4</div>
            <p className="text-xs font-bold text-slate-800">{language === 'en' ? 'Local Belonging' : 'Echte Verbinding'}</p>
            <p className="text-[10px] text-slate-500">
              {language === 'en' ? 'Contact hours compound. Players and spectators form offline friendships, permanently lowering local isolation.' : 'Contacturen lopen op. Deelnemers en toeschouwers bouwen hechte vriendschappen op die eenzaamheid tegengaan.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Impact & Funding Simulator */}
      <div className="bg-gradient-to-br from-slate-900 to-orange-950 rounded-3xl p-8 text-white space-y-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-white">{t('pitchCalculatorTitle')}</h3>
          <p className="text-xs text-orange-300">{t('pitchCalculatorDesc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-1 space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex justify-between">
                <span>{language === 'en' ? 'Investment Contribution' : 'Investering / Bijdrage'}</span>
                <span className="font-mono text-orange-400 font-bold">€{fundingAmount.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="50000" 
                max="500000" 
                step="25000"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-1 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>€50k (Base)</span>
                <span>€500k (Target)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex justify-between">
                <span>{language === 'en' ? 'Target Cities Deployment' : 'Aantal steden'}</span>
                <span className="font-mono text-orange-400 font-bold">{targetCities} {language === 'en' ? 'cities' : 'steden'}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="1"
                value={targetCities}
                onChange={(e) => setTargetCities(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-1 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>1 {language === 'en' ? 'City' : 'Stad'}</span>
                <span>15 {language === 'en' ? 'Cities' : 'Steden'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <h5 className="font-bold text-xs text-slate-200">{language === 'en' ? 'Allocation Model:' : 'Verdelingsmodel:'}</h5>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div className="bg-slate-950/40 p-2 rounded-lg">
                  <p className="font-bold text-slate-300">45% Hardware</p>
                  <p>{language === 'en' ? 'Smart IoT Locker deployment' : 'Installatie van IoT Deelkasten'}</p>
                </div>
                <div className="bg-slate-950/40 p-2 rounded-lg">
                  <p className="font-bold text-slate-300">35% Operations</p>
                  <p>{language === 'en' ? 'Catalyst network training' : 'Training en werving coaches'}</p>
                </div>
                <div className="bg-slate-950/40 p-2 rounded-lg col-span-2">
                  <p className="font-bold text-slate-300">20% Software & Expansion</p>
                  <p>{language === 'en' ? 'Local viral marketing and geo-mapping scaling' : 'Lokale marketing en doorontwikkeling app'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quantified Impact Outputs */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-xl">🤝</span>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{language === 'en' ? 'Social Contact Hours' : 'Sociale Contacturen'}</p>
                <h4 className="text-3xl font-mono font-black text-orange-400">+{computedImpactHours.toLocaleString()}h</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                {language === 'en' ? 'Estimated pure physical connection and contact hours generated between isolated neighbors annually.' : 'Geschat aantal pure fysieke contacturen gegenereerd tussen buurtbewoners op jaarbasis.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-xl">📉</span>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{language === 'en' ? 'Estimated Loneliness Reductor' : 'Geschatte Eenzaamheidsreductie'}</p>
                <h4 className="text-3xl font-mono font-black text-rose-400">-{computedIsolationReduction}%</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                {language === 'en' ? 'Targeted reduction in localized youth social isolation indices across target municipal centers.' : 'Gerichte reductie van de eenzaamheidsindex onder jongeren in de geselecteerde gemeenten.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-xl">🏃‍♂️</span>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
                  {language === 'en' ? 'Monthly Active Players & Spectators' : 'Maandelijkse Deelnemers & Supporters'}
                </p>
                <h4 className="text-3xl font-mono font-black text-emerald-400">+{computedActivePlayers.toLocaleString()} {language === 'en' ? 'users' : 'gebruikers'}</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                {language === 'en' ? 'Engaged community members showing up physically to either play, coach, chat, or spectate.' : 'Betrokken buurtbewoners die fysiek samenkomen om te spelen, te praten of aan te moedigen.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-xl">📦</span>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{language === 'en' ? 'Active Smart Locker Nodes' : 'Actieve Smart Deelkasten'}</p>
                <h4 className="text-3xl font-mono font-black text-amber-400">{computedLockerNodes} {language === 'en' ? 'lockers' : 'kasten'}</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                {language === 'en' ? 'Fully loaded physical locker installations offering free community-shared activity gear.' : 'Volledig uitgeruste fysieke kasten met gratis te lenen sportspullen.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Traction, Business Flywheel & Unit Economics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Coins className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            {language === 'en' ? 'Revenue Stream Flywheel' : 'Inkomstenbronnen Vliegwiel'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {language === 'en' ? 'We operate a low-overhead, multi-tenant business model:' : 'We hanteren een model met lage overheadkosten:'}
          </p>
          <ul className="space-y-1.5 text-[10px] text-slate-500">
            <li>• <strong>{language === 'en' ? 'Municipal Subsidies (Gemeente)' : 'Gemeentelijke Subsidies'}</strong>: {language === 'en' ? 'Direct funding for combating isolation.' : 'Directe financiering voor eenzaamheidsbestrijding.'}</li>
            <li>• <strong>{language === 'en' ? 'IoT Smart Locker licensing' : 'IoT Deelkast Licenties'}</strong>: {language === 'en' ? 'Hardware rentals and corporate neighborhood sponsorships.' : 'Verhuur van hardware en zakelijke buurt-sponsoring.'}</li>
            <li>• <strong>{language === 'en' ? 'Local Brand Partner Integrations' : 'Lokale Merkpartnerships'}</strong>: {language === 'en' ? 'Targeted physical activations on the courts.' : 'Gerichte fysieke activaties bij de pleinen.'}</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            {language === 'en' ? 'Target Audience: Outliers' : 'Doelgroep: De Outliers'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {language === 'en' ? 'By shifting marketing focus away from hyper-athletic performers to everyday neighbors:' : 'Door de focus te verleggen van topsporters naar de gewone buren:'}
          </p>
          <ul className="space-y-1.5 text-[10px] text-slate-500">
            <li>• <strong>{language === 'en' ? '60% of early cohorts' : '60% van de vroege groepen'}</strong> {language === 'en' ? 'report high comfort joining as spectators.' : 'geeft aan makkelijk aan te sluiten als toeschouwer.'}</li>
            <li>• <strong>{language === 'en' ? '90% of connections' : '90% van de relaties'}</strong> {language === 'en' ? 'are built with zero physical skills required.' : 'ontstaat zonder dat er sportieve vaardigheden voor nodig zijn.'}</li>
            <li>• {language === 'en' ? 'Reclaims youth screen-time with real-life community games.' : 'Vervangt schermtijd door echte, laagdrempelige ontmoetingen.'}</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            {language === 'en' ? 'Scale & Growth Engine' : 'Groei- & Schaalbaarheid'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {language === 'en' ? 'Our network scales organically without heavy traditional customer acquisition cost:' : 'Ons netwerk groeit organisch zonder hoge marketingkosten:'}
          </p>
          <ul className="space-y-1.5 text-[10px] text-slate-500">
            <li>• {language === 'en' ? 'Smart Lockers act as physical billboards right in the parks.' : 'De Smart Lockers werken als fysieke billboards in de parken.'}</li>
            <li>• {language === 'en' ? 'QR-based local court claims drive organic peer invites.' : 'Claims via QR-codes op lokale pleinen zorgen voor organische uitnodigingen.'}</li>
            <li>• {language === 'en' ? 'Certified Aura Catalysts act as self-motivated local nodes.' : 'Gecertificeerde Aura Catalysts werken als zelfsturende lokale knooppunten.'}</li>
          </ul>
        </div>
      </div>

      {/* Action / Prospectus Request Panel */}
      <div className="bg-white rounded-3xl border-2 border-orange-100 p-8 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <span className="text-2xl font-serif">📈</span>
          <h3 className="font-display font-bold text-xl text-slate-900">{t('pitchRequestTitle')}</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {t('pitchRequestDesc')}
          </p>
        </div>

        {formSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-1.5 max-w-md mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-xs">
              {language === 'en' ? 'Request Successfully Received!' : 'Aanvraag Succesvol Ontvangen!'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'en' ? (
                <>No cap! Thank you, <strong>{investorName}</strong>. Our team will prepare the full information memorandum and send it over to <strong className="text-emerald-700">{investorEmail}</strong> within 1 business day.</>
              ) : (
                <>Geen grap! Dank u wel, <strong>{investorName}</strong>. Ons team zal het memorandum voorbereiden en binnen 1 werkdag sturen naar <strong className="text-emerald-700">{investorEmail}</strong>.</>
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-3 max-w-md mx-auto text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500">
                  {language === 'en' ? 'Your Name *' : 'Naam *'}
                </label>
                <input 
                  type="text" 
                  required
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  placeholder="e.g. Alexis de Groot" 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500/50 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500">
                  {language === 'en' ? 'Company / Fund Name' : 'Bedrijf / Fonds Naam'}
                </label>
                <input 
                  type="text" 
                  value={investorCompany}
                  onChange={(e) => setInvestorCompany(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Amsterdam Venture Partners' : 'bijv. Amsterdam Venture Partners'} 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500/50 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500">
                {language === 'en' ? 'Email Address *' : 'E-mailadres *'}
              </label>
              <input 
                type="email" 
                required
                value={investorEmail}
                onChange={(e) => setInvestorEmail(e.target.value)}
                placeholder="alexis@venturefund.nl" 
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500/50 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition cursor-pointer"
            >
              <span>{t('pitchRequestBtn')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="text-[9px] text-slate-400 text-center font-mono">
          {language === 'en' ? (
            '🔒 Secure SSL encrypted channel. General data is protected under European GDPR provisions.'
          ) : (
            '🔒 Beveiligde SSL-verbinding. Algemene gegevens zijn beschermd volgens de Europese AVG/GDPR richtlijnen.'
          )}
        </div>
      </div>
    </div>
  );
}
