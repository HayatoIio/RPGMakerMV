/******************************************************************************/
//
// Wataridori_ClosureCompiler.js
//
/******************************************************************************/
//プラグインの説明
//「ソースコード難読化プラグイン」
//
//更新履歴(ver1.0)
//
//2020_1_11   ver1.0リリース
//
/******************************************************************************/
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php
//
//Copyright(c) 渡り鳥の楽園
/******************************************************************************/

/*:
* @plugindesc 「ソースコード難読化プラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
* 
* @param output_dirName
* @desc 難読化されたソースコードを出力するフォルダの名称を設定可能です。
* @default CompiledPlugins
* 
* @param compilation_level
* @desc 難読化のレベルを設定可能です。
* @default WHITESPACE_ONLY
* @type select
* @option WHITESPACE_ONLY
* @option SIMPLE_OPTIMIZATIONS
* 
* @param ExcludeFiles
* @desc 難読化から除外するpluginsフォルダ内のファイル名を設定可能です。ファイル名は .js まで含めてください。
* @default
* @type String[]
* 
* @help
* 説明：
* ClosureCompilerによるソースコードの難読化を提供します。pluginsフォルダ内のファイルを全て難読化しますが、
* プラグインパラメータにて除外するファイルを設定可能です。
* 
* 難読化には３段階のレベルがあります。
* WHITE_SPACE_ONLY       :コメント、改行、不要なスペース、タブなどその他の空白だけを除去します。
* SIMPLE_OPTIMIZATIONS   :コメントと空白の削除に加え、ローカル変数と関数パラメータの名称短縮を含む、式と関数の最適化を実施します。
* ADVANCED_OPTIMIZATIONS :本プラグインではサポート対象外です。
* 
* プラグインコマンド：なし
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

var getParamString = function(paramNames) {
	if(p_parameters[paramNames] == '') return [];
	var args = JSON.parse(p_parameters[paramNames]);
    for (var i = 0; i < args.length; i++) {
        args[i] = args[i].trim();
    }
    return args;
};

var p_parameters                = PluginManager.parameters("Wataridori_ClosureCompiler");
var p_output_dirName            = p_parameters.output_dirName || 'CompiledPlugins';
var p_compilation_level         = p_parameters.compilation_level;
var p_ExcludeFiles              = getParamString('ExcludeFiles');

/******************************************************************************/
//
// PluginCommand
//
/******************************************************************************/

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if(command == 'ClosureCompiler'){
		if(Utils.isOptionValid('test')){
			result = window.confirm('ClosureCompilerによるソースコード難読化を実行しますか？');
			if(result){
				alert('ソースコードの量によっては、時間がかかる場合があります。必ず難読化されたファイルが全て生成されたことを確認してからゲームを終了してください。');
				StorageManager.makeOutputDir();

				var fs = require('fs');
				var path = require('path');
				var base = path.dirname(process.mainModule.filename);
				var dir = 'js/plugins';
	
				var files = fs.readdirSync(path.join(base, dir));
				for(var i=0;i<files.length;i++){
					if(files[i].endsWith('.js') && !p_ExcludeFiles.includes(files[i])){
					    var xhr = new XMLHttpRequest();
					    var url = 'js/plugins/' + files[i];
					    xhr.open('GET', url, false);
					    xhr.overrideMimeType('text/plain');
					    xhr.send();
						if (xhr.status < 400) {
							//通信成功
							sendClosureCompiler(files[i], xhr.responseText);
						} else {
							//サーバー側エラー応答
							console.warn('ソースコードの難読化に失敗しました：' + files[i]);
						}
					}
				}
			}
		}
		else{
			console.error('テストプレイ以外ではソースコード難読化は使用できません。');
		}
	}
};

/******************************************************************************/
//
// XMLHttpRequest
//
/******************************************************************************/

function sendClosureCompiler(fileName, code) {
	var js_code           = 'js_code=' + encodeURIComponent(code);
	var output_info       = '&output_info=compiled_code';
	var output_format     = '&output_format=text';
	var compilation_level = '&compilation_level='+p_compilation_level;
	var params            = js_code+output_info+output_format+compilation_level;
	var xhr = new XMLHttpRequest();
	var url = 'https://closure-compiler.appspot.com/compile';
	xhr.open('POST', url, false);
    xhr.overrideMimeType('text/plain');
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.ontimeout = function(e){
		//タイムアウト
		console.warn('ClosureCompilerとの通信がタイムアウトしました。');
	};
	xhr.onabort = function(e){
		//通信中止
		console.warn('ClosureCompilerとの通信が中止されました。');
	};
	xhr.onerror = function() {
		//なんやかんやエラー
		console.warn('ClosureCompilerとの通信でエラーが発生しました。');
	};
	//送信
	xhr.send(params);

	if (xhr.status < 400) {
		//通信成功
		console.log(xhr.responseText);
		StorageManager.saveCompiledData(fileName, xhr.responseText);
	} else {
		//サーバー側エラー応答
		console.warn('ClosureCompilerとの通信でエラーが発生しました。');
	}
};

/******************************************************************************/
//
// XMLHttpRequest
//
/******************************************************************************/

// 出力フォルダ作成
StorageManager.makeOutputDir = function() {
	var fs = require('fs');
	var path = require('path');
	var dir = 'js/plugins/'+p_output_dirName;
	var base = path.dirname(process.mainModule.filename);
	try{
		fs.statSync(path.join(base, dir));
	}catch(e){
		if(e.code === 'ENOENT') {
			// フォルダが存在しない場合は作成
			fs.mkdirSync(path.join(base, dir));
		}
		else{
			console.error(e);
		}
	}
};

// 難読化済みのファイルを保存
StorageManager.saveCompiledData = function(fileName, code) {
	try{
		var fs   = require('fs');
		var path = require('path');
		var base = path.dirname(process.mainModule.filename);
		var path_compiledCode = path.join(base, 'js/plugins/'+p_output_dirName + path.sep + fileName);
		fs.writeFileSync(path_compiledCode, code);
	}
	catch(e){
		console.error(e);
	}
};

})();
