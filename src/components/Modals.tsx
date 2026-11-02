/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CameraMode, CharacterId, LevelDefinition, RunStats } from '../game/types';
import { formatGameTime } from '../game/rules';
import { ALL_50_TRAPS, getTrapDefinition, TrapCategory } from '../game/traps';
import { CHARACTER_PRESETS } from '../game/character';

export const CharacterAvatarIcon: React.FC<{ characterId: CharacterId; className?: string }> = ({
  characterId,
  className = 'w-6 h-6',
}) => {
  if (characterId === 'kaito') {
    // Human boy with hoodie and backwards cap
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="6" fill="#fed7aa" />
        <path d="M6 10C6 6.686 8.686 4 12 4C15.314 4 18 6.686 18 10H6Z" fill="#0f172a" />
        <rect x="16" y="8" width="5" height="3" rx="1.5" fill="#0f172a" />
        <circle cx="9.5" cy="10.5" r="1.2" fill="#2563eb" />
        <circle cx="14.5" cy="10.5" r="1.2" fill="#2563eb" />
        <path d="M10.5 13C11 13.7 13 13.7 13.5 13" stroke="#be123c" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M5 21C5 17.5 8 16 12 16C16 16 19 17.5 19 21" fill="#dc2626" />
        <path d="M12 16V21" stroke="#ffffff" strokeWidth="1.2" />
      </svg>
    );
  }
  if (characterId === 'kibo') {
    // Cartoon Ninja Fox with ears & scarf
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <polygon points="6,9 3,2 10,6" fill="#f97316" />
        <polygon points="5.5,7 4,3.5 8.5,5.5" fill="#fef08a" />
        <polygon points="18,9 21,2 14,6" fill="#f97316" />
        <polygon points="18.5,7 20,3.5 15.5,5.5" fill="#fef08a" />
        <circle cx="12" cy="12" r="6" fill="#f97316" />
        <path d="M9 13C9 14.5 10.3 16 12 16C13.7 16 15 14.5 15 13C15 12 13.5 11 12 11C10.5 11 9 12 9 13Z" fill="#fef08a" />
        <ellipse cx="9.5" cy="10.5" rx="1.3" ry="1.6" fill="#0d9488" />
        <ellipse cx="14.5" cy="10.5" rx="1.3" ry="1.6" fill="#0d9488" />
        <circle cx="12" cy="13.2" r="0.8" fill="#0f172a" />
        <path d="M6 18C8 17 16 17 18 18C18 21 16 22 12 22C8 22 6 21 6 18Z" fill="#dc2626" />
        <path d="M16 19L22 20L19 22" fill="#eab308" />
      </svg>
    );
  }
  if (characterId === 'aoi') {
    // Anime girl with twintails and cat ears
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M7 9C4 9 2 13 4 18C4.5 15 6 14 7 13" fill="#06b6d4" />
        <path d="M17 9C20 9 22 13 20 18C19.5 15 18 14 17 13" fill="#06b6d4" />
        <circle cx="12" cy="11" r="5.5" fill="#ffe4e6" />
        <path d="M6.5 10C8 6 16 6 17.5 10C16 8 14 7.5 12 8C10 7.5 8 8 6.5 10Z" fill="#06b6d4" />
        <polygon points="8,7 6,3 10,5" fill="#f43f5e" />
        <polygon points="16,7 18,3 14,5" fill="#f43f5e" />
        <ellipse cx="9.5" cy="11.5" rx="1.4" ry="1.8" fill="#06b6d4" />
        <circle cx="9.2" cy="10.8" r="0.5" fill="#ffffff" />
        <ellipse cx="14.5" cy="11.5" rx="1.4" ry="1.8" fill="#06b6d4" />
        <circle cx="14.2" cy="10.8" r="0.5" fill="#ffffff" />
        <path d="M6 21C6 17.5 8 16.5 12 16.5C16 16.5 18 17.5 18 21" fill="#f8fafc" />
        <path d="M9 17L12 19L15 17" fill="#f43f5e" />
      </svg>
    );
  }
  // Sparky: Cute Chibi Robot
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="2" x2="12" y2="5" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="12" cy="2" r="1.5" fill="#38bdf8" />
      <rect x="6" y="5" width="12" height="10" rx="3" fill="#facc15" />
      <rect x="7.5" y="6.5" width="9" height="7" rx="2" fill="#0f172a" />
      <path d="M9 10C9 9 10.5 9 10.5 10" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 10C13.5 9 15 9 15 10" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 16H18V21C18 21.5 17.5 22 17 22H7C6.5 22 6 21.5 6 21V16Z" fill="#facc15" />
      <circle cx="12" cy="19" r="1.5" fill="#ef4444" />
    </svg>
  );
};

