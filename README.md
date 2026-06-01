# MontIA — Central inteligente de demandas externas

Aplicação pronta para demonstrar o recebimento, a compreensão e a resposta de demandas externas de equipes de montagem contratadas, com assistência de IA e controle de acesso temporário às obras.

## Abrir agora — sem instalar ou configurar nada

Para testar no computador, dê duplo clique no arquivo **`ABRIR-DEMONSTRACAO.html`**. A demonstração abrirá no navegador e funcionará sem instalar programas, iniciar servidores ou preencher parâmetros.

As mensagens e liberações realizadas durante o teste ficam salvas somente no navegador utilizado. Isso permite fechar a página e continuar a demonstração posteriormente.

## Link público automático

O projeto inclui uma publicação automática pelo GitHub Pages. Quando este repositório estiver disponível no GitHub, cada atualização da branch principal publicará a demonstração sem configuração adicional da aplicação.

O endereço terá o formato:

```text
https://USUARIO-OU-ORGANIZACAO.github.io/NOME-DO-REPOSITORIO/
```

O endereço exato depende somente do local em que o repositório for armazenado no GitHub. O código da aplicação não precisa ser alterado.

## O que já funciona na demonstração

- Caixa de entrada com busca e filtros por prioridade e pendência.
- Resumo inteligente da demanda, classificação de prioridade e identificação do canal de origem.
- Resposta sugerida por IA com ações para aprovar, enviar ou editar antes do envio.
- Contexto da obra e da ordem de serviço vinculados à conversa.
- Solicitação de acesso temporário restrito por área e validade.
- Persistência das mensagens enviadas e das liberações de acesso no navegador.
- Confirmação de liberação com registro local e emissão simulada de QR Codes individuais.
- Layout responsivo para desktop, tablet e celular.

## Uso local com servidor opcional

Também existe um modo local com servidor Python e persistência em arquivo. Ele é opcional e não é necessário para testar a demonstração.

- Windows: dê duplo clique em **`iniciar.bat`**.
- macOS: dê duplo clique em **`iniciar.command`**.
- Linux: dê duplo clique em **`iniciar.sh`**.

Nesse modo, os dados ficam salvos no arquivo local `data/state.json`, criado automaticamente na primeira abertura.

## Evolução para produção

A demonstração está pronta para avaliação visual e funcional sem parametrização. Para utilização real por múltiplos usuários, ainda será necessário definir uma hospedagem de produção, autenticação, banco de dados compartilhado e integrações externas com WhatsApp, emissão de QR Codes e um provedor de IA.
