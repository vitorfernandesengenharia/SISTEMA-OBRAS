# MontIA — Central inteligente de demandas externas

Protótipo web de uma central operacional para receber, entender e responder demandas externas de equipes de montagem contratadas. A interface combina atendimento assistido por IA com controle de acesso temporário às obras.

## Funcionalidades demonstradas

- Caixa de entrada com busca e filtros por prioridade e pendência.
- Resumo inteligente da demanda, classificação de prioridade e identificação do canal de origem.
- Resposta sugerida por IA com ações para aprovar, enviar ou editar antes do envio.
- Contexto da obra e da ordem de serviço vinculados à conversa.
- Solicitação de acesso temporário restrito por área e validade.
- Confirmação de liberação com registro de auditoria e emissão simulada de QR Codes individuais.
- Layout responsivo para desktop, tablet e celular.

## Executar localmente

O projeto é estático e não requer instalação de dependências:

```bash
python3 -m http.server 4173
```

Depois, acesse `http://localhost:4173`.
