import React from 'react';
import { X, ShieldAlert, PhoneCall, MapPin, CheckSquare, ExternalLink } from 'lucide-react';

interface EmergencyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyGuideModal: React.FC<EmergencyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Deprem Acil Durum Rehberi</h3>
              <p className="text-xs text-slate-400">Hayat kurtaran temel kurallar ve acil bağlantılar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4 text-xs">
          {/* Çök Kapan Tutun */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
            <h4 className="font-bold text-sm text-rose-400 mb-1.5">1. Sarsıntı Anında: ÇÖK - KAPAN - TUTUN</h4>
            <p className="text-slate-300 leading-relaxed">
              Pencerelerden, merdivenlerden ve devrilebilecek ağır dolaplardan uzak durun.
              Sağlam bir masa veya koltuk yanına çöküp başınızı ve boynunuzu koruyun.
              <b> Asla asansöre binmeyin ve balkona koşmayın!</b>
            </p>
          </div>

          {/* Acil Numaralar & Toplanma Alanı */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="flex items-center space-x-2 text-rose-400 font-bold mb-1">
                <PhoneCall className="w-4 h-4" />
                <span>Tek Acil Çağrı</span>
              </div>
              <span className="text-2xl font-extrabold text-white font-mono block">112</span>
              <span className="text-[10px] text-slate-400">AFAD, Ambulans, İtfaiye, Polis</span>
            </div>

            <a
              href="https://turkiye.gov.tr/afet-ve-acil-durum-yonetimi-acil-toplanma-alani-sorgulama"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-cyan-800/60 bg-cyan-950/20 hover:bg-cyan-950/40 transition-colors block"
            >
              <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>Toplanma Alanı</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-200 font-semibold block">E-Devlet Sorgulama</span>
              <span className="text-[10px] text-slate-400">Evinize en yakın güvenli alan</span>
            </a>
          </div>

          {/* Deprem Çantası */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center space-x-2 text-amber-400 font-bold mb-2">
              <CheckSquare className="w-4 h-4" />
              <span>Acil Durum Afet Çantası Kontrolü</span>
            </div>
            <ul className="grid grid-cols-2 gap-1.5 text-slate-300">
              <li>💧 Kişi başı içme suyu</li>
              <li>🥫 Bozulmayan konserve gıda</li>
              <li>📢 Düdük & Ses Çıkarıcı</li>
              <li>🔦 El Feneri & Yedek Pil</li>
              <li>🩹 İlk yardım çantası</li>
              <li>🔋 Taşınabilir Powerbank</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
