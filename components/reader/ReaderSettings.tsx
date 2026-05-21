import React from 'react';
import { useReaderStore } from '@/store/readerStore';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReaderSettingsProps {
  open: boolean;
  onClose: () => void;
}

export function ReaderSettings({ open, onClose }: ReaderSettingsProps) {
  const store = useReaderStore();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-background-surface border-l border-border-subtle z-[70] shadow-2xl transition-transform duration-250 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h2 className="font-heading font-bold text-lg">Settings</h2>
          <Button variant="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 flex flex-col gap-6">
          <SettingSection title="Reading Mode">
            <div className="grid grid-cols-2 gap-2">
              <SettingBtn active={store.mode === 'page'} onClick={() => store.setMode('page')}>Page</SettingBtn>
              <SettingBtn active={store.mode === 'scroll'} onClick={() => store.setMode('scroll')}>Scroll</SettingBtn>
            </div>
          </SettingSection>

          <SettingSection title="Direction (Page Mode)">
            <div className="grid grid-cols-2 gap-2">
              <SettingBtn active={store.direction === 'rtl'} onClick={() => store.setDirection('rtl')} disabled={store.mode === 'scroll'}>RTL (Manga)</SettingBtn>
              <SettingBtn active={store.direction === 'ltr'} onClick={() => store.setDirection('ltr')} disabled={store.mode === 'scroll'}>LTR (Comic)</SettingBtn>
            </div>
          </SettingSection>

          <SettingSection title="Page Fit">
            <div className="grid grid-cols-3 gap-2">
              <SettingBtn active={store.fit === 'width'} onClick={() => store.setFit('width')}>Width</SettingBtn>
              <SettingBtn active={store.fit === 'height'} onClick={() => store.setFit('height')}>Height</SettingBtn>
              <SettingBtn active={store.fit === 'original'} onClick={() => store.setFit('original')}>Original</SettingBtn>
            </div>
          </SettingSection>

          <SettingSection title="Background">
            <div className="grid grid-cols-2 gap-2">
              <SettingBtn active={store.background === 'black'} onClick={() => store.setBackground('black')}>Black</SettingBtn>
              <SettingBtn active={store.background === 'dark'} onClick={() => store.setBackground('dark')}>Dark</SettingBtn>
              <SettingBtn active={store.background === 'sepia'} onClick={() => store.setBackground('sepia')}>Sepia</SettingBtn>
              <SettingBtn active={store.background === 'white'} onClick={() => store.setBackground('white')}>White</SettingBtn>
            </div>
          </SettingSection>
        </div>
      </div>
    </>
  );
}

function SettingSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</label>
      {children}
    </div>
  );
}

function SettingBtn({ active, onClick, disabled, children }: { active: boolean, onClick: () => void, disabled?: boolean, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${active ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-background-elevated text-text-secondary border border-transparent hover:text-text-primary'}`}
    >
      {children}
    </button>
  );
}
