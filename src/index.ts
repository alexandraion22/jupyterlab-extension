import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';

interface IGoogleAuthStatePayload {
  email?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  id_token?: string | null;
  raw?: unknown;
}

/**
 * Initialization data for the main menu example.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/main-menu:plugin',
  description: 'Minimal JupyterLab example adding a menu.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    const { commands } = app;

    // Add a command
    const command = 'jlab-examples:main-menu';
    commands.addCommand(command, {
      label: 'Execute jlab-examples:main-menu Command',
      caption: 'Execute jlab-examples:main-menu Command',
      execute: async () => {
        const baseUrl = PageConfig.getBaseUrl();
        const requestToken = PageConfig.getToken();
        const headers: HeadersInit = {};
        if (requestToken) {
          headers['Authorization'] = `token ${requestToken}`;
        }

        try {
          const response = await fetch(`${baseUrl}google-auth-state`, {
            headers
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const payload =
            (await response.json()) as IGoogleAuthStatePayload;

          const messageLines = [
            `Google account: ${payload.email ?? 'unknown'}`,
            `Access token: ${payload.access_token ?? 'missing'}`,
            `Refresh token: ${payload.refresh_token ?? 'missing'}`,
            `ID token: ${payload.id_token ?? 'missing'}`
          ];

          console.log('Google auth payload:', payload);
          window.alert(messageLines.join('\n'));
        } catch (error) {
          console.error('Failed to load Google auth state', error);
          window.alert(
            'Could not load Google auth state. See console for details.'
          );
        }
      }
    });

    // Add the command to the command palette
    const category = 'Extension Examples';
    palette.addItem({
      command,
      category,
      args: { origin: 'from the palette' }
    });
  }
};

export default extension;
