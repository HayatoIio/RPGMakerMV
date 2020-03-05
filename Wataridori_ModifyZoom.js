/******************************************************************************/
//
// Wataridori_ModifyZoom.js
//
/******************************************************************************/
//プラグインの説明
//「ズーム機能改善プラグイン」
//
//更新履歴(ver1.0)
//
//2019_12_10   ver1.0リリース
//
/******************************************************************************/
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php
//
//Copyright(c) 渡り鳥の楽園
/******************************************************************************/

/*:
* @plugindesc 「ズーム機能改善プラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
* 
* @param use_ModifyTouchInput
* @desc ズーム時にタッチ位置がずれる問題を修正します。
* @default true
* @type boolean
* 
* @param use_FixedPictureMagnification
* @desc 表示されてるピクチャの倍率を固定し、ズームの影響から除外します。
* @default true
* @type boolean
* 
* @help
* 説明：
* ズーム使用時の挙動を改善します。ズーム使用時にタッチ位置がずれる問題の修正および
* ピクチャが同時にズームされてしまう問題を修正します。
* どちらかのみ個別に適用することも可能です。プラグインパラメータで設定してください。
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

var p_parameters                = PluginManager.parameters("Wataridori_ModifyZoom");
var p_modifyTouchInput          = p_parameters.use_ModifyTouchInput          == 'true';
var p_fixedPictureMagnification = p_parameters.use_FixedPictureMagnification == 'true';

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
// ズーム時のタッチ位置修正
//
/******************************************************************************/

var _Game_Map_prototype_canvasToMapX = Game_Map.prototype.canvasToMapX;
Game_Map.prototype.canvasToMapX = function(x) {
	if(p_modifyTouchInput){
		var scale = $gameScreen.zoomScale();
	    var tileWidth = this.tileWidth()*scale;
	    var originX = this._displayX * tileWidth + ($gameScreen.zoomX()*(scale-1));
	    var mapX = Math.floor((originX + x) / tileWidth);
	    return this.roundX(mapX);
	}
	else{
		return _Game_Map_prototype_canvasToMapX.call(this, x);
	}
};

var _Game_Map_prototype_canvasToMapY = Game_Map.prototype.canvasToMapY;
Game_Map.prototype.canvasToMapY = function(y) {
	if(p_modifyTouchInput){
		var scale = $gameScreen.zoomScale();
	    var tileHeight = this.tileHeight()*scale;
		var originY = this._displayY * tileHeight + ($gameScreen.zoomY()*(scale-1));
	    var mapY = Math.floor((originY + y) / tileHeight);
	    return this.roundY(mapY);
	}
	else{
		return _Game_Map_prototype_canvasToMapY.call(this, y);
	}
};

/******************************************************************************/
//
// ズーム時のピクチャ倍率固定
//
/******************************************************************************/

var _parent_updateScale = Sprite_Picture.prototype.updateScale;
Sprite_Picture.prototype.updateScale = function() {
	_parent_updateScale.call(this);
	if(p_fixedPictureMagnification){
		var picture = this.picture();
		this.scale.x = (1 / $gameScreen.zoomScale()) * (picture.scaleX() / 100);
		this.scale.y = (1 / $gameScreen.zoomScale()) * (picture.scaleY() / 100);
	}
};

var _parent_updatePosition = Sprite_Picture.prototype.updatePosition;
Sprite_Picture.prototype.updatePosition = function() {
	_parent_updatePosition.call(this);
	if(p_fixedPictureMagnification){
		var dp_getVisiblePos = function () {
			var scale = $gameScreen.zoomScale();
			return new Point(
				Math.round($gameScreen.zoomX() * (scale - 1)),
				Math.round($gameScreen.zoomY() * (scale - 1))
			);
		};
		var picture = this.picture();
		var map_s = dp_getVisiblePos();
		this.x = (picture.x() + map_s.x) * (1 / $gameScreen.zoomScale());
		this.y = (picture.y() + map_s.y) * (1 / $gameScreen.zoomScale());
	}
};

})();
