# Tooltip para sites Conscienciológicos v2.0
### Versão 2
Esse script permite que você tenha em seu site a funcionalidade de tooltip que é uma caixa informativa com o significado de um termo.

Esse script irá automaticamente importar um arquivo glossário de quase 500 definições de neologismos da Conscienciologia.

Para usá-lo basta importar com a tag script assim.
```html
<script src="https://cdn.jsdelivr.net/gh/EliasPereirah/cdn_glossario_conscienciologico@main/tooltip_conscienciologico.js"></script>
```
## Configurações
Caso queira mudar a cor da "caixinha" ou o tamanho da fonte basta adicionar <b>antes</b> do script informado, esse outro:

```html
<script>
      var tooltip_config = {
             theme: 'light', /* 'light' para branco, 'alice' para aliceblue ou 'default' para escuro */
             font_size: '18px'
         }
 </script>
```

### Novas definições
O arquivo termos_conscienciologicos.js já possui mais de 500 definições, mas caso queira adicionar novas definições 
basta adicionar o seguinte script <b>antes</b> do script informado.

```html
<script>
        var tooltip_new_definitions =
            {
                'palavrax' : 'Coloque a definição da palavraX aqui', 
                'palavray' : 'Coloque a definição da palavraY aqui',
                'projeção de mentalsoma' : 'Coloque a definição da projeção de mentalsoma aqui'
            }
    </script>
```
Confira a pasta exemplos

## CDN
Esse script irá de forma automática importar mais três scripts disponibilizados em CDN.

Tippy.js (https://unpkg.com/tippy.js@6)

Popper.js (https://unpkg.com/@popperjs/core@2)

E o arquivo com os neologismos em forma de array JavaScript (https://cdn.jsdelivr.net/gh/EliasPereirah/cdn_glossario_conscienciologico@main/termos_conscienciologicos.js)

# Alternativa sem CDN
Se não desejar usar CDN e importar o código diretamente no seu site. Faça o sequinte:

Copie o seguinte script para a raiz do seu site ou um diretório de sua preferência https://unpkg.com/@popperjs/core@2 salve com o nome popper.js

Copie também o script https://unpkg.com/tippy.js@6 com o nome tippy.js

Copie também https://cdn.jsdelivr.net/gh/EliasPereirah/cdn_glossario_conscienciologico@main/termos_conscienciologicos.js com o nome termos_conscienciologicos.js

Copie também o arquivo nesse respositório com o nome [tooltip_conscienciologico.js](https://github.com/EliasPereirah/cdn_glossario_conscienciologico/blob/main/tooltip_conscienciologico.js)  e salve com o nome tooltip_conscienciologico.js , nesse arquivo você vai precisar fazer a alteração dos links dentro do array nomeado `all_script` dentro da function `loadTippyCDN` apontando agora agora para seu própio site.

Um exemplo de como ficaria:

```javascript
    // ......
    const all_scripts = [
        {src: 'https://seusite.com/popper.js', log: 'Popper.js loaded'},
        {src: 'https://seusite.com/tippy.js', log: 'Tippy.js loaded'},
        {src: 'https://seusite.com/termos_conscienciologicos.js', log: 'Glossary loaded'}
    ];
   //.......
```

Feito isso, tudo que precisará para funcionar é importar agora um único script em seu site, os outros serão importados de forma automática. Segue o exemplo.

```html
<script src="https://seusite.com/tooltip_conscienciologico.js"></script>
```

## Conscienciologia
O foco desse script é bem específico(sites conscienciológicos), outros sites não vão se beneficiar em usá-lo

No entanto a lógica aqui poderá ser usada em qualquer outro site que deseje adicionar tooltips de forma mais automática possível, basta ter um arquivo JavaScript com array no seguinte formato:
```javascript
tooltip_words_definitions = {
"consciência":"Definição de consciência aqui",
"ciência":"Definição de ciência aqui",
"psicologia":"Definição de psicologia aqui"
}
```

Se esse for o seu caso, irá precisar modificar a seguinte parte  do código em [tooltip_conscienciologico.js](https://github.com/EliasPereirah/cdn_glossario_conscienciologico/blob/main/tooltip_conscienciologico.js) para:

```javascript
function loadTippyCDN(callback) {
    /* the order is important */
    const all_scripts = [
        {src: 'https://unpkg.com/@popperjs/core@2', log: 'Popper.js loaded'},
        {src: 'https://unpkg.com/tippy.js@6', log: 'Tippy.js loaded'},
        {src: 'https://cdn.jsdelivr.net/gh/EliasPereirah/cdn_glossario_conscienciologico@main/termos_conscienciologicos.js', log: 'Glossary loaded'}
        /// ^^^^^^^se esse for o caso substituia o último link com sua lista de definições seguindo o mesmo formato ^^^^^^^^^^^^^^^^^^^^^^ 
    ];//....
```
