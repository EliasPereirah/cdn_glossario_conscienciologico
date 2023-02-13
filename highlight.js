/**
 * This script is a tool for adding interactive tooltips to any HTML element on a web page.
 * It uses Tippy.js (https://unpkg.com/tippy.js@6) and Popper.js (https://unpkg.com/@popperjs/core@2) to implement the tooltips.
 *
 * To use this script, simply add the `data-tippy` attribute to any HTML element you want to have a tooltip,
 * and specify the content of the tooltip as the value of the attribute. For example:
 *
 * <button data-tippy="Hello, world!">Hover over me</button>
 *
 * The script will automatically detect all elements with the `data-tippy` attribute and create tooltips for them.
 *
 * This script is free to use and modify, and is licensed under the MIT license. The Tippy.js project is also
 * licensed under the MIT license, and can be found at https://atomiks.github.io/tippyjs/. The Popper.js project
 * is also licensed under the MIT license, and can be found at https://popper.js.org/.
 *
 * Contact the author (Elias Pereira) at https://taxologia.com/contato if you have any questions or feedback.
 *
 * Compatibility: This script has been tested in recent versions of Google Chrome, Mozilla Firefox, and Apple Safari.
 * It may work in other browsers as well, but has not been extensively tested in all environments.
 */


function highlightTooltip(element, words_keys, theme) {
    let regex = new RegExp('\\b(' + words_keys.join('|') + ')\\b', 'i');
    // Faz uma busca pelas palavras-chave no elemento inteiro
    let iterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            if (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'IFRAME') {
                return NodeFilter.FILTER_REJECT;
            }
            return regex.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }

    });

    // Para cada ocorrência da palavra-chave
    let node;
    while (node = iterator.nextNode()) {
        let parent = node.parentNode;
        let text = node.textContent;
        let class_name;

        // Enquanto houver palavras-chave no text
        let match;
        while (match = regex.exec(text)) {
            // Cria uma cópia do texto antes da palavra-chave
            let pre = document.createTextNode(text.slice(0, match.index));
            parent.insertBefore(pre, node);

            // Cria uma cópia do texto da palavra-chave
            let key = document.createElement('span');
            key.classList.add('highlighted-word');

            key.textContent = match[0];
            class_name = key.textContent.replaceAll(' ', "_").toLowerCase();
            key.classList.add(class_name + "__");
            parent.insertBefore(key, node);
            text = text.slice(match.index + match[0].length);
        }
        // Adiciona o texto restante
        if (text.length > 0) {
            let post = document.createTextNode(text);
            parent.insertBefore(post, node);
        }
        // Remove o texto original
        parent.removeChild(node);
    }

    const highlightedWords = document.getElementsByClassName("highlighted-word");
    let cnt;
    for (const word of highlightedWords) {
        cnt = words[word.innerText.trim().toLocaleLowerCase()];
        tippy(word, {
            content: cnt,
            trigger: 'mouseenter',
            theme: theme,
            interactive: true,
            appendTo: document.body,
        });

    }
    removeRepeated();
}


function removeRepeated() {
    let hw = document.querySelectorAll(".highlighted-word");
    let has_class = [];
    let idx = 0;
    let class_name;
    hw.forEach(element => {
        idx++;
        if (idx > 4) {
            has_class.shift();
            // allow repetition, but not so close
            idx = 0;
        }
        class_name = element.classList.value.split(" ")[1];
        if (has_class.includes(class_name)) {
            element.classList.remove('highlighted-word');
            // that will just remove styling, but tooltip will continue to work
        } else {
            has_class.push(class_name);
        }
    });
}


function loadTippyCDN(callback) {
    /* the order is important */
    const all_scripts = [
        {src: 'https://unpkg.com/@popperjs/core@2', log: 'Popper.js loaded'},
        {src: 'https://unpkg.com/tippy.js@6', log: 'Tippy.js loaded'},
        {src: 'https://cdn.jsdelivr.net/gh/EliasPereirah/cdn_glossario_conscienciologico@main/termos_conscienciologicos.js', log: 'Glossary loaded'}
    ];
    function loadNext(idx){
        let script = document.createElement('script');
        script.setAttribute("src", all_scripts[idx].src);
        document.head.appendChild(script)
        script.addEventListener("load", ()=>{
            console.log(all_scripts[idx].log)
            if(idx < (all_scripts.length - 1)){
                idx++;
                loadNext(idx)
            }else{
                callback();
            }
        });
    }
    loadNext(0);
}



function initHL(theme) {
    const selectors = [
        '#main',
        '.main',
        'main',
        '#article',
        'article',
        '#content',
        '.content',
        '#container',
        '.container',
        '[role="main"]'
    ];

    const content = selectors.reduce((selected, selector) => {
        return selected || document.querySelector(selector);
    }, null) || document.body;

    const wordsKeys = Object.keys(words);
    highlightTooltip(content, wordsKeys,theme);
}

function rewriteTippyCss(font_size) {
    const style = document.createElement('style');
    style.innerHTML = `
        .highlighted-word {
            border-bottom: 2px dotted #383636;
            cursor: help;
        }
        .tippy-box {
            font-size: ${font_size} !important;
        }
    `;
    document.head.appendChild(style);
}


function makeLightThemeAvailable(){
    let light_theme = `.tippy-box[data-theme~=light]{color:#26323d;box-shadow:0 0 20px 4px rgba(154,161,177,.15),0 4px 80px -8px rgba(36,40,47,.25),0 4px 4px -2px rgba(91,94,105,.15);background-color:#fff}.tippy-box[data-theme~=light][data-placement^=top]>.tippy-arrow:before{border-top-color:#fff}.tippy-box[data-theme~=light][data-placement^=bottom]>.tippy-arrow:before{border-bottom-color:#fff}.tippy-box[data-theme~=light][data-placement^=left]>.tippy-arrow:before{border-left-color:#fff}.tippy-box[data-theme~=light][data-placement^=right]>.tippy-arrow:before{border-right-color:#fff}.tippy-box[data-theme~=light]>.tippy-backdrop{background-color:#fff}.tippy-box[data-theme~=light]>.tippy-svg-arrow{fill:#fff}`;
    const style = document.createElement('style');
    style.innerHTML = light_theme;
    document.head.appendChild(style);
}




 window.addEventListener('load', () => {
        if(tooltip_config == null){
             tooltip_config = {
                theme: 'light',
                font_size: '18px'
            }
        }
        rewriteTippyCss(tooltip_config.font_size);
        makeLightThemeAvailable();
        loadTippyCDN(() => {
            initHL(tooltip_config.theme);

        });
    });
