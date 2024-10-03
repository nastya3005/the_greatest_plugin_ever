// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Set Timer" is now active!');

	let remainingTime = 0;
	let interval = null;

	const timerProvider = new TimerProvider(remainingTime);
	vscode.window.registerTreeDataProvider('breakTimerView', timerProvider);

	const startTimerCommand = vscode.commands.registerCommand('laba3-plugin.start', async () => {
        if (!interval) {  // Запускаем только если таймер не активен
            // Окно для ввода времени в минутах
            const input = await vscode.window.showInputBox({
                prompt: 'Enter the time in minutes',
                validateInput: (value) => {
                    const number = parseInt(value, 10);
                    if (isNaN(number) || number <= 0) {
                        return 'Please enter a valid number greater than 0';
                    }
                    return null;
                }
            });

            if (input) {
                const minutes = parseInt(input, 10);
                remainingTime = minutes * 60;  // Устанавливаем время в секундах

                interval = setInterval(() => {
                    if (remainingTime > 0) {
                        remainingTime--;
                        timerProvider.updateTimer(remainingTime);
                    } else {
                        vscode.window.showInformationMessage('Time to take a break!');
                        clearInterval(interval);
                        interval = null;
                    }
                }, 1000);
            }
        }
    });

    // Команда для остановки таймера
    const stopTimerCommand = vscode.commands.registerCommand('laba3-plugin.stop', () => {
        if (interval) {
            clearInterval(interval);
            interval = null;
            vscode.window.showInformationMessage('Timer stopped');
        }
    });

    // Команда для сброса таймера
    const resetTimerCommand = vscode.commands.registerCommand('laba3-plugin.reset', () => {
        remainingTime = 0; // Сбрасываем таймер
        timerProvider.updateTimer(remainingTime);
        vscode.window.showInformationMessage('Timer reset');
    });

    // Регистрируем команды
    context.subscriptions.push(startTimerCommand, stopTimerCommand, resetTimerCommand);
}

class TimerProvider {
    constructor(initialTime) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.remainingTime = initialTime;
    }

    // Обновляем данные таймера
    updateTimer(time) {
        this.remainingTime = time;
        this._onDidChangeTreeData.fire(); // Обновляем TreeView
    }

    // Метод для получения текущего времени в формате mm:ss
    getFormattedTime() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    getTreeItem() {
        return new vscode.TreeItem(`Remaining Time: ${this.getFormattedTime()}`);
    }

    getChildren() {
        return [this.getTreeItem()];
    }
}

// Деактивация расширения
function deactivate() {}

module.exports = {
    activate,
    deactivate
};