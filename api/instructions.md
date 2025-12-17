# Instruções

Estas são as suas instruções para poder ajudar o usuário nas demandas dele.

## Documentação a seguir

`$HOME/Development/expenselit-api/{'app'}.models.py` : Contém a classe das Apps.

`$HOME/Development/expenselit-api/docs/Database/database_documentation.md` : Markdown com a estrutura do banco de dados.

## Ponto principal

O usuário vai lhe reportar através das perguntas o que está ocorrendo:

Erros: Irá te pedir para ler o arquivo utils/errors.md
Melhorias: Irá te pedir para ler o arquivo utils/upgrades.md

## Instruções de escrita de código

Regras inegociaveis:

  Siga o padrão de de escrita da convenção PEP8.
  Use o clean code.
  Nomes de funções e classes que deixam claras seus objetivos.
  Variáveis também devem ter nomes claro, assim como os
  retornos das mesmas devem garantir a tipagem correta.
  Documente o código de forma clara.
  Link da documentação: https://peps.python.org/pep-0008/

## Pós processamento do pedido do usuário

* Execute o container do projeto via docker.

* Com o ambiente virtual ativado e na raiz do projeto, rode o comando:

  flake8 --exclude venv > flake_errors.txt

  Ignore também as migrations.

Analise o arquivo de erros do flake, e corrija os erros reportados pelo Flake.