interface TitleScreenProps {
  levels: LevelDefinition[];
  selectedLevelId: number;
  onSelectLevel: (id: number) => void;
  onStartGame: () => void;
  cameraMode: CameraMode;
  onToggleCamera: () => void;
  onOpenTrapsCodex?: () => void;
  selectedCharacterId: CharacterId;
  onSelectCharacter: (id: CharacterId) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  levels,
  selectedLevelId,
  onSelectLevel,
  onStartGame,
  cameraMode,
  onToggleCamera,
  onOpenTrapsCodex,
  selectedCharacterId,
  onSelectCharacter,
}) => {
  const currentSelectedLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];
  const activeChar = CHARACTER_PRESETS[selectedCharacterId] || CHARACTER_PRESETS.kaito;

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between items-center p-8 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 text-slate-100 select-none">
      {/* Top Title Lockup with custom SVG emblem */}
      <div className="flex flex-col items-center mt-6 text-center">
        <div className="flex items-center gap-3 mb-2">
          {/* Custom SVG Geometric Runner Emblem */}
          <svg className="w-10 h-10 text-orange-500" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="6" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2.5" />
            <path d="M10 22L16 10L22 22" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="14" r="2.5" fill="#f97316" />
          </svg>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight font-sans text-white uppercase">
            Acro<span className="text-orange-500">Minimal</span>
          </h1>
        </div>
        <p className="text-sm md:text-base font-light text-slate-300 tracking-wide max-w-md">
          Trò chơi parkour 3D phong cách tối giản: tốc độ, nhịp điệu và sự chính xác tuyệt đối.
        </p>
      </div>

      {/* Center Stage & Level Selection Box */}
      <div className="w-full max-w-3xl bg-slate-900/95 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl flex flex-col gap-3.5 backdrop-blur-none">
        {/* 1. Character Selector: Human & Cartoon Characters */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-1.5">
                <span>👤 CHỌN NHÂN VẬT</span>
                <span className="text-[10px] text-orange-400 font-normal">(CON NGƯỜI & HOẠT HÌNH)</span>
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              {activeChar.badge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(CHARACTER_PRESETS) as CharacterId[]).map((cid) => {
              const char = CHARACTER_PRESETS[cid];
              const isSelected = char.id === selectedCharacterId;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => onSelectCharacter(char.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/15 ring-1 ring-orange-500/60 shadow'
                      : 'border-slate-800/90 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-md shrink-0 flex items-center justify-center ${
                      isSelected ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <CharacterAvatarIcon characterId={char.id} className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white leading-tight truncate">{char.name}</span>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300 shrink-0">
                        {char.category === 'human' ? 'Người' : 'Hoạt hình'}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 truncate">{char.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Character Description Lore */}
          <div className="text-[11px] text-slate-300/90 bg-slate-900/60 rounded px-2.5 py-1.5 border border-slate-800/60 flex items-center justify-between gap-2">
            <span className="line-clamp-1 italic">{activeChar.description}</span>
            <span className="text-[9px] font-mono text-cyan-400 shrink-0">ĐÃ ÁP DỤNG MẪU 3D</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">CHỌN MÀN CHƠI</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold">
              50 MÀN THỬ THÁCH
            </span>
          </div>

          {/* Chapter Quick Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 0, label: 'TẤT CẢ (50)' },
              { id: 1, label: 'CHƯƠNG 1 (1-10)' },
              { id: 2, label: 'CHƯƠNG 2 (11-20)' },
              { id: 3, label: 'CHƯƠNG 3 (21-30)' },
              { id: 4, label: 'CHƯƠNG 4 (31-40)' },
              { id: 5, label: 'CHƯƠNG 5 (41-50)' },
            ].map((tab) => {
              const currentChapter = Math.ceil(selectedLevelId / 10);
              const isActive = tab.id === 0 ? false : tab.id === currentChapter;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id !== 0) {
                      const firstLevelOfChap = (tab.id - 1) * 10 + 1;
                      onSelectLevel(firstLevelOfChap);
                    }
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Cards Grid with smooth scroll */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-[220px] sm:max-h-[260px] overflow-y-auto pr-1">
          {levels.map((lvl) => {
            const isSelected = lvl.id === selectedLevelId;
            const chapterNum = Math.ceil(lvl.id / 10);
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 text-white shadow-md ring-1 ring-orange-500/60'
                    : 'border-slate-800/90 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    MÀN {lvl.id}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">C{chapterNum}</span>
                </div>
                <div className="font-bold text-xs leading-tight text-white line-clamp-1">{lvl.name}</div>
                <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{lvl.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Level Detail Briefing */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">
              MÀN {currentSelectedLevel.id}: {currentSelectedLevel.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40">
              CHƯƠNG {Math.ceil(currentSelectedLevel.id / 10)}
            </span>
          </div>
          <div className="text-slate-300 text-xs">{currentSelectedLevel.description}</div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span className="text-amber-300 font-bold">MỤC TIÊU VÀNG: &lt; {currentSelectedLevel.targetTimes.gold}s</span>
            <span>BẠC: &lt; {currentSelectedLevel.targetTimes.silver}s</span>
            <span>ĐỒNG: &lt; {currentSelectedLevel.targetTimes.bronze}s</span>
          </div>
        </div>

        {/* Mode & Start Row */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <div
            className="px-3 py-2.5 bg-slate-900/80 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono flex items-center gap-2 select-none shrink-0"
            title="Luôn cố định góc nhìn thứ 3"
          >
            <span>CAMERA:</span>
            <span className="font-bold text-cyan-400">
              SỐ 3 (3RD PERS)
            </span>
          </div>

          {onOpenTrapsCodex && (
            <button
              type="button"
              onClick={onOpenTrapsCodex}
              className="px-3 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition shadow shrink-0"
              title="Xem danh mục và mẹo sinh tồn né 50 loại bẫy nguy hiểm"
            >
              <span>📖 TỪ ĐIỂN 50 BẪY</span>
            </button>
          )}

          <button
            type="button"
            data-start="true"
            onClick={onStartGame}
            className="flex-1 min-w-[200px] py-2.5 px-6 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>BẮT ĐẦU CHẠY MÀN {currentSelectedLevel.id}</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom borderless hints */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="text-xs font-mono text-cyan-300 tracking-wide">
          <span className="font-bold text-white">MŨI TÊN CHUỘT:</span> Di chuyển chuột để đổi hướng · Giữ Chuột Trái hoặc W để chạy tới
        </div>
        <div className="text-[11px] font-mono text-slate-400 tracking-wider">
          NHẤN <span className="text-white font-semibold">SPACE</span> HOẶC{' '}
          <span className="text-white font-semibold">ENTER</span> ĐỂ VÀO MÀN NGAY
        </div>
      </div>
    </div>
  );
};

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToTitle: () => void;
  onOpenTrapsCodex?: () => void;
  selectedCharacterId: CharacterId;
  onSelectCharacter: (id: CharacterId) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuitToTitle,
  onOpenTrapsCodex,
  selectedCharacterId,
  onSelectCharacter,
}) => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/75 select-none text-slate-100">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-3.5 text-center">
        <h2 className="text-xl font-bold tracking-tight uppercase text-white">TẠM DỪNG TRÒ CHƠI</h2>
        <p className="text-xs text-slate-400">Trò chơi đang dừng. Bạn muốn đổi nhân vật hay tiếp tục?</p>

        {/* Quick character switcher */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span>ĐỔI NHÂN VẬT:</span>
            <span className="font-bold text-orange-400">{CHARACTER_PRESETS[selectedCharacterId].name}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.keys(CHARACTER_PRESETS) as CharacterId[]).map((cid) => {
              const char = CHARACTER_PRESETS[cid];
              const isSelected = char.id === selectedCharacterId;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => onSelectCharacter(char.id)}
                  title={`${char.name} - ${char.subtitle}`}
                  className={`p-1.5 rounded border flex flex-col items-center justify-center transition cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/60'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <CharacterAvatarIcon characterId={char.id} className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-mono font-bold">{char.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition shadow cursor-pointer"
          >
            TIẾP TỤC (ESC)
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
          >
            CHẠY LẠI MÀN NÀY (R)
          </button>
          {onOpenTrapsCodex && (
            <button
              type="button"
              onClick={onOpenTrapsCodex}
              className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📖 TỪ ĐIỂN 50 LOẠI BẪY</span>
            </button>
          )}
          <button
            type="button"
            onClick={onQuitToTitle}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono uppercase tracking-wider rounded-lg transition border border-slate-800 cursor-pointer"
          >
            VỀ MENU CHÍNH
          </button>
        </div>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  stats: RunStats;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onQuitToTitle: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onQuitToTitle,
}) => {
  const medalColor = {
    gold: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
    silver: 'text-slate-300 border-slate-300/40 bg-slate-300/10',
    bronze: 'text-amber-700 border-amber-700/40 bg-amber-700/10',
    none: 'text-slate-400 border-slate-700 bg-slate-800/40',
  }[stats.medal];

  const medalLabel = {
    gold: 'HUY CHƯƠNG VÀNG',
    silver: 'HUY CHƯƠNG BẠC',
    bronze: 'HUY CHƯƠNG ĐỒNG',
    none: 'HOÀN THÀNH MÀN',
  }[stats.medal];

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/80 select-none text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 text-center">
        <div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border mb-2 text-cyan-400 border-cyan-400/30 bg-cyan-400/10">
            CHINH PHỤC THÀNH CÔNG
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase text-white">{stats.levelName}</h2>
        </div>

        {/* Medal Badge */}
        <div className={`py-2 px-4 rounded-lg border font-mono font-bold text-sm ${medalColor}`}>
          {medalLabel}
        </div>

        {/* Run Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
            <div className="text-[10px] font-mono uppercase text-slate-400">Thời gian về đích</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {formatGameTime(stats.elapsedTime)}
            </div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
            <div className="text-[10px] font-mono uppercase text-slate-400">Tốc độ cực đại</div>
            <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
              {Math.round(stats.maxSpeed * 3.6)} <span className="text-xs">KM/H</span>
            </div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
            <div className="text-[10px] font-mono uppercase text-slate-400">Cú chạy tường</div>
            <div className="text-lg font-bold font-mono text-orange-400 tabular-nums">{stats.wallRuns}</div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
            <div className="text-[10px] font-mono uppercase text-slate-400">Số bước nhảy & lướt</div>
            <div className="text-lg font-bold font-mono text-slate-200 tabular-nums">
              {stats.jumps + stats.dashes}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-1">
          {hasNextLevel ? (
            <button
              type="button"
              data-start="true"
              onClick={onNextLevel}
              className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition shadow-lg cursor-pointer"
            >
              MÀN TIẾP THEO
            </button>
          ) : (
            <button
              type="button"
              data-start="true"
              onClick={onReplay}
              className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition shadow-lg cursor-pointer"
            >
              CHƠI LẠI
            </button>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase rounded-lg transition"
            >
              CHẠY LẠI
            </button>
            <button
              type="button"
              onClick={onQuitToTitle}
              className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono uppercase rounded-lg transition"
            >
              MENU CHÍNH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GameOverModalProps {
  reason?: 'fall' | 'trap';
  trapInfo?: { type?: string; name?: string; tip?: string } | null;
  onRespawn: () => void;
  onRestart: () => void;
  onQuitToTitle: () => void;
  onOpenTrapsCodex?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason = 'fall',
  trapInfo,
  onRespawn,
  onRestart,
  onQuitToTitle,
  onOpenTrapsCodex,
}) => {
  const isTrap = reason === 'trap';

  const getTrapDisplay = () => {
    if (!isTrap) {
      return {
        title: 'RƠI KHỎI ĐƯỜNG ĐUA',
        tip: 'Hãy căn chỉnh thời điểm chạy đà, nhảy kép và búng tường chính xác hơn!',
        badge: 'RƠI VỰC THẲM',
        icon: '⚠️',
        danger: 2,
      };
    }

    const def = getTrapDefinition(trapInfo?.type);
    return {
      title: `BỊ ${def.name.toUpperCase()} TIÊU DIỆT!`,
      tip: trapInfo?.tip || def.evasionTip,
      badge: `${def.categoryName} · ${def.name}`,
      icon: def.icon,
      danger: def.dangerLevel,
    };
  };

  const display = getTrapDisplay();

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/85 select-none text-slate-100">
      <div
        className={`w-full max-w-sm bg-slate-900 border ${
          isTrap ? 'border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.45)]' : 'border-red-500/30'
        } rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-center`}
      >
        <div
          className={`w-12 h-12 mx-auto rounded-full ${
            isTrap ? 'bg-red-500/25 text-red-400 ring-2 ring-red-500/60 animate-bounce' : 'bg-red-500/20 text-red-400'
          } flex items-center justify-center text-2xl`}
        >
          {isTrap ? display.icon : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
        </div>

        <div>
          <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider mb-1.5 uppercase bg-red-500/15 text-red-400 border border-red-500/30">
            {display.badge}
          </div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            {display.title}
          </h2>
          {isTrap && (
            <div className="text-amber-400 text-xs mt-0.5 tracking-wider font-mono">
              ĐỘ NGUY HIỂM: {'⭐'.repeat(display.danger)}
            </div>
          )}
          <p className="text-xs text-slate-300 mt-1.5">
            {display.tip}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            data-start="true"
            onClick={onRespawn}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition shadow-lg cursor-pointer"
          >
            HỒI SINH TẠI CHECKPOINT (SPACE / R)
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider rounded-lg transition"
          >
            CHẠY LẠI TỪ ĐẦU
          </button>
          {onOpenTrapsCodex && (
            <button
              type="button"
              onClick={onOpenTrapsCodex}
              className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <span>📖 XEM MẸO NÉ 50 BẪY</span>
            </button>
          )}
          <button
            type="button"
            onClick={onQuitToTitle}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono uppercase tracking-wider rounded-lg transition"
          >
            VỀ MENU CHÍNH
          </button>
        </div>
      </div>
    </div>
  );
};

interface TrapEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrapEncyclopediaModal: React.FC<TrapEncyclopediaModalProps> = ({ isOpen, onClose }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'TẤT CẢ (50)' },
    { id: 'crush', label: 'BÚA & ÉP' },
    { id: 'laser', label: 'LASER' },
    { id: 'fire', label: 'LỬA' },
    { id: 'blade', label: 'CƯA & DAO' },
    { id: 'electric', label: 'ĐIỆN & PLASMA' },
    { id: 'acid', label: 'AXIT & ĐỘC' },
    { id: 'ice', label: 'BĂNG GIÁ' },
    { id: 'gravity', label: 'TRỌNG LỰC' },
    { id: 'explosive', label: 'BOM MÌN' },
    { id: 'spikes', label: 'HẦM CHÔNG' },
    { id: 'mechanical', label: 'CƠ KHÍ' },
  ];

  const filteredTraps = ALL_50_TRAPS.filter((t) => {
    const matchesCat = selectedCat === 'all' || t.category === selectedCat;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.evasionTip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 select-none text-slate-100">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-wide">
                TỪ ĐIỂN 50 LOẠI BẪY TỬ THẦN
              </h2>
              <p className="text-xs text-slate-400">
                Cẩm nang sinh tồn: Thông số, cơ chế và bí kíp phản xạ vượt qua toàn bộ cơ quan bẫy.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition ${
                  selectedCat === c.id
                    ? 'bg-orange-500 text-slate-950 shadow'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Tìm bẫy theo tên / mẹo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono sm:w-56"
          />
        </div>

        {/* Cards Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
          {filteredTraps.map((trap) => (
            <div
              key={trap.id}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-2.5 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{trap.icon}</span>
                    <span className="font-bold text-white text-sm line-clamp-1">{trap.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    #{trap.number}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-cyan-400 font-mono text-[10px] font-semibold">{trap.categoryName}</span>
                  <span className="text-amber-400 font-mono text-[10px]">
                    {'⭐'.repeat(trap.dangerLevel)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {trap.shortDesc}
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-[11px] text-amber-200">
                <span className="font-bold text-amber-300 uppercase block mb-0.5 font-mono text-[9px] tracking-wider">
                  MẸO SINH TỒN:
                </span>
                {trap.evasionTip}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Hiển thị {filteredTraps.length} / 50 loại bẫy tử thần
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
          >
            ĐÓNG (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
