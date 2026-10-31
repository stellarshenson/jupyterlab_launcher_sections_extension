import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './request';
import { IConfigResponse } from './types';
import { LauncherSectionApplier } from './applier';

/**
 * Initialization data for the @stellarshenson/jupyterlab-launcher-sections-extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@stellarshenson/jupyterlab-launcher-sections-extension:plugin',
  description:
    'Jupyterlab extension to allow setting section-specific icons for the launcher',
  autoStart: true,
  activate: async (app: JupyterFrontEnd) => {
    console.log(
      'JupyterLab extension @stellarshenson/jupyterlab-launcher-sections-extension is activated!'
    );
    const applier = new LauncherSectionApplier();

    try {
      const config = await requestAPI<IConfigResponse>('config');
      applier.setConfigs(config.sections);
    } catch (reason) {
      console.error(
        `[LauncherSectionIcons] Failed to load configurations: ${reason}`
      );
      return;
    }

    // Start applying icons after the app is restored
    app.restored.then(() => {
      applier.start();
    });
  }
};

export default plugin;
