document.addEventListener("DOMContentLoaded", function() {

    const classMap = {
        "グラディウス": "tricephalos",
        "エデレ": "gaping-jaw",
        "マリス": "augur",
        "リブラ": "equilibrious-beast",
        "フルゴール": "darkdrift-knight",
        "カリゴ": "fissure-in-the-fog",
        "グノスター": "sentient-pest",
        "ナメレス": "night-aspect"
    };

    const bosses = {
        "1日目": {
            "亜人の女王＆亜人の剣聖": ["グラディウス","ナメレス"],
            "英雄のガーゴイル": ["エデレ","マリス","ナメレス"],
            "王族の幽鬼": ["リブラ","フルゴール","ナメレス"],
            "公のフレイディア": ["エデレ","リブラ","カリゴ","ナメレス"],
            "鈴玉狩り": ["グラディウス","ナメレス"],
            "戦場の宿将": ["グノスター","リブラ","フルゴール","ナメレス"],
            "燻れた樹霊": ["グノスター","カリゴ","ナメレス"],
            "接ぎ木の君主": ["マリス","カリゴ","ナメレス"],
            "ディビアの呼び船": ["グノスター","カリゴ","リブラ","ナメレス"],
            "貪食ドラゴン": ["エデレ","マリス","フルゴール","ナメレス"],
            "ミミズ顔": ["エデレ","マリス","フルゴール","ナメレス"],
            "百足のデーモン": ["グノスター","フルゴール","リブラ","ナメレス"],
            "熔鉄デーモン": ["グノスター","マリス","カリゴ","ナメレス"],
            "夜の騎兵×2": ["エデレ","フルゴール","ナメレス"]
        },
        "2日目": {
            "忌み鬼": ["グラディウス","ナメレス"],
            "神肌の貴種＆神肌の使徒": ["マリス","カリゴ","リブラ","ナメレス"],
            "古竜": ["エデレ","ナメレス"],
            "死儀礼の鳥": ["リブラ","ナメレス"],
            "大土竜": ["グノスター","ナメレス"],
            "冷たい谷の踊り子": ["カリゴ","ナメレス"],
            "ツリーガード＆王都の騎兵": ["グラディウス","マリス","ナメレス"],
            "ノクスの竜人兵": ["グノスター","フルゴール","ナメレス"],
            "降る星の成獣": ["マリス","ナメレス"],
            "砦地の宿将": ["エデレ","フルゴール","ナメレス"],
            "無名の王": ["フルゴール","ナメレス"],
            "竜のツリーガード＆王都の騎兵": ["グノスター","カリゴ","ナメレス"],
            "坩堝の騎士＆黄金カバ": ["エデレ","リブラ","ナメレス"]
        }
    };

    const day1Container = document.getElementById("day1-buttons");
    const day2Container = document.getElementById("day2-buttons");
    const result = document.getElementById("result");

    let selectedDay1 = null;
    let selectedDay2 = null;

    // 結果表示
    function displayResults(title, list) {
        result.innerHTML = `<h4>${title}</h4>`;
        list.forEach(name => {
            const div = document.createElement("div");
            div.textContent = name;
            div.classList.add(classMap[name] || "night-aspect");
            result.appendChild(div);
        });
    }

    // 1日目ボタン生成
    Object.keys(bosses["1日目"]).forEach(boss => {
        const btn = document.createElement("button");
        btn.textContent = boss;
        btn.classList.add("search-btn");
        btn.addEventListener("click", () => {
            selectedDay1 = boss;
            selectedDay2 = null;
            document.querySelectorAll("#day1-buttons button").forEach(b => b.classList.remove("selected"));
            document.querySelectorAll("#day2-buttons button").forEach(b => {
                b.classList.remove("selected", "highlight");
                b.disabled = true;
            });
            btn.classList.add("selected");
            displayResults("候補", bosses["1日目"][boss]);
            enableDay2Buttons(boss);
        });
        day1Container.appendChild(btn);
    });

    // 2日目ボタン生成
    Object.keys(bosses["2日目"]).forEach(boss => {
        const btn = document.createElement("button");
        btn.textContent = boss;
        btn.classList.add("search-btn");
        btn.disabled = true;
        btn.addEventListener("click", () => {
            if (!selectedDay1) return;
            selectedDay2 = boss;
            document.querySelectorAll("#day2-buttons button").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            const c1 = bosses["1日目"][selectedDay1];
            const c2 = bosses["2日目"][selectedDay2];
            const overlap = c1.filter(n => c2.includes(n));
            const final = [...new Set([...overlap, "ナメレス"])];
            displayResults("最終候補", final);
        });
        day2Container.appendChild(btn);
    });

    // 1日目選択後、対応する2日目ボタン有効化＋色付け
    function enableDay2Buttons(day1Boss) {
        const c1 = bosses["1日目"][day1Boss];
        document.querySelectorAll("#day2-buttons button").forEach(btn => {
            const c2 = bosses["2日目"][btn.textContent];
            const overlap = c2.filter(n => c1.includes(n) && n !== "ナメレス");
            if (overlap.length > 0) {
                btn.disabled = false;
                btn.classList.add("highlight", classMap[overlap[0]]);
            } else {
                btn.disabled = true;
                btn.classList.remove("highlight", ...Object.values(classMap));
            }
        });
    }

    // リセットボタン
    const resetBtn = document.createElement("button");
    resetBtn.id = "reset-btn";
    resetBtn.textContent = "リセット";
    resetBtn.addEventListener("click", () => {
        selectedDay1 = null;
        selectedDay2 = null;
        document.querySelectorAll("button").forEach(b => {
            b.classList.remove("selected", "highlight", ...Object.values(classMap));
            if (b.parentElement.id === "day2-buttons") b.disabled = true;
        });
        result.innerHTML = "夜の王候補がここに表示されます";
    });
    result.insertAdjacentElement("beforebegin", resetBtn);

    // 早見表テーブル作成用
    function createTableRows(day, tableId) {
        const table = document.getElementById(tableId);
        Object.entries(bosses[day]).forEach(([bossName, kings]) => {
            // 「ナメレス」は除外
            const filteredKings = kings.filter(k => k !== "ナメレス");
            if (filteredKings.length === 0) return;

            filteredKings.forEach((king, index) => {
                const tr = document.createElement("tr");

                // rowspanを1回目だけ設定
                if (index === 0) {
                    const tdBoss = document.createElement("td");
                    if (filteredKings.length > 1) tdBoss.rowSpan = filteredKings.length;
                    tdBoss.textContent = bossName;
                    tr.appendChild(tdBoss);
                }

                const tdKing = document.createElement("td");
                tdKing.textContent = king;
                tdKing.className = classMap[king] || "";
                tr.appendChild(tdKing);

                table.appendChild(tr);
            });
        });
    }

    // 各日付テーブルを生成
    createTableRows("1日目", "day1-table");
    createTableRows("2日目", "day2-table");

});

