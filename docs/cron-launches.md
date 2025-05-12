# Configuração da atualização automática dos lançamentos

Este documento explica como configurar a tarefa agendada para atualizar automaticamente os status de lançamento dos canais às 8h00 UTC todos os dias.

## Funcionamento

O sistema de lançamento funciona da seguinte forma:

- Os canais estão inicialmente com o status `SCHEDULED` com uma data de lançamento programada
- Às 8h00 UTC no dia do lançamento, o status muda para `ONGOING`
- Às 8h00 UTC no dia seguinte, o status muda para `LAUNCHED`

## Configuração no Coolify

### 1. Adicionar as variáveis de ambiente

Adicione as seguintes variáveis de ambiente à sua aplicação no Coolify:

```
CRON_API_KEY=sua_chave_secreta_aqui
APP_URL=https://seu-dominio.com
```

- `CRON_API_KEY`: Uma chave secreta para proteger a API (gere uma sequência aleatória complexa)
- `APP_URL`: A URL base da sua aplicação

### 2. Configurar a tarefa agendada

No Coolify, crie uma nova tarefa agendada com os seguintes parâmetros:

- **Nome**: `update-launches`
- **Comando**: `/app/scripts/update-launches.sh`
- **Frequência**: `0 8 * * *` (todos os dias às 8h00 UTC)
- **Nome do contêiner**: O nome do contêiner da sua aplicação

### 3. Tornar o script executável

Certifique-se de que o script é executável executando este comando no contêiner:

```bash
chmod +x /app/scripts/update-launches.sh
```

## Teste manual

Para testar manualmente a atualização dos lançamentos, você pode executar:

```bash
curl -X GET \
  -H "Authorization: Bearer sua_chave_secreta_aqui" \
  -H "Content-Type: application/json" \
  "https://seu-dominio.com/api/cron/update-launches"
```

## Logs

Os logs da tarefa agendada estão disponíveis no Coolify na aba "Logs" da tarefa agendada.

## Solução de problemas

Se a tarefa agendada falhar, verifique os seguintes pontos:

1. As variáveis de ambiente `CRON_API_KEY` e `APP_URL` estão corretamente definidas
2. O script `/app/scripts/update-launches.sh` é executável
3. A API `/api/cron/update-launches` está acessível
4. Os logs da aplicação para verificar possíveis erros
