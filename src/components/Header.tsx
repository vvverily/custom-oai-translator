import { Navbar } from 'react-daisyui';
import { useTranslation } from 'react-i18next';

import { ConfigButton } from '@/components/ConfigButton';
import { SwitchLanguageButton } from '@/components/SwitchLanguageButton';
import { ToggleThemeButton } from '@/components/ToggleThemeButton';

function AboutModal() {
  return (
    <>
      <input type="checkbox" id="about-modal" className="modal-toggle" />
      <label htmlFor="about-modal" className="cursor-pointer modal">
        <label className="relative modal-box" htmlFor="">
          <h3 className="pb-4 text-lg font-bold">About Custom OAI Translator</h3>
          <p className="pb-2 font-mono text-xs text-right">Build Time: {BUILD_TIME}</p>
        </label>
      </label>
    </>
  );
}

function Header() {
  const { t } = useTranslation();
  return (
    <>
      <AboutModal />
      <Navbar className="sticky top-0 z-50 bg-base-100 text-base-100-content">
        <div className="flex-1">
          <label className="text-xl normal-case btn btn-ghost" htmlFor="about-modal">
            {t('topBar.title')}
          </label>
        </div>
        <div className="flex-none">
          <ConfigButton />
          <ToggleThemeButton />
          <SwitchLanguageButton />
        </div>
      </Navbar>
    </>
  );
}

export default Header;
