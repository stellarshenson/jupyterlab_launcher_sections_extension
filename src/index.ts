import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './request';
import { IConfigResponse } from './types';
import { LauncherSectionApplier } from './applier';

/**
 * Initialization data for the jupyterlab_launcher_section_icons_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_launcher_section_icons_extension:plugin',
  description:
    'Jupyterlab extension to allow setting section-specific icons for the launcher',
  autoStart: true,
  activate: async (app: JupyterFrontEnd) => {
    console.log(
      'JupyterLab extension jupyterlab_launcher_section_icons_extension is activated!'
    );

    const applier = new LauncherSectionApplier();

    try {
      const config = await requestAPI<IConfigResponse>('config');
      console.log(
        `[LauncherSectionIcons] Loaded ${config.sections.length} configurations`
      );
      for (const section of config.sections) {
        console.log(
          `[LauncherSectionIcons] Config for "${section.section}": icon=${!!section.icon}, tooltip=${!!section.tooltip}`
        );
      }
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
