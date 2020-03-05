/******************************************************************************/
//
// Wataridori_ChangeSvaeFilePath.js
//
/******************************************************************************/
//プラグインの説明
//「セーブデータ保存場所変更プラグイン」
//
//更新履歴(ver1.0)
//
//2019_11_24   ver1.0
//
/******************************************************************************/
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php
//
//Copyright(c) 渡り鳥の楽園
/******************************************************************************/
/*:
* @plugindesc 「セーブデータ保存場所変更プラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
*
* @help
* 説明：
* セーブデータの保存場所をゲームの実行ファイルと同じ場所に変更します。
* 必ず事前準備としてセーブファイルのフォルダを規定の場所に作成してください。
*
* プラグインコマンド：
* なし
*
* 注意事項：
* 本プラグインの使用によって生じたいかなる損失・損害、トラブルについても
* 一切責任を負いかねます。
*
* 利用規約：
* 無断で改変、再配布が可能で商用、１８禁利用等を問わずにご利用が可能です。
* 改良して頂いた場合、報告して頂けると喜びます。
*
* 「渡り鳥の楽園」飯尾隼人
* Twitter: https://twitter.com/wataridori_raku
* Ci-en  : https://ci-en.dlsite.com/creator/2449
*/

(function() {

/******************************************************************************/
//
// Plugin_Parameters
//
/******************************************************************************/

var p_parameters = PluginManager.parameters("Wataridori_ChangeSvaeFilePath");

/******************************************************************************/
//
// PluginCommand
//
/******************************************************************************/

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);



};

/******************************************************************************/
//
// StorageManager
//
/******************************************************************************/

var StorageManager_localFileDirectoryPath = StorageManager.localFileDirectoryPath;
StorageManager.localFileDirectoryPath = function() {
    var path = require('path');
	var fs = require('fs');
    var base = path.dirname(process.mainModule.filename);

	var win = path.join(base, '../save/');
	var mac = path.join(base, '../../../../save/');
	var test = path.join(base, 'save/');

	try{
		if(Utils.isOptionValid('test')){
			// テストプレイの場合
			return test;
		}
		else if(fs.existsSync(win)){
			// Windows
			return win;
		}
		else if(fs.existsSync(mac)){
			// Mac
			return mac;
		}
		else{
			// それ以外は通常
			return StorageManager_localFileDirectoryPath.call(this);
		}
	}
	catch(e){
		console.error(e);
		return StorageManager_localFileDirectoryPath.call(this);
	}
};

})();
