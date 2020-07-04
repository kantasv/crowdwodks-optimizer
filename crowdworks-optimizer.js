// ==UserScript==
// @name         Crowdworks Optimizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://crowdworks.jp/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    //趣旨：クラウドワークス上の依頼には多種多様な案件がありますが、その中には正当な単価でない、誰でもできる、競合者が多すぎる、自分のスキルとミスマッチしているなど
    //多くの依頼が、見るだけで時間と注意力を奪ってしまうという現状があります。個人的にその状況を打破するために、ちょっとしたTampermonkeyスクリプトを作成しました


    //use lowercases
    //こうした低単価で誰でもできる案件が目に入ること自体がエンジニアには無駄なので、これらを省くことで集中力を保ちます　個人的にそうした特徴を持つ案件に含まれるキーワードをデフォルトで入れておきました
    var blacklist = ['タスク', '簡単', '誰でも', 'かんたん', 'カンタン', '記事', 'コンペ', '初心者', '主婦', 'モニター', '☆', '★', '作業', 'アンケート', '時間単価制', '記事','リライト','電話対応','スタッフ','在宅','イラスト制作','未経験','ライティング']
    //例えば興味はあるが、現時点で使えない技術などをこのリストに追加することにより、成約に結びつかない案件を排除し、自分のスキルが生かせる案件探しに集中できます
    var skillMismatchList = ['aws', 'react native', 'sql', 'wordpress', 'cms', 'mallento']
    //既に応募が多いものを弾くために、この変数を決定します。応募には時間がかかるため、競争率が高い案件に時間を割かないことで、成約率をあげることができます。
    var maxCandidate = 5

    var elmContainsQueriesOnBlacklist = elm => {
        return blacklist.filter(query => {
            return elm.innerText.toLowerCase().indexOf(query) != -1
        }).length + skillMismatchList.filter(query => {
            return elm.innerText.toLowerCase().indexOf(query) != -1
        }).length
    }

    var cleanSearchResult = () => {
        document.querySelectorAll(".job_item").forEach(elm => {
            if (elmContainsQueriesOnBlacklist(elm)) {
                elm.style.display = 'none'
                console.log('Hidden:', elm.innerText)
            }
        })
    }

    var cleanRelatedJobRow = () => {
        document.querySelectorAll(".related_job_row ").forEach(elm => {
            if (elmContainsQueriesOnBlacklist(elm)) {
                elm.style.display = 'none'
                console.log('Hidden:', elm.innerText)
            }
        })
    }

    var initCandidateLimitAlert = () => {
        document.querySelectorAll('th').forEach(elm => {
            if (elm.innerText == '応募した人') {
                var candidatesElement = elm.nextElementSibling
                var condidatesNumber = candidatesElement.innerText.replace(/[^0-9]/g, '');
                console.log(condidatesNumber)
                if (maxCandidate < condidatesNumber) {
                    alert('応募人数が大すぎます.')
                }
            }
        })
    }


    window.onload = () => {
        var onSearchPage = document.querySelectorAll('.result_count').length
        var onJobDescriptionPage = document.querySelectorAll('[gtm_event_job_category=apply_click_development]').length
        if (onSearchPage) {
            cleanSearchResult()
        }
        if (onJobDescriptionPage) {
            cleanRelatedJobRow()
        }
        initCandidateLimitAlert()
    }
})();


