/******************************************************************************/
//
// Wataridori_GoogleAnalytics.js
//
/******************************************************************************/
//プラグインの説明
//「Googleアナリティクス適用プラグイン」
//
//更新履歴(ver1.0)
//
//2020_2_15   ver1.0リリース
//
/******************************************************************************/
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php
//
//Copyright(c) 渡り鳥の楽園
/******************************************************************************/

/*:
* @plugindesc 「Googleアナリティクス適用プラグイン」
* @author 「渡り鳥の楽園」飯尾隼人
* 
* @param TrackingID
* @desc Googleアナリティクスアカウントを作成し"UA-00000000-1"といった文字列のトラッキングIDを入力します。
* @default UA-00000000-1
*
* @param isAnalyzingMove
* @desc 「場所移動」「ゲームオーバー」「タイトル」「セーブ」による画面遷移時にトラッキングを行います。(ON/OFF)
* @type boolean
* @default true
*
* @param isAnalyzingCommand
* @desc プラグインコマンドで実行されるトラッキング実施を行うか設定します。(ON/OFF)
* @type boolean
* @default true
*
* @param isAnalyzingStartup
* @desc 最初のマップから開始されるトラッキングを起動直後から開始します。タイトルをスキップする際にONにしてください。(ON/OFF)
* @type boolean
* @default true
*
* @param isAddAxes
* @desc 仮想ページタイトルに座標を追加してトラッキング。(ON/OFF)
* (記録例: "主人公の家(8,6)" )
* @type boolean
* @default true
*
* @param isMapNameUrl
* @desc ページトラッキング時の"URL"を、マップIDではなくマップ名を用いる。(ON/OFF)
* @type boolean
* @default false
*
* @param isDisplayPolicy
* @desc タイトルメニューにプライバシーポリシーの項目を追加します。
* 掲載はアナリティクスの利用規約で定められています。(ON/OFF)
* @type boolean
* @default true
*
* @param PolicyName
* @desc タイトルのメニュー項目の名称
* default:プライバシーポリシー
* @default プライバシーポリシー
*
* @param PolicyDetail1
* @desc プライバシーポリシーの内容を入力します(1)。
* @default 当ゲームでは、個人を特定しない形でユーザ情報をGoogleに送信しています。当ゲームはそれらの情報を Google Analytics を使用しゲーム利用状況の把握やゲームの改善、ユーザーの傾向をコンテンツとして紹介するといった用途で利用する可能性があります。本ゲームのユーザーは本ゲームを利用することで、上記方法および目的においてGoogleとゲーム制作者が行うこうしたデータ処理に対して、許可を与えたものとみなします。Googleによる情報収集および利用方法については、Google Analyticsサービス利用規約およびGoogle社プライバシーポリシーによって定められています。
*
* @param PolicyDetail2
* @desc プライバシーポリシーの内容を入力します(2)。
* @default Cookieについて Cookieとは、ゲーム（もしくはGoogleアナリティクスのような第三者サービス）が、ゲームユーザーが利用するデバイスのブラウザに情報を保存し、あとで取り出すことができる符号です。ただしゲーム管理者は、当ゲームで設定するCookieからユーザーの個人情報を把握することはできませんのでご安心ください。なお、ゲームユーザーはブラウザの設定によりCookieの受け取りを拒否することができます。
*
* @param PolicyDetail3
* @desc プライバシーポリシーの内容を入力します(3)。
* @default Googleアナリティクス オプトアウトアドオン https://tools.google.com/dlpage/gaoptout
* 
* @param PolicyBreakSize
* @desc ポリシーの文章を何文字毎で改行するかを入力します。
* default:52
* @type Number
* @default 52
* 
* @param ---Extend---
* @default
* 
* @param PrefixPluginCommand
* @desc プラグインコマンドの接頭辞を変更可能です。
* default:ANALYTICS
* @default ANALYTICS
* 
* @param timeout
* @desc タイムアウトまでの秒数（単位は秒です）
* @default 5000
* @type Number
* 
* @param folderName
* @desc ゲームを識別するための名称（半角英）を設定可能です。
* @default RPGMV
* 
* @param UseDebugMode
* @desc デバックモードの使用を設定可能です。デバックモードを使用した場合、Google Analyticsにおいてヒットの検証が可能です。
* default:OFF
* @type boolean
* @default false
*
* @help Google Analytics を使ってゲームのアクセス解析を行うことができます。
* このプラグインは「BITO_Game_Analytics.js」を参考にローカル環境でも動作が可能なように作成しました。
* 
* [注意] このプラグインは外部接続が制限されている環境下では動作しません。
*
* 場所移動時、タイトルへ戻った時、ゲームオーバー時をページ遷移としてトラッキングします。
* マップIDと座標が仮想URL（マップIDからマップ名へ切替可）、
* (記録例: "/1/8/6" )
* マップ名が仮想ページタイトルとして記録されます（座標表示の有無は変更可）。
* (記録例: "主人公の家(8,6)" ) 
*
* またプラグインコマンドを使って
* 「ページ遷移」、「イベントアクション」を Google Analytics に送信できます。
*
* プラグイン使用の際は、Google Analytics のアカウントを作成し、
* トラッキングIDを取得が必要があります。
* (https://www.google.com/intl/ja_jp/analytics/)
* 
* その際は、Google Analytics サービス利用規約
* (https://www.google.co.jp/analytics/terms/jp.html)
* およびGoogle社プライバシーポリシー
* (https://www.google.com/intl/ja/policies/privacy/)をご覧ください。
* 
* なお、Google Analytics に 1か月に送信されるヒット数が
* アナリティクスの利用規約で定められている上限を超えた場合、
* その超過分のヒット数が処理される保証はありません。
* その場合は、有料サービスにアップグレードする必要があります。
* 
* デバックモードの詳細は「https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits」
* をご覧ください。デバックモードにて送信されたヒットはレポートには表示されず、デバッグにのみ使用されます。
*
* Google Analytics は、Google Inc. の登録商標です。
* 
* プラグインコマンド：
* プラグインパラメータでプラグインコマンドの接頭辞「ANALYTICS」の部分を変更可能です。
* 
* ▼ページ トラッキングの有効化・無効化
* ANALYTICS_MOVE_TURN (ON/OFF)
* 例）ANALYTICS_MOVE_TURN OFF
* 
* ▼プラグインコマンドによるトラッキングの有効化・無効化
* ANALYTICS_CND_TURN (ON/OFF)
* 例）ANALYTICS_CND_TURN OFF
*
* ▼ページ トラッキングを実行
* ANALYTICS_VIEW (ページ名)
* 例）ANALYTICS_VIEW 1年前の回想
* 例）ANALYTICS_VIEW \P[1]の部屋
* 例）ANALYTICS_VIEW
* ※何も指定しない場合は、マップ名を送信されます。
* 
* ▼イベント トラッキングを実行
* ANALYTICS_EVENT (イベントカテゴリ) (イベントアクション) 
* 例）ANALYTICS_EVENT 飛行船 入手 
* 例）ANALYTICS_EVENT 宿泊 店舗名:\V[20]
* もしくは
* ANALYTICS_EVENT (イベントカテゴリ) (イベントアクション) (イベントラベル)
* 例）ANALYTICS_EVENT 宝箱 入手 古びた鍵 
* 例）ANALYTICS_EVENT モンスター 討伐完了 裏ボスA
* もしくは
* ANALYTICS_EVENT (イベントカテゴリ) (イベントアクション) (イベントラベル) (正の整数)
* 例）ANALYTICS_EVENT ゲーム情報 読込時間 オープニング \V[5]
* 例）ANALYTICS_EVENT レベル チェック \N[1] \V[10]
* ※負の整数はサポートされていません。
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
    'use strict';

    var pluginName = 'Wataridori_GoogleAnalytics';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == 'true';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamFloat = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(value) || 0).clamp(min, max);
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //-----------------------------------------------------------------------------
    // プラグインパラメータ 取得
    //-----------------------------------------------------------------------------

    var paramTrackingID          = getParamString(['TrackingID']);
    var paramIsAnalyzingMove     = getParamBoolean(['isAnalyzingMove']);
	var paramIsAnalyzingCommand  = getParamBoolean(['isAnalyzingCommand']);
    var paramIsAnalyzingStartup  = getParamBoolean(['isAnalyzingStartup']);
	var paramIsAddAxes           = getParamBoolean(['isAddAxes']);
	var paramIsMapNameUrl        = getParamBoolean(['isMapNameUrl']);
    var paramIsDisplayPolicy     = getParamBoolean(['isDisplayPolicy']);
    var paramPolicyName          = getParamString(['PolicyName']);
    var paramPolicyDetail1       = getParamString(['PolicyDetail1']);
    var paramPolicyDetail2       = getParamString(['PolicyDetail2']);
    var paramPolicyDetail3       = getParamString(['PolicyDetail3']);
    var paramPolicyBreakSize     = getParamNumber(['PolicyBreakSize']);
    var paramPrefixPluginCommand = getParamString(['PrefixPluginCommand']);
    var paramUseDebugMode        = getParamBoolean(['UseDebugMode']);
    var paramTimeout             = getParamNumber(['timeout']);
    var paramfolderName          = getParamString(['folderName']);
    var Startuped                = paramIsAnalyzingStartup;
    var metaTagPrefix = paramPrefixPluginCommand;

    //-----------------------------------------------------------------------------
    // 環境変数
    //-----------------------------------------------------------------------------
    var onNetwork = document.location.protocol.match(/^http|^https/);

    //-----------------------------------------------------------------------------
    // Measurement Protocol のパラメータ
    //-----------------------------------------------------------------------------
	var payload_data = '';

	var ds = '&ds='+(function() {
				if(onNetwork){
					return 'web';
				}
				else if(Utils.isMobileDevice()){
					return 'app';
				}
				else{
					return 'pc';
				}
			 })();
	var ua = '&ua='+navigator.userAgent;
	var sr = '&sr='+screen.width+'x'+screen.height;
	var vp = '&vp='+window.innerWidth+'x'+window.innerHeight ;
	var ul = '&ul='+navigator.language;
	var payload = ds + ua + sr + vp + ul;

    //-----------------------------------------------------------------------------
    // XMLHttpRequest
    //-----------------------------------------------------------------------------

	if(paramUseDebugMode){
		console.log('---GoogleAnalytics DebugMode---');
	}
	else{
		console.log('---GoogleAnalytics---');
	}

    function sendGoogleAnalytics() {
		if(!paramTrackingID || (paramTrackingID == 'UA-00000000-1')){
			console.error('TrackingIDが設定されていません！！！');
			return;
		}
		var xhr = new XMLHttpRequest();
		var url;
		if(paramUseDebugMode){
			url = 'https://www.google-analytics.com/debug/collect';
		}
		else{
			url = 'https://www.google-analytics.com/collect';
		}
		xhr.open('POST', url);
	    xhr.overrideMimeType('application/json');
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.timeout = paramTimeout*1000;
		xhr.ontimeout = function(e){
			//タイムアウト
			console.warn('GoogleAnalyticsの通信がタイムアウトしました。');
		};
		xhr.onabort = function(e){
			//通信中止
			console.warn('GoogleAnalyticsの通信が中止されました。');
		};
		xhr.onerror = function() {
			//なんやかんやエラー
			console.warn('GoogleAnalyticsの通信でエラーが発生しました。');
		};
		xhr.onload = function() {
			if (xhr.status < 400) {
				//通信成功
				if(paramUseDebugMode){
					console.log('---GoogleAnalytics DebugHit---');
					console.log(xhr.responseText);
				}
			} else {
				//サーバー側エラー応答
				console.warn('GoogleAnalyticsの通信でエラーが発生しました。');
			}
		};
		//送信
		xhr.send(payload_data + payload);
	};

    //-----------------------------------------------------------------------------
    // 一定文字数で改行適用する処理
    //-----------------------------------------------------------------------------
    function insert_br(ist, num) {
		var ists = ist.split('');
		ist = "";
		function getLength(moji) {
			var i,cnt = 0;
			for(i=0; i<moji.length; i++) if (escape(moji.charAt(i)).length >= 4 ) cnt+=2; else cnt++;
			return cnt;
		}
		var count_ist = 0;
		for (var i = 0; i < ists.length; i++) {
			var istAt = ists[i];
			ist += istAt;
			count_ist += getLength(istAt);
			if( count_ist > num ) {
				count_ist = 0;
				ist += "\n";
			}
		}
        return ist;
    }

	//-----------------------------------------------------------------------------
	// uuid 生成
	//-----------------------------------------------------------------------------
	function generateUuid() {
	    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
	    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
	    var chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
	    for (var i = 0, len = chars.length; i < len; i++) {
	        switch (chars[i]) {
	            case "x":
	                chars[i] = Math.floor(Math.random() * 16).toString(16);
	                break;
	            case "y":
	                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
	                break;
	        }
	    }
	    return chars.join("");
	};

	//-----------------------------------------------------------------------------
	// cid 管理
	//-----------------------------------------------------------------------------

	ConfigManager._clientId   = null;

	Object.defineProperty(ConfigManager, 'clientId', {
	    get: function() {
			if(this._clientId === null || this._clientId === undefined){
				this._clientId = generateUuid();
				this.save();
		        return this._clientId;
			}
			else{
		        return this._clientId;
			}
	    },
	    set: function(value) {
			if(this._clientId === null || this._clientId === undefined){
				this._clientId = value;
			}
	    },
	    configurable: true
	});

	var ConfigManager_makeData = ConfigManager.makeData;
	ConfigManager.makeData = function() {
		var config = ConfigManager_makeData.call(this);
	    config.clientId = this.clientId;
	    return config;
	};

	var ConfigManager_applyData = ConfigManager.applyData;
	ConfigManager.applyData = function(config) {
		ConfigManager_applyData.call(this, config);
    	this.clientId = this.readClientId(config, 'clientId');
	};

	ConfigManager.readClientId = function(config, name) {
	    var value = config[name];
	    if (value !== undefined && value !== null) {
	        return value;
	    } else {
			value = generateUuid();
			this.save();
	        return value;
	    }
	};

	function getClientId() {
		return ConfigManager.clientId;
	};

    //=============================================================================
    // Window_TitleCommand
    //  プライバシーポリシーの選択肢を追加定義します。
    //=============================================================================
	
	if( paramIsDisplayPolicy ) {

		var _BITO_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
		Window_TitleCommand.prototype.makeCommandList = function() {
			_BITO_Window_TitleCommand_makeCommandList.call(this);
			this.addCommand(paramPolicyName, 'PolicyView', paramIsDisplayPolicy);
		};
 
		var _Scene_Title_create = Scene_Title.prototype.create;
		Scene_Title.prototype.create = function() {
			_Scene_Title_create.apply(this, arguments);
			this.createScrollTextWindow();
		};
	
		Scene_Title.prototype.createScrollTextWindow = function() {
			this._scrollTextWindow = new Window_ScrollText();
			this.addWindow(this._scrollTextWindow);
		};
	
		var _Scene_Title_update = Scene_Title.prototype.update;
		Scene_Title.prototype.update = function() {
			_Scene_Title_update.apply(this, arguments);
			if (!$gameMessage.hasText() && !this._commandWindow.active) {
				this._commandWindow.activate();
			}
		};
	
		Scene_Title.prototype.commandPolicyView = function() {
			$gameMessage.add( insert_br( paramPolicyDetail1, paramPolicyBreakSize ) + "\n\n" + insert_br( paramPolicyDetail2, paramPolicyBreakSize ) + "\n\n" + insert_br( paramPolicyDetail3, paramPolicyBreakSize ) );
			$gameMessage.setScroll(2, false);
		};
	
		var _BITO_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
		Scene_Title.prototype.createCommandWindow = function() {
			_BITO_Scene_Title_createCommandWindow.call(this);
			this._commandWindow.setHandler('PolicyView', this.commandPolicyView.bind(this));
		};
		
	}

    //-----------------------------------------------------------------------------
    // Scene_Title.prototype.start
    //  タイトル時 トラッキング
    //-----------------------------------------------------------------------------
	
    var _BITO_Scene_Title_prototype_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _BITO_Scene_Title_prototype_start.call(this);
        if (paramIsAnalyzingMove && Startuped ) {
			var page = paramfolderName + "/title";
			var title = 'TITLE';
			payload_data= 'v=1&t=pageview&tid='+paramTrackingID+'&cid='+getClientId()+'&dp='+page+'&dt='+title;
			sendGoogleAnalytics();
			console.info("Tracked:", title, page);
        } else {
            // 最初のタイトル表示を経てトラッキング開始
            Startuped = true;
        }
    }

    //-----------------------------------------------------------------------------
    // Scene_Save.prototype.start
    //  セーブ時 トラッキング
    //-----------------------------------------------------------------------------
	
	var Scene_Save_prototype_onSaveSuccess = Scene_Save.prototype.onSaveSuccess;
	Scene_Save.prototype.onSaveSuccess = function() {
		Scene_Save_prototype_onSaveSuccess.call(this);
        if (paramIsAnalyzingMove) {
			var page = paramfolderName + "/save";
			var title = 'SAVE';
			payload_data= 'v=1&t=pageview&tid='+paramTrackingID+'&cid='+getClientId()+'&dp='+page+'&dt='+title;
			sendGoogleAnalytics();
			console.info("Tracked:", title, page);
        }
	};

    //-----------------------------------------------------------------------------
    // Scene_Gameover.prototype.start
    //  ゲームオーバー時 トラッキング
    //-----------------------------------------------------------------------------
	
	var Scene_Gameover_prototype_start = Scene_Gameover.prototype.start;
	Scene_Gameover.prototype.start = function() {
		Scene_Gameover_prototype_start.call(this);
        if (paramIsAnalyzingMove && Startuped) {
			var page = paramfolderName + "/gameover";
			var title = 'GAME OVER';
			payload_data= 'v=1&t=pageview&tid='+paramTrackingID+'&cid='+getClientId()+'&dp='+page+'&dt='+title;
			sendGoogleAnalytics();
			console.info("Tracked:", title, page);
        }
    }

    //-----------------------------------------------------------------------------
    // Game_Player.prototype.performTransfer
    //  場所移動時 トラッキング
    //-----------------------------------------------------------------------------	
	
	var Game_Player_prototype_performTransfer = Game_Player.prototype.performTransfer;
	Game_Player.prototype.performTransfer = function() {
        if (paramIsAnalyzingMove && Startuped && this.isTransferring() ) {
			var addAxesText = "";
			var mapId = this._newMapId;
			var x = this._newX;
			var y = this._newY;
			var mapName     = $dataMapInfos[mapId].name;
			if( paramIsAddAxes ) { addAxesText = "(" + x + "," + y + ")"; }
			if( paramIsMapNameUrl ) { mapId = mapName; }
			var page = paramfolderName + '/' + mapId + '/' + x + '/' + y;
			var title = mapName + addAxesText;
			payload_data= 'v=1&t=pageview&tid='+paramTrackingID+'&cid='+getClientId()+'&dp='+page+'&dt='+title;
			sendGoogleAnalytics();
			console.info("Tracked:", title, page);
        }
		Game_Player_prototype_performTransfer.call(this);
	};

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
	
    var paramParamName = getParamString(['ParamName', 'パラメータ名']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
	
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        try {
            this.pluginCommandGameAnalytics(command.replace(commandPrefix, ''), args);
        } catch (e) {
            console.error(e);
        }
    };

    Game_Interpreter.prototype.pluginCommandGameAnalytics = function(command, args) {
        var mapId = $gameMap.mapId();
        var x = this.character(-1).x;
        var y = this.character(-1).y;
        switch (getCommandName(command)) {
            case '_MOVE_TURN':
                var turnMode = (getArgString(args[0], 1)) ? getArgString(args[0], 1) : "ON";
                if (turnMode === "ON") {
                    paramIsAnalyzingMove = true;
                } else if (turnMode === "OFF") {
                    paramIsAnalyzingMove = false;
                }
                break;
            case '_CND_TURN':
                var turnMode = (getArgString(args[0], 1)) ? getArgString(args[0], 1) : "ON";
                if (turnMode === "ON") {
                    paramIsAnalyzingCommand = true;
                } else if (turnMode === "OFF") {
                    paramIsAnalyzingCommand = false;
                }
                break;
            case '_VIEW':
				if( paramIsAnalyzingCommand ) {
					var mapName = (getArgString(args[0], 1)) ? getArgString(args[0], 1) : $dataMapInfos[mapId].name
					var addAxesText = "";
					if( paramIsAddAxes ) { addAxesText = "(" + x + "," + y + ")"; }
					if( paramIsMapNameUrl ) { mapId = mapName; }
					var page = paramfolderName + '/' + mapId + '/' + x + '/' + y;
					var title = mapName + addAxesText;
					payload_data= 'v=1&t=pageview&tid='+paramTrackingID+'&cid='+getClientId()+'&dp='+page+'&dt='+title;
					sendGoogleAnalytics();
					console.info("Tracked:", title, page);
				}
                break;
            case '_EVENT':
				if( paramIsAnalyzingCommand ) {
					var eventCategory  = getArgString(args[0], 1);
					var eventAction    = getArgString(args[1], 1);
					var eventLabel     = getArgString(args[2], 1);
					var eventNumberStr = getArgString(args[3], 0);
					var eventNumber    = getArgNumber(args[3], 0);
					
					if( eventCategory == "" || eventAction == "") {
						console.error( pluginName + ": プラグインコマンド "+paramPrefixPluginCommand+"_EVENT: Category, Action は必須項目です。" );
					}
					else if(Number(args[3]) < 0){
						console.error( pluginName + ": プラグインコマンド "+paramPrefixPluginCommand+"_EVENT: Value は正の整数のみ有効です。Value:"+eventNumberStr);
					}
					else{
						payload_data= 'v=1&t=event&tid='+paramTrackingID+'&cid='+getClientId()+'&ec='+eventCategory+'&ea='+eventAction+'&el='+eventLabel+((eventNumberStr != '')?'&ev=' + eventNumber : '');
						sendGoogleAnalytics();
						console.info("Event Tracked:", eventCategory, eventAction, eventLabel, eventNumberStr);
					}
				}
                break;
        }
    };
})();
