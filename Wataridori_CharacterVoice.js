/******************************************************************************/
//
// Wataridori_CharacterVoice.js
//
/******************************************************************************/
//プラグインの説明
//「キャラクターボイス実装プラグイン」
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
* @plugindesc 「キャラクターボイス実装プラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
* 
* @param CommandText_WindowOptions
* @desc ウィンドウオプションにおける表示コマンド名を設定します。
* @default CV 音量
* 
* @param CV_StoreFolderName
* @desc CV（キャラクターボイス）のデータがあるフォルダ名を変更できます。
* @default cv
* 
* @param UseToVolume
* @desc ONの場合は、以下で設定する値を各音量（BGM, BGS, ME, SE）の音量としてそのまま設定します。OFFの場合は、百分率として乗算。
* @default true
* @type boolean
* 
* @param BgmVolume_DuringPlayCV
* @desc CV（キャラクターボイス）再生中のBGMの音量（倍率）を設定できます。0に設定した場合は停止します。
* @default 50
* @type Number
* 
* @param BgsVolume_DuringPlayCV
* @desc CV（キャラクターボイス）再生中のBGSの音量（倍率）を設定できます。0に設定した場合は停止します。
* @default 50
* @type Number
* 
* @param MeVolume_DuringPlayCV
* @desc CV（キャラクターボイス）再生中のMEの音量（倍率）を設定できます。0に設定した場合は停止します。
* @default 50
* @type Number
* 
* @param SeVolume_DuringPlayCV
* @desc CV（キャラクターボイス）再生中のSEの音量（倍率）を設定できます。0に設定した場合は停止します。
* @default 50
* @type Number
* 
* @help
* 説明：
* 本プラグインはBGM, BGS, ME, SEとは別にCV（キャラクターボイス）を実装可能です。
* オプション画面にてBGM, BGS, ME, SEと同様に音量設定が可能です。
* audio以下に名称がcvのフォルダを作成し、再生したい音声ファイルを格納できます。
* フォルダ名はプラグインパラメータにて変更可能です。
* 音声の再生、停止、フェードアウトは全てプラグインコマンドからのみ実行可能です。
* CV再生中に聞き取りやすいようにBGM, BGS, ME, SEの音量を一時的に低くすることも可能です。
* 詳細はCi-en記事をご覧ください。
* https://ci-en.dlsite.com/creator/2449/article/145251
* 
* プラグインコマンド：PlayCV FileName Volume Pitch Pan
* プラグインコマンド：PlayCV FileName
* CVを再生します。BGS, BGS, ME, SEとは独立して再生可能で、音量も独立しています。
* FileNameは必ず指定してください。指定がない場合は再生しません。
* Volume, Pitch, Panは省略可能です。省略した場合、Volumeは90, Pitchは100, Panは0となります。
* FileName：再生するファイル名（拡張子なし）を文字列で設定してださい。
* Volume  ：音量を数字で設定してください。
* Pitch   ：音程を数字で設定してください。
* Pan     ：位相を数字で設定してください。
* 
* プラグインコマンド：StopCV
* CVの再生を停止します。
* 
* プラグインコマンド：FadeOutCV Number
* CVの再生をフェードアウトします。フェードアウトする秒数は省略可能です。
* 省略した場合、Numberは1となります。
* Number：フェードアウトする秒数を数字で設定してください。
* 
* プラグインコマンド：DcreaseVolume
* BGM, BGS, ME, SEの音量をプラグインパラメータで設定した音量に低下させます。
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

var p_parameters                 = PluginManager.parameters("Wataridori_CharacterVoice");
var p_commandText_WindowOptions  = p_parameters.CommandText_WindowOptions  || 'CV 音量';
var p_cv_StoreFolderName         = p_parameters.CV_StoreFolderName         || 'cv';
var p_useToVolume                = p_parameters.UseToVolume                == 'true';
var p_bgmVolume_DuringPlayCV     = Number(p_parameters.BgmVolume_DuringPlayCV).clamp(0, 100);
var p_bgsVolume_DuringPlayCV     = Number(p_parameters.BgsVolume_DuringPlayCV).clamp(0, 100);
var p_meVolume_DuringPlayCV      = Number(p_parameters.MeVolume_DuringPlayCV).clamp(0, 100);
var p_seVolume_DuringPlayCV      = Number(p_parameters.SeVolume_DuringPlayCV).clamp(0, 100);

/******************************************************************************/
//
// PluginCommand
//
/******************************************************************************/

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if(command == 'PlayCV'){
		if(args.length == 0){
			console.error('プラグインコマンド「PlayCV」を実行できません。再生するファイル名を設定してください。');
			return;
		}

		var cv    = {};
		cv.name   = args[0];
		cv.volume = isNaN(Number(args[1]))? 90 : Number(args[1]).clamp(0, 100);
		cv.pitch  = isNaN(Number(args[2]))? 100: Number(args[2]).clamp(0, 100);
		cv.pan    = isNaN(Number(args[3]))? 0  : Number(args[3]).clamp(0, 100);
		AudioManager.playCv(cv);
	}
	if(command == 'FadeOutCV'){
		var time = Number(args[0]);
		if(isNaN(time)){
			time = 1;
		}
    	AudioManager.fadeOutCv(time);
	}
	if(command == 'StopCV'){
		AudioManager.stopCv();
	}
	if(command == 'DcreaseVolume'){
		AudioManager.decreaseVolume();
	}
};

/******************************************************************************/
//
// Window_Options
//
/******************************************************************************/

var _Window_Options_prototype_addVolumeOptions = Window_Options.prototype.addVolumeOptions;
Window_Options.prototype.addVolumeOptions = function() {
	_Window_Options_prototype_addVolumeOptions.call(this);
	this.addCommand(p_commandText_WindowOptions, 'cvVolume');
};

