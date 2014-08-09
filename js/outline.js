/*
 * Sakura Editor Markdown Outline Plugin
 *
 * @author tsyk goto <ngyuki.ts@gmail.com>
 * @link https://github.com/ngyuki/sakuraeditor-plugin-markdown
 * @copyright Copyright 2012 ngyuki (tsyk goto)
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

(function(){

    function trim(str)
    {
        return str.replace(/^\s+/,"").replace(/\s+$/,"");
    };

    function trace(str)
    {
        Editor.TraceOut(str);
    };

    // タイプ → 100:ツリー表示
    Outline.SetListType(100);

    // タイトル
    Outline.SetTitle("Markdown");

    // 行数
    var lineCount = Editor.GetLineCount(0);

    // 直前行
    var prevLine = "";

    // コードブロック
    var isCodelock = false;

    // アウトラインのリスト
    var outline = [];

    outline.add = function(row, column, text, level){
        this.push({
            row:row,
            column:column,
            text:text,
            level:level
        });
    };

    for (var no = 0; no <= lineCount; no++)
    {
        // 範囲外を超えても大丈夫？ → 大丈夫っぽいのでそのまま
        var nextLine = Editor.GetLineStr(no + 1);

        if (isCodelock)
        {
            if (prevLine.match(/^```/))
            {
                isCodelock = false;
            }
        }
        else if (nextLine.match(/^=+\s*$/))
        {
            if (prevLine.length > 0)
            {
                outline.add(no, 1, trim(prevLine), 0);
            }
        }
        else if (nextLine.match(/^-+\s*$/))
        {
            if (prevLine.length > 0)
            {
                outline.add(no, 1, trim(prevLine), 1);
            }
        }
        else if (prevLine.match(/^(#+)\s*(.*?)(?:#+)?\s*$/))
        {
            outline.add(no, 1, RegExp.$2, RegExp.$1.length - 1);
        }
        else if (prevLine.match(/^```/))
        {
            isCodelock = true;
        }

        prevLine = nextLine;
    }

    (function(){
        var level = null;

        // 最上位のレベルを導出
        for (var i=0, len=outline.length; i<len; i++)
        {
            var ol = outline[i];
            var lv = ol.level;

            if (level == null)
            {
                level = lv;
            }
            else
            {
                level = Math.min(level, lv);
            }
        }

        for (var i=0, len=outline.length; i<len; i++)
        {
            var ol = outline[i];
            ol.level -= level;
        }
    }());

    (function(){
        var level = -1;

        for (var i=0, len=outline.length; i<len; i++)
        {
            var ol = outline[i];
            var req = ol.level - 1;

            for (; level < req; level++)
            {
                // レベルが飛んだ場合は適当な項目を補完
                Outline.AddFuncInfo2(ol.row, ol.column, "no label", level + 1);
            }

            level = ol.level;

            Outline.AddFuncInfo2(ol.row, ol.column, ol.text, ol.level);
        }
    }());

})();
