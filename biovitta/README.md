# BioVitta — E-commerce + Carreiras

Projeto front-end estático, pronto para abrir no VS Code.

## Estrutura

- `index.html` — loja/e-commerce
- `trabalhe-conosco.html` — Banco de Talentos
- `css/style.css` — estilos responsivos
- `js/main.js` — catálogo, busca, filtros, carrinho, WhatsApp e validação
- `assets/` — logo e imagens SVG locais

## Executar

Abra a pasta no VS Code e rode com uma extensão como **Live Server**, ou abra `index.html` diretamente no navegador.

## Carrinho

O carrinho usa `localStorage`, portanto permanece salvo no navegador. O checkout abre uma mensagem de pedido no WhatsApp da BioVitta.

## Banco de Talentos — atenção

A validação do formulário funciona no front-end, mas **HTML/JavaScript estático não consegue armazenar arquivos de currículo em um banco de dados por conta própria**.

Para produção, conecte `careerForm` a:
1. um backend/API próprio com armazenamento seguro; ou
2. um serviço de formulários que aceite upload; ou
3. um Google Forms configurado para receber anexos, substituindo o formulário pelo iframe indicado no HTML.

Não coloque credenciais, chaves privadas ou dados de banco no JavaScript do navegador.

## Dados configurados

- BioVitta
- Av. Mal. Castelo Branco, 1000 - Jardim Primavera, Piracicaba/SP
- Atendimento: Segunda a Domingo, 24 horas
- WhatsApp: +55 19 99299-0839
- Instagram: @biovitta.farm
- E-mail: biovitta07@gmail.com

## Observação comercial/regulatória

Os preços e produtos deste protótipo são dados de demonstração fornecidos para a construção visual. Antes de publicar, confirme estoque, preços, regras de entrega e requisitos legais aplicáveis à venda de medicamentos e produtos farmacêuticos.


## Google Forms integrado

O portal `trabalhe-conosco.html` está conectado ao formulário:
https://forms.gle/SqaHsceSJLox29fo9

O formulário é incorporado via `iframe` e possui link alternativo para abertura em nova aba.

### E-mail de notificações

Use `pedrodiasgati@gmail.com` como endereço para receber notificações de novas respostas, configurando isso no próprio Google Forms. O endereço não é usado como senha ou credencial no código do site.

O Google Forms/Google Drive do proprietário do formulário é quem armazena as respostas e os arquivos enviados.
