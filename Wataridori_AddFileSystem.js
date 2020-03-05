/******************************************************************************/
//
// Wataridori_AddFileSystem.js
//
/******************************************************************************/
//プラグインの説明
//「修正パッチ追加プラグイン」
//
//更新履歴(ver1.0)
//
//2019_11_12   ver1.0  リリース
//2019_12_12   ver1.01 修正パッチを格納するフォルダ名を変更可能にしました。
//                     出力するログファイルのファイル名を変更可能にしました。
//                     タイトルシーンにおける修正パッチを取り込むコマンドの名称を変更可能にしました。
//                     プラグインコマンドをADDからAPPLY_PATCHに変更しました。ADDも使用可能です。
//
/******************************************************************************/
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php
//
//Copyright(c) 渡り鳥の楽園
/******************************************************************************/

/*:
* @plugindesc 「修正パッチ追加プラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
*
* @param name_folder
* @desc 修正パッチを格納するたフォルダの名称を変更可能です。
* @default patch
* 
* @param partition_string
* @desc フォルダ名を区切る際に使用する文字です。必ず半角英数字（ / . \ 以外）にしてください。日本語は不可です。
* @default -
*
* @param name_log_text
* @desc 出力するログファイルの名称（拡張子なし）を変更可能です。
* @default log
* @param name_command
* @desc タイトルシーンにて、修正パッチを取り込むコマンドの名称を変更可能です。
* @default APPLY PATCH
* 
* @param make_log_text
* @desc ONの場合は、修正パッチフォルダ内に取り込みに成功したデータを記載したログファイルを出力します。
* @default true
* @type boolean
* 
* @param make_title_command
* @desc ONの場合は、タイトルシーンにて修正パッチ取り込みコマンドを追加します。
* @default true
* @type boolean
* 
* @param shutdown
* @desc ONの場合は、タイトルシーンにて修正パッチ取り込み後、自動的にシャットダウンを実施します。
* @default true
* @type boolean
*
* @help
* 説明：
* アップデートファイル（修正パッチ）をゲームフォルダに取り込むためのプラグインです。
* このプラグインを利用すると、制作者側はアップデートファイルのみを配れば問題ありません。
* ユーザー側はaddファイルにアップデートファイルをコピーしてタイトル画面でコマンドを選択すれば良く、
* 非常に簡単に作品のアップデートが可能となります。
*
* 取り込める拡張子は以下の通りです。
* .js .json .rpgmvp .png .jpg .rpgmvo .ogg .m4a .woff .ttf .otf .eot
*
* 指定の場所に名前がaddのフォルダを作成してください。
* Windows　Game.exeと同じ階層
* Mac    　Game.appと同じ階層
* テストプレイの場合はゲームデータがあるフォルダ内に作成してください。
*
* データを取り込む際にフォルダの指定が可能です。
* 取り込みたいファイルの名前を、ハイフン（-）を用いてフォルダ名で区切ってください。
* 
* 例：効果音（Absorb1.rpgmvo）をseフォルダに格納する場合
* 　　ファイル名をse-Absorb1.rpgmvoに変更してください。
* 
* 例：表情画像（Actor1.rpgmvp）をfacesフォルダに格納する場合
* 　　ファイル名をfaces-Actor1.rpgmvpに変更してください。
* 
* 修正パッチの適用後は必ずユーザーに再起動させてください。
* 再起動をしないと修正パッチが反映されません。
* 
* プラグインコマンド：APPLY_PATCH
* 修正パッチの取り込みを実施します。
*
* スクリプトで使用する場合：StorageManager.addFile();
* 修正パッチの取り込みを実施します。一つでも成功ならtrue、全部失敗ならfalseを返します。
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

var p_parameters         = PluginManager.parameters("Wataridori_AddFileSystem");
var p_make_log_text      = p_parameters.make_log_text      == 'true';
var p_make_title_command = p_parameters.make_title_command == 'true';
var p_shutdown           = p_parameters.shutdown           == 'true';
var p_partition_string   = p_parameters.partition_string   || '_';

var p_name_folder        = p_parameters.name_folder        || 'patch';
var p_name_log_text      = p_parameters.name_log_text      || 'log';
var p_name_command       = p_parameters.name_command       || 'APPLY PATCH';

/******************************************************************************/
//
// PluginCommand
//
/******************************************************************************/

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if(command == 'ADD' || command == 'APPLY_PATCH'){
		StorageManager.addFile();
	}
};

/******************************************************************************/
//
// Scene_Title
//
/******************************************************************************/

var Scene_Title_prototype_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
	Scene_Title_prototype_createCommandWindow.call(this);
	if(p_make_title_command){
	    this._commandWindow.setHandler('add',  this.commandAdd.bind(this));
	}
};

Scene_Title.prototype.commandAdd = function() {
	this._commandWindow.activate();
	if(StorageManager.addFile()){
		if(p_shutdown){
			this.commandShutdown();
		}
	}
};

Scene_Title.prototype.commandShutdown = function() {
    this._commandWindow.close();
    this.fadeOutAll();
	SceneManager.exit();
};

/******************************************************************************/
//
// Window_TitleCommand
//
/******************************************************************************/

var Window_TitleCommand_prototype_initialize = Window_TitleCommand.prototype.initialize;
Window_TitleCommand.prototype.initialize = function() {
	Window_TitleCommand_prototype_initialize.call(this);
	this._count = 0;
	this._commandFlag = false;
};

Window_TitleCommand.prototype.update = function() {
	Window_Command.prototype.update.call(this);
	this._count++;
	if(p_make_title_command){
		if(this._count > 60){
			if(this.checkAddCommandEnable() != this._commandFlag){
				this.refresh();
			}
			this._count = 0;
		}
	}
};

