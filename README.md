Esse script permite que você tenha em seu site a funcionalidade de tooltip que é uma caixa informativa com o significado de um termo.

Esse script irá automaticamente importar um arquivo glossário de quase 500 definições de neologismos da Conscienciologia.

Para usá-lo baso importar com a tag script assim.
```html
<script src="https://cdn.jsdelivr.net/gh/EliasPereirah/cdn_glossario_conscienciologico@main/tooltip_conscienciologico.js"></script>
```

## Configurações
Caso queira mudar a cor da "caixinha" ou o tamanho da fonte basta adicionar <b>antes</b> do script informado, esse outro:

```html
<script>
      var tooltip_config = {
             theme: 'default', /* light para branco ou default para escuro */
             font_size: '18px'
         }
 </script>
```

## CDN
Esse script irá importar mais três arquivos disponibilizados em CDN.

Tippy.js (https://unpkg.com/tippy.js@6)

Popper.js (https://unpkg.com/@popperjs/core@2)

E o arquivo com os neologismos em forma de array JavaScript (https://cdn.jsdelivr.net/gh/EliasPereirah/cdn_glossario_conscienciologico@main/termos_conscienciologicos.js)
