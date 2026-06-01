# MontIA — Central inteligente de demandas externas

Aplicação local pronta para uso que centraliza demandas externas de equipes de montagem contratadas. A interface combina atendimento assistido por IA com controle de acesso temporário às obras.

## Como abrir — sem usar terminal

Você só precisa ter o [Python](https://www.python.org/downloads/) instalado no computador. Não é necessário instalar banco de dados ou pacotes adicionais.

### Windows

1. Dê duplo clique no arquivo **`iniciar.bat`**.
2. Aguarde alguns segundos: o MontIA abrirá automaticamente no navegador.
3. Mantenha a janela preta aberta enquanto estiver utilizando o sistema.

### macOS

1. Dê duplo clique no arquivo **`iniciar.command`**.
2. Aguarde alguns segundos: o MontIA abrirá automaticamente no navegador.
3. Mantenha a janela do Terminal aberta enquanto estiver utilizando o sistema.

> Se o macOS bloquear a primeira abertura, clique com o botão direito em `iniciar.command`, selecione **Abrir** e confirme.

### Linux

Dê duplo clique em **`iniciar.sh`** ou execute `./iniciar.sh`.

## O que já funciona

- Caixa de entrada com busca e filtros por prioridade e pendência.
- Resumo inteligente da demanda, classificação de prioridade e identificação do canal de origem.
- Resposta sugerida por IA com ações para aprovar, enviar ou editar antes do envio.
- Contexto da obra e da ordem de serviço vinculados à conversa.
- Solicitação de acesso temporário restrito por área e validade.
- Persistência local das mensagens enviadas e das liberações de acesso.
- Confirmação de liberação com registro local e emissão simulada de QR Codes individuais.
- Layout responsivo para desktop, tablet e celular.

Os dados ficam salvos somente neste computador no arquivo local `data/state.json` (criado automaticamente na primeira abertura). Para utilização em produção por múltiplos usuários, ainda será necessário configurar hospedagem, autenticação, banco de dados e integrações externas.

## Acesso técnico opcional

Para iniciar manualmente ou fazer verificações técnicas:

```bash
python3 server.py
```

A aplicação abrirá automaticamente em `http://127.0.0.1:4173`.