var Window_TitleCommand_prototype_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
	Window_TitleCommand_prototype_makeCommandList.call(this);
	if(p_make_title_command){
		this._commandFlag = this.checkAddCommandEnable();
		this.addCommand(p_name_command, 'add', this._commandFlag);
	}
};

Window_TitleCommand.prototype.checkAddCommandEnable = function() {
	// addフォルダ内にデータが有る場合のみ有効にする。
    var path = require('path');
	var fs   = require('fs');
    var base = path.dirname(process.mainModule.filename);

	var win  = path.join(base, '../'+p_name_folder+'/');
	var mac  = path.join(base, '../../../../'+p_name_folder+'/');
	var test = path.join(base, p_name_folder+'/');
	var filelist;

	try{
		if(Utils.isOptionValid('test')){
			// テストプレイの場合
			filelist = fs.readdirSync(test);
			return filelist.length != 0 && this.isNotLogFile(test);
		}
		else if(fs.existsSync(win)){
			filelist = fs.readdirSync(win);
			return filelist.length != 0 && this.isNotLogFile(win);
		}
		else if(fs.existsSync(mac)){
			filelist = fs.readdirSync(mac);
			return filelist.length != 0 && this.isNotLogFile(mac);
		}
		else{
			return false;
		}
	}
	catch(e){
		console.error(e);
		return false;
	}
};

Window_TitleCommand.prototype.isNotLogFile = function(path) {
	try{
		var fs   = require('fs');
		var filelist = fs.readdirSync(path);
		return !(filelist.length == 1 && filelist[0] == p_name_log_text + '.txt');
	}catch(e){
		console.error(e);
		return false;
	}
};

/******************************************************************************/
//
// StorageManager
//
/******************************************************************************/

StorageManager.addFile = function() {
    var path = require('path');
	var fs = require('fs');
    var base = path.dirname(process.mainModule.filename);

	var win = path.join(base, '../'+p_name_folder+'/');
	var mac = path.join(base, '../../../../'+p_name_folder+'/');
	var test= path.join(base, p_name_folder+'/');

	try{
		if(Utils.isOptionValid('test')){
			return StorageManager.addFileCheck(test);
		}
		else if(fs.existsSync(win)){
			return StorageManager.addFileCheck(win);
		}
		else if(fs.existsSync(mac)){
			return StorageManager.addFileCheck(mac);
		}
		else{
			return false;
		}
	}catch(e){
		console.error(e);
		return false;
	}
};

StorageManager.addFileCheck = function(pathAdd) {

	var fs = require('fs');
	var path = require('path');
	var base = path.dirname(process.mainModule.filename);

	var succes = false;

	// 取り込むファイルの拡張しとパスを設定
	// ファイルの種類を増やしたい場合はここで拡張してください。
	var item ={
		'.js'    : 'js/plugins/',
		'.json'  : 'data/',
		'.rpgmvp': 'img/',
		'.png'   : 'img/',
		'.jpg'   : 'img/',
		'.rpgmvo': 'audio/',
		'.ogg'   : 'audio/',
		'.m4a'   : 'audio/',
		'.woff'  : 'fonts/',
		'.ttf'   : 'fonts/',
		'.otf'   : 'fonts/',
		'.eot'   : 'fonts/'
	};

	try{
		var filelist = fs.readdirSync(pathAdd);
		var InputList = [];
		for(var i=0;i<filelist.length;i++){
			var keys = Object.keys(item);
			for(var j=0;keys.length>j;j++){

				try{
					fs.statSync(path.join(base, item[keys[j]]));
				}catch(e){
					if(e.code === 'ENOENT') {
						// フォルダが存在しない場合は作成
		 				fs.mkdirSync(path.join(base, item[keys[j]]));
					}
					else{
						console.error(e);
					}
				}

				if(filelist[i].endsWith(keys[j])){
					var file = fs.readFileSync(path.join(pathAdd, filelist[i]));
					var folder_name = filelist[i].split(p_partition_string);
					var fpath = item[keys[j]];
					for(var k=0;k<folder_name.length;k++){
						fpath += folder_name[k];
						if(!folder_name[k].endsWith(keys[j])){
							try{
								fs.statSync(path.join(base, fpath));
							}catch(e){
								if(e.code === 'ENOENT') {
									// フォルダが存在しない場合は作成
		 							fs.mkdirSync(path.join(base, fpath));
								}
								else{
									console.error(e);
								}
							}
							fpath += '/';
						}
					}
					fs.writeFileSync(path.join(base, fpath), file);
					InputList.push(filelist[i]);
					fs.unlinkSync(path.join(pathAdd, filelist[i]));
					succes = true;
				}
			}
		}

		// addフォルダ内に出力するログを作成
		if(p_make_log_text){
			try{
				var test = "以下のファイルのインポートに成功しました。"
				fs.writeFileSync(path.join(pathAdd, p_name_log_text+'.txt'), test+"\n");
				for(var l=0;l<InputList.length;l++){
					fs.appendFileSync(path.join(pathAdd, p_name_log_text+'.txt'), InputList[l]+"\n");
				}
			}catch(e){
				console.error(e);
			}
		}

		if(succes){
			// 効果音を変更する場合はここを変更してください。
			SoundManager.playRecovery();
			alert("ファイルの取り込みに成功しました。修正パッチの適用には再起動が必要です。");
		}
		else{
			SoundManager.playBuzzer();
			alert("ファイルの取り込みに失敗しました。修正パッチの適用の方法に問題がある可能性があります。");
		}
		return succes;

	}catch(e){
		alert("ファイルの取り込みの際にエラーが発生しました。");
		console.error(e);
		return false;
	}
};

})();
