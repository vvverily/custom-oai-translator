import { useDebouncedValue } from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Toggle } from 'react-daisyui';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import OpenAIClient from '@/client';
import { useGlobalStore } from '@/components/GlobalStore';

function ConfigPage() {
  const { t } = useTranslation();
  const {
    configValues: { openaiApiUrl, openaiApiKey, streamEnabled, currentModel, temperatureParam },
    setConfigValues,
  } = useGlobalStore();
  const openaiApiInputRef = useRef<HTMLInputElement>(null);

  const [inputUrl, setInputUrl] = useState(openaiApiUrl);
  const [inputKey, setInputKey] = useState(openaiApiKey);
  const [debouncedUrl] = useDebouncedValue(inputUrl, 500);
  const [debouncedKey] = useDebouncedValue(inputKey, 500);

  const [fetchedModels, setFetchedModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  useEffect(() => {
    if (debouncedUrl && debouncedKey) {
      setIsFetchingModels(true);
      OpenAIClient.setApiBaseUrl(debouncedUrl);
      OpenAIClient.fetchModels(debouncedKey)
        .then((models) => {
          setFetchedModels(models);
          setIsFetchingModels(false);
        })
        .catch((err) => {
          console.error('Failed to fetch models:', err);
          setFetchedModels([]);
          setIsFetchingModels(false);
        });
    } else {
      setFetchedModels([]);
    }
  }, [debouncedUrl, debouncedKey]);

  const handleSave = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const { openaiApiUrl, openaiApiKey, streamEnabled, selectedModel, temperatureParam } = Object.fromEntries(
        formData.entries(),
      );
      if (!openaiApiUrl) {
        toast.error(t('Please enter API Url.'));
        return;
      }
      if (!openaiApiKey) {
        toast.error(t('Please enter your API Key.'));
        return;
      }
      if (!selectedModel) {
        toast.error(t('Please select a model.'));
        return;
      }
      setConfigValues((prev) => ({
        ...prev,
        openaiApiUrl: `${openaiApiUrl}`,
        openaiApiKey: `${openaiApiKey}`,
        streamEnabled: streamEnabled === 'on',
        currentModel: selectedModel as string,
        temperatureParam: +temperatureParam,
      }));
      toast.success(t('Config Saved!'));
    },
    [setConfigValues, t],
  );

  const handleResetOpenaiApiUrl = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      const inputRef = openaiApiInputRef.current;
      if (!inputRef) {
        return;
      }
      inputRef.value = 'https://api.openai.com';
      setInputUrl('https://api.openai.com');
      inputRef.focus();
      // eslint-disable-next-line quotes
      toast(t("Don't forget to click the save button for the settings to take effect!"));
    },
    [t],
  );

  const renderModelOptions = () => {
    const modelsToRender = new Set(fetchedModels);
    if (currentModel && !modelsToRender.has(currentModel)) {
      modelsToRender.add(currentModel);
    }

    if (modelsToRender.size === 0) {
      return (
        <option value="" disabled>
          {t('Please enter API Key and Url to fetch models')}
        </option>
      );
    }

    return Array.from(modelsToRender).map((model) => (
      <option key={model} value={model}>
        {model}
      </option>
    ));
  };

  return (
    <div className="p-6 w-[28.75rem] max-w-[100vw] bg-base-100 overflow-y-auto overflow-x-hidden h-full">
      <h1 className="sticky top-0 z-50 flex justify-between w-full text-2xl font-bold align-middle bg-base-100">
        <span className="leading-[48px]">{t('Config')}</span>
        <label
          htmlFor="history-record-drawer"
          className="drawer-button btn btn-primary btn-ghost btn-circle"
          title={t('Close')}
        >
          <FaTimes size={20} />
        </label>
      </h1>
      <form method="post" onSubmit={handleSave}>
        <div className="mb-2 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('Use stream (typing effect)')}</span>
            <Toggle color="primary" name="streamEnabled" defaultChecked={streamEnabled} />
          </label>
        </div>
        <div className="mb-2 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('OpenAI API Url')}</span>
            <span className="label-text-alt">
              <a className="link link-primary" href="#" onClick={handleResetOpenaiApiUrl}>
                {t('Reset to default')}
              </a>
            </span>
          </label>
          <Input
            ref={openaiApiInputRef}
            name="openaiApiUrl"
            color="primary"
            className="break-all"
            placeholder={t('Please input OpenAI API Url here.')}
            defaultValue={openaiApiUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            required
          />
        </div>
        <div className="mb-2 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('OpenAI API Key')}</span>
            <span className="label-text-alt">
              <a
                className="link link-primary"
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer noopener"
              >
                {t('Get your OpenAI API Key')}
              </a>
            </span>
          </label>
          <textarea
            name="openaiApiKey"
            className="h-24 break-all resize-none rounded-2xl textarea textarea-md textarea-primary"
            placeholder={t('Please paste your OpenAI API Key here.')}
            defaultValue={openaiApiKey}
            onChange={(e) => setInputKey(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-2 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">
              {t('Model (engine)')}
              {isFetchingModels && (
                <span className="ml-2 text-sm font-normal text-gray-500">{t('Fetching models...')}</span>
              )}
            </span>
          </label>
          <select
            className="w-full select select-primary"
            defaultValue={currentModel}
            name="selectedModel"
            title="Selected model"
          >
            {renderModelOptions()}
          </select>
        </div>
        <div className="mb-4 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('Temperature')}</span>
            <span className="label-text-alt">{t('Higher temperature will be more creative.')}</span>
          </label>
          <input
            type="range"
            name="temperatureParam"
            min="0.4"
            max="1.0"
            defaultValue={temperatureParam}
            className="range range-primary"
            step="0.1"
          />
          <div className="flex justify-between w-full pl-0 pr-1 text-xs">
            <span>rad</span>
            <span>0.5</span>
            <span>0.6</span>
            <span>0.7</span>
            <span>0.8</span>
            <span>0.9</span>
            <span>1.0</span>
          </div>
        </div>
        <div className="form-control">
          <Button type="submit" color="primary">
            {t('Save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
