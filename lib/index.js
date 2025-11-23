import { ICommandPalette } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';
/**
 * Initialization data for the main menu example.
 */
const extension = {
    id: '@jupyterlab-examples/main-menu:plugin',
    description: 'Minimal JupyterLab example adding a menu.',
    autoStart: true,
    requires: [ICommandPalette],
    activate: (app, palette) => {
        const { commands } = app;
        // Add a command
        const command = 'jlab-examples:main-menu';
        commands.addCommand(command, {
            label: 'Execute jlab-examples:main-menu Command',
            caption: 'Execute jlab-examples:main-menu Command',
            execute: async () => {
                var _a, _b, _c, _d;
                const baseUrl = PageConfig.getBaseUrl();
                const requestToken = PageConfig.getToken();
                const headers = {};
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
                    const payload = (await response.json());
                    const messageLines = [
                        `Google account: ${(_a = payload.email) !== null && _a !== void 0 ? _a : 'unknown'}`,
                        `Access token: ${(_b = payload.access_token) !== null && _b !== void 0 ? _b : 'missing'}`,
                        `Refresh token: ${(_c = payload.refresh_token) !== null && _c !== void 0 ? _c : 'missing'}`,
                        `ID token: ${(_d = payload.id_token) !== null && _d !== void 0 ? _d : 'missing'}`
                    ];
                    console.log('Google auth payload:', payload);
                    window.alert(messageLines.join('\n'));
                }
                catch (error) {
                    console.error('Failed to load Google auth state', error);
                    window.alert('Could not load Google auth state. See console for details.');
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
