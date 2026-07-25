import React, { useState } from 'react';
import { SportEvent, LocationInfo } from '../types';
import { X, Calendar, Clock, MapPin, Users, Plus, Trash2, Box, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface CreateEventModalProps {
  onClose: () => void;
  locations: LocationInfo[];
  selectedCity: string;
  onSubmit: (
    eventData: Omit<SportEvent, 'id' | 'host' | 'joinedPlayers' | 'status' | 'whatsappGroupReplaced'>,
    newLocationData?: LocationInfo
  ) => void;
}

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'rotterdam': { lat: 51.9244, lng: 4.4777 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'utrecht': { lat: 52.0907, lng: 5.1214 }
};

export default function CreateEventModal({ onClose, locations, selectedCity, onSubmit }: CreateEventModalProps) {
  const { language, t } = useLanguage();
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<string>('basketball');
  const [customSport, setCustomSport] = useState('');
  
  // Custom Spot Addition States
  const [isCustomSpot, setIsCustomSpot] = useState(false);
  const [customSpotName, setCustomSpotName] = useState('');
  const [customSpotAddress, setCustomSpotAddress] = useState('');
  const [customSpotArea, setCustomSpotArea] = useState('');

  const [locationIndex, setLocationIndex] = useState(0);
  const [date, setDate] = useState('2026-07-21');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('18:00');
  const [maxPlayers, setMaxPlayers] = useState(12);
  const [level, setLevel] = useState<'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced'>('All Levels');
  const [description, setDescription] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);

  // Gear checklist items
  const [newGearItem, setNewGearItem] = useState('');
  const [gearList, setGearList] = useState<{ item: string; providedByHost: boolean }[]>([
    { item: 'Official game ball', providedByHost: true }
  ]);

  const handleAddGear = () => {
    if (!newGearItem.trim()) return;
    setGearList([...gearList, { item: newGearItem.trim(), providedByHost: false }]);
    setNewGearItem('');
  };

  const handleRemoveGear = (index: number) => {
    setGearList(gearList.filter((_, i) => i !== index));
  };

  const handleToggleProvided = (index: number) => {
    const updated = [...gearList];
    updated[index].providedByHost = !updated[index].providedByHost;
    setGearList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (!title.trim() || !description.trim()) {
      setErrorText(language === 'en' ? 'Please fill in title and description.' : 'Vul aub een titel en omschrijving in.');
      return;
    }

    if (isCustomSpot && !customSpotName.trim()) {
      setErrorText(language === 'en' ? 'Please fill in the Custom Spot Name.' : 'Vul aub een naam in voor het eigen plein.');
      return;
    }

    const finalSport = sport === 'other' ? (customSport.trim() || 'other') : sport;
    
    let selectedLoc: LocationInfo;
    let newLocationData: LocationInfo | undefined;

    if (isCustomSpot) {
      // Base reference coordinates from first location, preset city defaults, or fallback
      const cityLower = selectedCity.toLowerCase();
      const presetCoords = CITY_COORDS[cityLower] || { lat: 52.36, lng: 4.89 };
      const baseLat = locations.length > 0 ? locations[0].lat : presetCoords.lat;
      const baseLng = locations.length > 0 ? locations[0].lng : presetCoords.lng;
      
      selectedLoc = {
        name: customSpotName.trim(),
        address: customSpotAddress.trim() || `${customSpotName.trim()}, ${selectedCity}`,
        area: customSpotArea.trim() || 'Local Area',
        city: selectedCity,
        // Small random offset so pins don't overlap completely
        lat: baseLat + (Math.random() - 0.5) * 0.012,
        lng: baseLng + (Math.random() - 0.5) * 0.012
      };
      newLocationData = selectedLoc;
    } else {
      selectedLoc = locations[locationIndex] || locations[0];
    }

    const formattedGear = gearList.map((g, i) => ({
      id: `g_created_${Date.now()}_${i}`,
      item: g.item,
      providedByHost: g.providedByHost,
      fulfilled: g.providedByHost, // fulfilled automatically if provided by host
    }));

    onSubmit({
      title: title.trim(),
      sport: finalSport,
      description: description.trim(),
      location: selectedLoc,
      date,
      startTime,
      endTime,
      maxPlayers,
      level,
      neededGear: formattedGear,
    }, newLocationData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        id="create-event-modal"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-display font-bold text-lg text-slate-900">
              {language === 'en' ? 'Host a Community Activity' : 'Organiseer een Buurtactiviteit'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en' 
                ? 'Skip messy group chats. Create a dedicated event with RSVP and gear checklists.'
                : 'Sla chaotische chats over. Maak een overzichtelijke activiteit met RSVP en spullen-checklist.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorText && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-xs text-rose-800 text-left font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left flex-1 overflow-y-auto">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {language === 'en' ? 'Activity Title' : 'Titel van de Activiteit'}
            </label>
            <input
              type="text"
              placeholder={language === 'en' ? 'e.g. 3x3 Basketball Half-court Pickup' : 'bijv. 3x3 Basketbal op het Plein'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-850"
            />
          </div>

          {/* Sport & Skill Level Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'Quest Type' : 'Type Activiteit'}
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              >
                <option value="basketball">🏀 {language === 'en' ? 'Basketball 3x3' : 'Basketbal 3x3'}</option>
                <option value="football">⚽ {language === 'en' ? 'Street Football' : 'Straatvoetbal'}</option>
                <option value="skateboarding">🛹 {language === 'en' ? 'Skateboarding' : 'Skateboarden'}</option>
                <option value="spikeball">🟡 Spikeball</option>
                <option value="dance">💃 {language === 'en' ? 'Street Dance Jam' : 'Straatdans / Dans Jam'}</option>
                <option value="music">🎤 {language === 'en' ? 'Music Jam & Cypher' : 'Muziek Jam & Cypher'}</option>
                <option value="museum">🏛️ {language === 'en' ? 'Museum / Culture' : 'Museum / Cultuur'}</option>
                <option value="arts">🎨 {language === 'en' ? 'Arts & Creativity' : 'Kunst & Creativiteit'}</option>
                <option value="other">🌟 {language === 'en' ? 'Other Side Quest...' : 'Andere activiteit...'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'Skill Level' : 'Niveau'}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              >
                <option value="All Levels">{language === 'en' ? 'All Levels Welcome' : 'Alle niveaus welkom'}</option>
                <option value="Beginner">{language === 'en' ? 'Beginner Focus' : 'Beginner focus'}</option>
                <option value="Intermediate">{language === 'en' ? 'Intermediate Run' : 'Gemiddeld niveau'}</option>
                <option value="Advanced">{language === 'en' ? 'Advanced / Competitive' : 'Gevorderd / Competitief'}</option>
              </select>
            </div>
          </div>

          {/* Custom Category Input (Conditional) */}
          {sport === 'other' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1"
            >
              <label className="text-xs font-bold text-orange-600">
                {language === 'en' ? 'Name your Custom Side Quest' : 'Naam van je eigen activiteit'}
              </label>
              <input
                type="text"
                placeholder={language === 'en' ? 'e.g. Beatmaking, Open Mic Cyphers, Street Art Jams' : 'bijv. Bordspellen, Schaken, Tekenen'}
                value={customSport}
                onChange={(e) => setCustomSport(e.target.value)}
                required
                className="w-full bg-slate-50 border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              />
            </motion.div>
          )}

          {/* Location Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {language === 'en' ? `Neighborhood Spot in ${selectedCity}` : `Buurtlocatie in ${selectedCity}`}
              </label>
              <button
                type="button"
                onClick={() => setIsCustomSpot(!isCustomSpot)}
                className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
              >
                {isCustomSpot 
                  ? (language === 'en' ? "Choose preset spot" : "Kies bestaande plek") 
                  : (language === 'en' ? "📍 Spot not listed? Add custom spot" : "📍 Plek niet in de lijst? Eigen plek toevoegen")
                }
              </button>
            </div>

            {!isCustomSpot ? (
              <select
                value={locationIndex}
                onChange={(e) => setLocationIndex(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              >
                {locations.map((loc, i) => (
                  <option key={i} value={i}>
                    {loc.name} ({loc.area}) — {loc.address}
                  </option>
                ))}
              </select>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-orange-800">
                    {language === 'en' ? 'Custom Spot / Park Name' : 'Naam van de nieuwe plek'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Westside Sports Cage, Central Court"
                    value={customSpotName}
                    onChange={(e) => setCustomSpotName(e.target.value)}
                    required={isCustomSpot}
                    className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-200 focus:outline-none text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-orange-800">
                      {language === 'en' ? 'Address' : 'Adres'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Park Street 12, Utrecht"
                      value={customSpotAddress}
                      onChange={(e) => setCustomSpotAddress(e.target.value)}
                      className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-200 focus:outline-none text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-orange-800">
                      {language === 'en' ? 'Area / Neighborhood' : 'Wijk / Buurt'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Noord-Oost, Midtown"
                      value={customSpotArea}
                      onChange={(e) => setCustomSpotArea(e.target.value)}
                      className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-200 focus:outline-none text-slate-800"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-orange-600/80 leading-normal">
                  {language === 'en' 
                    ? `This spot will be instantly added to the map database for ${selectedCity} so anyone can use it.`
                    : `Deze plek wordt direct toegevoegd aan de kaart voor ${selectedCity} zodat iedereen hem kan gebruiken.`}
                </p>
              </motion.div>
            )}
          </div>

          {/* Date & Spots Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'Date' : 'Datum'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'Max Player Limit' : 'Maximaal aantal personen'}
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'Start Time' : 'Begintijd'}
              </label>
              <input
                type="text"
                placeholder="e.g. 16:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'End Time' : 'Eindtijd'}
              </label>
              <input
                type="text"
                placeholder="e.g. 18:30"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {language === 'en' ? 'Description & Rules' : 'Omschrijving & Huisregels'}
            </label>
            <textarea
              placeholder={language === 'en' ? 'What are the rules of the match? Any special instructions?' : 'Wat gaan jullie doen? Zijn er specifieke afspraken?'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none text-slate-800"
            />
          </div>

          {/* Sports Gear Checklist */}
          <div className="border-t border-slate-100 pt-4 space-y-2.5">
            <label className="text-xs font-bold text-slate-700 flex items-center">
              <Box className="w-4 h-4 mr-1.5 text-slate-400" /> 
              {language === 'en' ? 'Equipment & Gear Checklist' : 'Mee te nemen spullen & Gear'}
            </label>
            <p className="text-[10px] text-slate-500 leading-normal">
              {language === 'en' 
                ? 'List the gear items needed. You can mark if you are providing them as host, or if you need players to volunteer to bring them.'
                : 'Maak een lijst van spullen die nodig zijn. Geef aan of jij dit als organisator meeneemt of dat iemand anders hieraan kan bijdragen.'}
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={language === 'en' ? 'Add gear, e.g. Second Spikeball set, Soundbox' : 'Voeg toe, bijv. Bluetooth speaker, Extra ballen'}
                value={newGearItem}
                onChange={(e) => setNewGearItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGear())}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddGear}
                className="bg-slate-900 hover:bg-slate-800 text-white px-3 rounded-xl flex items-center justify-center transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Gear list feedback */}
            <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
              {gearList.map((g, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-medium text-slate-700">{g.item}</span>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={g.providedByHost}
                        onChange={() => handleToggleProvided(index)}
                        className="rounded text-orange-500 focus:ring-orange-500 h-3 w-3 border-slate-300"
                      />
                      <span className="text-[10px] text-slate-500 font-bold">
                        {language === 'en' ? 'Provided by me' : 'Neem ik mee'}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveGear(index)}
                      className="text-rose-500 hover:text-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-slate-100 pt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : 'Annuleren'}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-100 transition cursor-pointer"
            >
              {language === 'en' ? 'Launch Activity' : 'Activiteit lanceren'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
