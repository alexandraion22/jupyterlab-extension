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
            execute: (args) => {
                const username = PageConfig.getOption('user') || 'an unknown user';
                const message = `jlab-examples:main-menu has been called ${args['origin']} by ${username}.`;
                console.log(message);
                window.alert(message);
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
//# sourceMappingURL=index.js.map