/******************************************************************************/
//
// Scene_Base
//
/******************************************************************************/

var _Scene_Base_prototype_fadeOutAll = Scene_Base.prototype.fadeOutAll;
Scene_Base.prototype.fadeOutAll = function() {
    var time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutCv(time);
	_Scene_Base_prototype_fadeOutAll.call(this);
};

/******************************************************************************/
//
// Scene_Title
//
/******************************************************************************/

var _Scene_Title_prototype_playTitleMusic = Scene_Title.prototype.playTitleMusic;
Scene_Title.prototype.playTitleMusic = function() {
	_Scene_Title_prototype_playTitleMusic.call(this);
    AudioManager.stopCv();
};

/******************************************************************************/
//
// Scene_Map
//
/******************************************************************************/

var _Scene_Map_prototype_stopAudioOnBattleStart = Scene_Map.prototype.stopAudioOnBattleStart;
Scene_Map.prototype.stopAudioOnBattleStart = function() {
	_Scene_Map_prototype_stopAudioOnBattleStart.call(this);
    AudioManager.stopCv();
};

/******************************************************************************/
//
// Scene_Battle
//
/******************************************************************************/

var _Scene_Battle_prototype_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
	_Scene_Battle_prototype_terminate.call(this);
    AudioManager.stopCv();
};

/******************************************************************************/
//
// ConfigManager
//
/******************************************************************************/

Object.defineProperty(ConfigManager, 'cvVolume', {
    get: function() {
        return AudioManager.cvVolume;
    },
    set: function(value) {
        AudioManager.cvVolume = value;
    },
    configurable: true
});

var ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = ConfigManager_makeData.call(this);
    config.cvVolume = this.cvVolume;
	return config;
};

var ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
	ConfigManager_applyData.call(this, config);
    this.cvVolume = this.readVolume(config, 'cvVolume');
};

/******************************************************************************/
//
// AudioManager
//
/******************************************************************************/

AudioManager._cvVolume             = 100;
AudioManager._cvBuffer             = null;

Object.defineProperty(AudioManager, 'cvVolume', {
    get: function() {
        return this._cvVolume;
    },
    set: function(value) {
        this._cvVolume = value;
    },
    configurable: true
});

AudioManager.decreaseVolume = function() {
        if (this._currentBgm && this._bgmBuffer && this._bgmBuffer.isPlaying()) {
			if(p_bgmVolume_DuringPlayCV == 0){
				this._currentBgm.pos = this._bgmBuffer.seek();
				this._bgmBuffer.stop();
			}
			else{
				this.updateBufferParametersDuringPlayCV.call(this, this._bgmBuffer, p_bgmVolume_DuringPlayCV, this._bgmVolume);
			}
        }
        if (this._currentBgs && this._bgsBuffer && this._bgsBuffer.isPlaying()) {
			if(p_bgsVolume_DuringPlayCV == 0){
				this._currentBgs.pos = this._bgsBuffer.seek();
				this._bgsBuffer.stop();
			}
			else{
				this.updateBufferParametersDuringPlayCV.call(this, this._bgsBuffer, p_bgsVolume_DuringPlayCV, this._bgsVolume);
			}
        }
        if (this._meBuffer && this._meBuffer.isPlaying()) {
			if(p_meVolume_DuringPlayCV == 0){
		        this._meBuffer.stop();
		        this._meBuffer = null;
			}
			else{
				this.updateBufferParametersDuringPlayCV.call(this, this._meBuffer, p_meVolume_DuringPlayCV, this._meVolume);
			}
        }
        if (this._seBuffers && this._seBuffers.filter(function(audio) {
            	return audio.isPlaying();
        	  })
		  ){
			if(p_seVolume_DuringPlayCV == 0){
				this.stopSe();
			}
			else{
				this.updateBufferParametersDuringPlayCV.call(this, this._seBuffers, p_seVolume_DuringPlayCV, this._seVolume);
			}
        }
};

AudioManager.playCv = function(cv) {
    if (cv.name) {
	    this.stopCv();
	    this._cvBuffer = this.createBuffer(p_cv_StoreFolderName, cv.name);
	    this.updateCvParameters(cv);
	    this._cvBuffer.play(false);
	    this._cvBuffer.addStopListener(this.stopCv.bind(this));
    }
};

AudioManager.updateCvParameters = function(cv) {
    this.updateBufferParameters(this._cvBuffer, this._cvVolume, cv);
};

AudioManager.fadeOutCv = function(duration) {
    if (this._cvBuffer) {
        this._cvBuffer.fadeOut(duration);
    }
};

AudioManager.stopCv = function() {
    if (this._cvBuffer) {
        this._cvBuffer.stop();
        this._cvBuffer = null;
	}
};

AudioManager.updateBufferParametersDuringPlayCV = function(buffers, value, configVolume) {
	if(!Array.isArray(buffers)){
		buffers = new Array(buffers);
	}

	for(var i=0;i<buffers.length;i++){
		if(p_useToVolume){
	        buffers[i].volume = value * (buffers[i].volume || 0) / 100;
		}
		else{
	        buffers[i].volume = Math.floor(configVolume * value / 100) * (buffers[i].volume || 0) / 100;
		}
	}
};

var _AudioManager_stopAll = AudioManager.stopAll;
AudioManager.stopAll = function() {
	_AudioManager_stopAll.call(this);
	this.stopCv();
};

var _AudioManager_checkErrors = AudioManager.checkErrors;
AudioManager.checkErrors = function() {
	_AudioManager_checkErrors.call(this);
    this.checkWebAudioError(this._cvBuffer);
};

})();
