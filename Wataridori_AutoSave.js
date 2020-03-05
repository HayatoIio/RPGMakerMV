/******************************************************************************/
//
// Wataridori_AutoSave.js
//
/******************************************************************************/
//プラグインの説明
//「オートセーブプラグイン」
//
//更新履歴(ver1.0)
//
//2019_12_08   ver1.0リリース
//
/******************************************************************************/
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php
//
//Copyright(c) 渡り鳥の楽園
/******************************************************************************/

/*:
* @plugindesc 「オートセーブプラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
*
* @param autoSaveNumber
* @desc セーブIDを指定しない場合のオートセーブ先のセーブデータのID
* @default 20
* @type Number
* 
* @param show_Console
* @desc オートセーブに失敗した場合、コンソールに情報を表示させます。
* @default true
* @type boolean
* 
* @help
* 説明：
* 本プラグインはオートセーブを提供します。
* プラグインコマンドの引数にセーブデータの番号を設定することで、指定されたセーブデータにセーブを実行します。
* 何も指定しない場合、いま現在のセーブデータにセーブを実行します。
* セーブデータIdの数字を引数に下記関数からも実行可能です。
* $gameSystem.autoSave(savefileId);
* 
* Deny_AutoSaveのプラグインコマンドを実行することで、オートセーブの実行を不可能にできます。
* 次にAllow_AutoSaveのプラグインコマンドを実行するまでオートセーブの実行を拒否し続けます。
* 
* プラグインコマンド：AutoSave
* 　最新アクセスのセーブデータにセーブを実行します。
* 
* プラグインコマンド：AutoSave Number
* 　Numberで指定された数字のセーブデータにセーブを実行します。
* 　有効なセーブデータID以外（0を除く）を指定すると、プラグインパラメータで設定されているセーブデータにセーブを実行します。
* 
* プラグインコマンド：Allow_AutoSave
* 　オートセーブの実行を許可状態します。
* 
* プラグインコマンド：Deny_AutoSave
* 　オートセーブの実行を拒否状態にします。拒否状態ではプラグインコマンドでオートセーブを実行しても実施されません。
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

var p_parameters         = PluginManager.parameters("Wataridori_AutoSave");
var p_autoSaveNumber     = Number(p_parameters.autoSaveNumber)         || 20;
var p_show_Console       = p_parameters.show_Console == 'true';

/******************************************************************************/
//
// PluginCommand
//
/******************************************************************************/

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if(command == 'AutoSave'){
		$gameSystem.autoSave(args[0]);
	}
	if(command == 'Allow_AutoSave'){
		$gameSystem.setAutoSaveStatement(true);
	}
	if(command == 'Deny_AutoSave'){
		$gameSystem.setAutoSaveStatement(false);
	}
};

/******************************************************************************/
//
// Game_System
//
/******************************************************************************/

var _Game_System_prototype_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_Game_System_prototype_initialize.call(this);
	this._autoSaveStatement = true;
};

Game_System.prototype.getAutoSaveStatement = function() {
	return this._autoSaveStatement;
};

Game_System.prototype.setAutoSaveStatement = function(bool) {
	this._autoSaveStatement = !!bool;
};

Game_System.prototype.autoSave = function(saveFileIdString) {
	if(this.getAutoSaveStatement()){
		this.onBeforeSave();
		DataManager.autoSave(saveFileIdString);
	}
	else{
	if(p_show_Console){
		console.log('オートセーブの許可状態：'+this.getAutoSaveStatement()+' （true:実行可能です。false:実行できません。オートセーブを実行可能にするためにはAllow_AutoSaveをプラグインコマンドで実行してください）')
	}

	}
};

/******************************************************************************/
//
// DataManager
//
/******************************************************************************/

DataManager.getAutoSavefileId = function() {
	return p_autoSaveNumber;
};

DataManager.autoSave = function(saveFileId) {

	// オートセーブを実行するセーブデータIDの取得
	var _saveFileId = function(id) {
		if(typeof id === 'undefined'){
			// 最後にアクセスしたセーブデータのID
			return this.lastAccessedSavefileId();
		}
		else if(!isNaN(Number(id))									// idが数字か判定
				 && (Number(id) > 0)								// idが0以上の数か判定
			 	 && (this.maxSavefiles() >= Number(id))		// idがセーブできる最大個数以下か判定
		){
			// 念のため指定された数字から小数点を切り捨てたId
			return Math.floor(Number(id));
		}
		else if(id == 'auto'){
			// プラグインパラメータで設定したId
			return this.getAutoSavefileId();
		}
		else{
			// 不正な値の場合は、プラグインパラメータで設定したId
			console.log('不正なセーブデータIDです。');
			return this.getAutoSavefileId();
		}
	}.bind(this)(saveFileId);

	// セーブ実行
    if (DataManager.saveGame(_saveFileId)) {
		StorageManager.cleanBackup(_saveFileId);
		console.log('セーブに成功しました。セーブデータID:'+_saveFileId);
		return true;
    }

	// オートセーブに失敗した場合に状態を表示
	if(p_show_Console){
		console.log('オートセーブに失敗しました。');
		console.log('指定したセーブデータのID:'+saveFileId);
		console.log('プログラム内で変換後のID:'+_saveFileId);
	}

	return false;
};


})();
