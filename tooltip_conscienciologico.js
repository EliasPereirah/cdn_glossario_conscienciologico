/**
 * Version 2
 * Este script é uma ferramenta para adicionar caixas interativas com definições de termos Conscienciológicos
 * a qualquer site na internet.
 * Ele irá identificar os neologismos e adicionar uma caixa com o significado sempre o usuário passar o mouse sobre o
 * termo.
 * Ele usa Tippy.js (https://unpkg.com/tippy.js@6) e Popper.js (https://unpkg.com/@popperjs/core@2) para implementar
 * as dicas de ferramentas ambos com lincença MIT
 * O projeto Tippy.js pode ser encontrado em https://atomiks.github.io/tippyjs/.
 * O projeto Popper.js pode ser encontrado em https://popper.js.org/.
 * Entre em contato com o autor (Elias Pereira) em https://taxologia.com/contato se tiver alguma dúvida ou sugestão.
 */


function isTagA(elemento) {
    return elemento.tagName === 'A';
}

function estaAninhadoEmTagA(elemento) {
    var pai = elemento.parentElement;
    while (pai !== null) {
        if (isTagA(pai)) {
            return true;
        }
        pai = pai.parentElement;
    }
    return false;
}

function highlightTooltip(element, words_keys, theme) {
    let regex = new RegExp('\\b(' + words_keys.join('|') + ')\\b', 'i');
    let accepted_nodes = ['DIV','SPAN','ARTICLE','P','I','B','EM','STRONG','MAIN','BLOCKQUOTE','BODY','HTML','SECTION','TABLE','TD','TH','TBODY'];
    let iterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            if (!accepted_nodes.includes(node.parentNode.nodeName)) {
                 return NodeFilter.FILTER_REJECT;
             }
            return regex.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }

    });

    // Para cada ocorrência da palavra-chave
    let node;
    while (node = iterator.nextNode()) {
        let parent = node.parentNode;
       if (estaAninhadoEmTagA(parent)) {
            // evita links
            continue;
        }
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
    let js_close = '<span class="close_tippy"></span>';
    for (const word of highlightedWords) {
        cnt = tooltip_words_definitions[word.innerText.trim().toLocaleLowerCase()];
        if(screen.width <= 1024){
            // mobile
            if(cnt.search(/tippy_add/) === -1){
                cnt += " "+js_close;
            }
        }
        let wm = word.innerText.charAt(0).toUpperCase() +"<space></space>"+ word.innerText.slice(1);
        cnt = `<strong>${wm}:</strong> ${cnt}`;
        tippy(word, {
            content: cnt,
            trigger: 'mouseenter',
            theme: theme,
            interactive: true,
            appendTo: document.body,
            allowHTML: true,
            onShown: (instance)=>{
                let close_me = instance.popper.querySelector('.close_tippy');
                if(close_me){
                    close_me.addEventListener('click', () => {
                        instance.hide();
                    });
                }
            },
             popperOptions: {
                    strategy: 'fixed',
                    modifiers: [
                      {
                        name: 'flip',
                        options: {
                          fallbackPlacements: ['bottom', 'right'],
                        },
                      },
                      {
                        name: 'preventOverflow',
                        options: {
                          altAxis: true,
                          tether: false,
                        },
                      },
                    ],
                  }
        });

    }
    removeRepeated();
}



function addVer(ele){
    let js_close = '<span class="close_tippy"></span>';
    let cnt = tooltip_words_definitions[ele.innerText.toLowerCase()];
    if(screen.width <= 1024){
            cnt += " "+js_close;
    }
    tippy(ele, {
        content: cnt,
        theme: 'light',
        trigger: 'mouseenter',
        interactive: true,
        appendTo: document.body,
        allowHTML: true,
        onShown: (instance)=>{
            let close_me = instance.popper.querySelector('.close_tippy');
            if(close_me){
                close_me.addEventListener('click', () => {
                    instance.hide();
                });
            }
        },
        popperOptions: {
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['bottom', 'right'],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        altAxis: true,
                        tether: false,
                    },
                },
            ],
        }
    });

    let eventMouseEnter = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    ele.dispatchEvent(eventMouseEnter);
    ele.onclick =()=>{
        return false;
    }
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



function initHL(theme, selector) {
    const content = document.querySelector(selector)
    if(content == null){
        console.log('Tooltip não pode ser aplicado. Selector '+selector+' não existe na página');
        return false;
    }
    if(typeof(tooltip_new_definitions) == 'object'){
        tooltip_words_definitions = Object.assign(tooltip_words_definitions, tooltip_new_definitions);
    }
    const wordsKeys = Object.keys(tooltip_words_definitions);
    highlightTooltip(content, wordsKeys,theme);
}

function rewriteTippyCss(font_size) {
    const style = document.createElement('style');
    style.innerHTML = `
        .highlighted-word {
            border-bottom: 2px dotted #383636;
            cursor: help;
        }
        .tippy-box{
            font-size: ${font_size} !important;
        }
         .tippy_add{
            color: #0000ff;
            cursor: pointer;
        }
         .close_tippy{
            color: #fff;
            border-radius: 2px;
            padding: 1px 4px;
            font-family: serif;
            font-weight: 500;
            float: right;
            position: absolute;
            right: 0px;
            top: 0;
            background-color: rgb(103 58 183);
        }
        .close_tippy::before{
            content: 'X';
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


function makeAliceThemeAvailable(){
    let alice_theme = `.tippy-box[data-theme~=alice]{color:#26323d;box-shadow:0px 0px 4px 0px #2011e7;background-color:aliceblue;}.tippy-box[data-theme~=light][data-placement^=top]>.tippy-arrow:before{border-top-color:#fff}.tippy-box[data-theme~=light][data-placement^=bottom]>.tippy-arrow:before{border-bottom-color:#fff}.tippy-box[data-theme~=light][data-placement^=left]>.tippy-arrow:before{border-left-color:#fff}.tippy-box[data-theme~=light][data-placement^=right]>.tippy-arrow:before{border-right-color:#fff}.tippy-box[data-theme~=light]>.tippy-backdrop{background-color:#fff}.tippy-box[data-theme~=light]>.tippy-svg-arrow{fill:#fff}`;
    const style = document.createElement('style');
    style.innerHTML = alice_theme;
    document.head.appendChild(style);
}



window.addEventListener('load', () => {
    if(typeof tooltip_config === "undefined"){
        tooltip_config = {
            theme: 'default',
            font_size: '18px'
        }
    }

    if(tooltip_config.font_size == null){
        tooltip_config.font_size = '18px';
    }
    if(tooltip_config.target_element == null){
        tooltip_config.target_element = 'body';
    }

    rewriteTippyCss(tooltip_config.font_size);
    makeLightThemeAvailable();
    makeAliceThemeAvailable();
    loadTippyCDN(() => {
        initHL(tooltip_config.theme, tooltip_config.target_element);
    });
});
