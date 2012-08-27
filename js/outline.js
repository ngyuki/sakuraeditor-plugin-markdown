/*
 * Sakura Editor Markdown Outline Plugin
 * 
 * @author tsyk goto <ngyuki.ts@gmail.com>
 * @link https://github.com/ngyuki/sakuraeditor-plugin-markdown
 * @copyright Copyright 2012 ngyuki (tsyk goto)
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

(function(){

	var $ = {
		trim : function (str)
		{
			return str.replace(/^\s+/,"").replace(/\s+$/,"");
		}
	};

	// タイプ → 100:ツリー表示
	Outline.SetListType(100);

	// タイトル
	Outline.SetTitle("Markdown");

	// 行数
	var lineCount = Editor.GetLineCount(0);

	var prevLine = "";

	for (var no = 0; no <= lineCount; no++)
	{
		// 範囲外を超えても大丈夫？ → 大丈夫っぽいのでそのまま
		var nextLine = Editor.GetLineStr(no + 1);
		
		if (nextLine.match(/^=+\s*$/))
		{
			if (prevLine.length > 0)
			{
				Outline.AddFuncInfo2(no, 1, $.trim(prevLine), 0);
			}
		}
		else if (nextLine.match(/^-+\s*$/))
		{
			if (prevLine.length > 0)
			{
				Outline.AddFuncInfo2(no, 1, $.trim(prevLine), 1);
			}
		}
		else if (prevLine.match(/^(#+)\s*([^#]*)\s*$/))
		{
			Outline.AddFuncInfo2(no, 1, RegExp.$2, RegExp.$1.length - 1);
		}
		
		prevLine = nextLine;
	}

	//  AddFuncInfo2(論理行, 論理桁, 文字列, 深さ)
})();
