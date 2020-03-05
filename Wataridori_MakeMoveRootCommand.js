/******************************************************************************/
//
// Wataridori_MakeMoveRootCommand.js
//
/******************************************************************************/
//プラグインの説明
//「移動ルート簡易記述関数プラグイン」
//
//更新履歴(ver1.0)
//
//2019_11_23   ver1.0リリース
//
/******************************************************************************/
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php
//
//Copyright(c) 渡り鳥の楽園
/******************************************************************************/

/*:
* @plugindesc 「移動ルート簡易記述関数プラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
*
* @help
* 説明：
* 本プラグインは移動ルートを簡易に記述できる関数を提供します。
* イベントの移動ルートを指定する際、コマンドを一つずつ設定する必要がなくなり、
* 移動先の座標を用いてスクリプトで一行で記述可能となります。
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

var p_parameters         = PluginManager.parameters("Wataridori_MakeMoveRootCommand");

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
// Game_Interpreter
//
/******************************************************************************/

Game_Interpreter.prototype.makeCommandFanc = function(code, indent, parameters) {
	var command = new Object();
	command['code']       = code;
	command['indent']     = indent;
	command['parameters'] = parameters;
	return command;
};

/******************************************************************************/
//
// Game_Character
//
/******************************************************************************/

Game_Character.prototype.makeMoveCommandFanc = function(code, indent, parameters) {
	return Game_Interpreter.prototype.makeCommandFanc.call(this, code, indent, parameters);
};

Game_Character.prototype.makeMoveRoute = function(root) {
	var _root = root;	// [[12, 4, 3], [44, 5]]等の配列

	var up    = this.makeMoveCommandFanc(Game_Character.ROUTE_MOVE_UP,    null, null);
	var down  = this.makeMoveCommandFanc(Game_Character.ROUTE_MOVE_DOWN,  null, null);
	var right = this.makeMoveCommandFanc(Game_Character.ROUTE_MOVE_RIGHT, null, null);
	var left  = this.makeMoveCommandFanc(Game_Character.ROUTE_MOVE_LEFT,  null, null);

	var x = [this.x];
	var y = [this.y];

	// 移動ルートを生成するスクリプトを削除
	var count = this._moveRouteIndex;
	this._moveRoute.list.splice(count, 1);
    this._moveRouteIndex--;

	// 設定したコマンドが正しいか確認
	for(var k=0;k<_root.length;k++){
		if(!Array.isArray(_root[k])){
			console.log('移動コマンド生成関数の引数が不正です。移動先の地点を配列で設定してください。');
			console.log(_root[k]);
			return;
		}

		if(_root[k].length != 2 && _root[k].length != 3){
			console.log('移動コマンド生成関数の引数が不正です。配列の要素数はx,y地点の２つ、速度を含める場合は３つに設定してください。');
			var log = '';
			for(var l=0;l<_root[k].length;l++){
				log += _root[k][l];
				if(l+1<_root[k].length){
					log += ', ';
				}
			}
			console.log('[' + log + ']');
			return;
		}
		if(isNaN(_root[k][0]) || isNaN(_root[k][1])){
			console.log('移動コマンド生成関数の引数が不正です。引数には数字を設定してください。');
			console.log('[' + _root[k][0] + ', ' + _root[k][1] + ']');
			return;
		}
		if(_root[k][0] > $dataMap.width - 1 || _root[k][0] < 0 || _root[k][1] > $dataMap.height - 1 || _root[k][1] < 0){
			console.log('移動コマンド生成関数の引数が不正です。引数にはマップ内の地点を設定してください。');
			console.log('[' + _root[k][0] + ', ' + _root[k][1] + ']');
			return;
		}

		x.push(Math.floor(_root[k][0]));
		y.push(Math.floor(_root[k][1]));
	}

	for(var i=0;i<_root.length;i++){
		if(_root[i].length == 3){
			// 移動速度指定がある場合、速度変更コマンド追加
			var speedCommand = this.makeMoveCommandFanc(Game_Character.ROUTE_CHANGE_SPEED,  null, [_root[i][2]]);
			this._moveRoute.list.splice(count, 0, speedCommand);
			count++;
		}

		// X軸の移動コマンド追加
		if(x[i] -x[i+1] != 0){
			if(x[i] -x[i+1] < 0){
				for(var j=0;j<Math.abs(x[i] -x[i+1]);j++){
					this._moveRoute.list.splice(count, 0, right);
					count++;
				}
			}
			else{
				for(var j=0;j<Math.abs(x[i] -x[i+1]);j++){
					this._moveRoute.list.splice(count, 0, left);
					count++;
				}
			}
		}

		// Y軸の移動コマンド追加
		if(y[i] -y[i+1] != 0){
			if(y[i] -y[i+1] < 0){
				for(var j=0;j<Math.abs(y[i] -y[i+1]);j++){
					this._moveRoute.list.splice(count, 0, down);
					count++;
				}
			}
			else{
				for(var j=0;j<Math.abs(y[i] -y[i+1]);j++){
					this._moveRoute.list.splice(count, 0, up);
					count++;
				}
			}
		}
	}
};

})();
