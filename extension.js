const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Extension "code-comments" is now active!');

  const addCommentFunc = vscode.commands.registerCommand('extension.addComment', function () {
    addComment(context);
  });

  context.subscriptions.push(addCommentFunc);
}
function addComment(context){
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const position = editor.selection.active; 
      editor.edit(editBuilder => {
        editBuilder.insert(position, '// FIX ME');
      });
    }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};