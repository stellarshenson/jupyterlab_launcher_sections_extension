import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './request';

/**
 * Initialization data for the jupyterlab_launcher_section_icons_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_launcher_section_icons_extension:plugin',
  description: 'Jupyterlab extension to allow setting section-specific icons for the launcher',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_launcher_section_icons_extension is activated!');

    requestAPI<any>('hello')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_launcher_section_icons_extension server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
