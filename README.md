# Calculadora de Arroba

Projeto Flask simples para cálculo de arrobas e valor do boi gordo.

## Arquivos

- `app.py` - servidor Flask
- `requirements.txt` - dependências Python
- `Procfile` - comando de inicialização para serviços de hospedagem
- `templates/` - página HTML
- `static/` - CSS e JavaScript

## Como rodar localmente

1. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
2. Execute:
   ```bash
   python app.py
   ```
3. Abra no navegador:
   ```
   http://127.0.0.1:5000/
   ```

## Deploy público recomendado

Este projeto pode ser hospedado em serviços como Render, Railway ou PythonAnywhere.

### Deploy no Render

1. Crie um repositório GitHub com esta pasta.
2. Crie conta em https://render.com.
3. No Render:
   - New → Web Service
   - Conecte ao GitHub e escolha o repositório
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. O Render fornece um link público que pode ser compartilhado.

### Deploy no Railway

1. Crie conta em https://railway.app.
2. Crie novo projeto e conecte com o repositório.
3. Configure o comando de inicialização:
   - Start Command: `gunicorn app:app`
4. O Railway fornece um link público.

### Deploy no PythonAnywhere

1. Crie conta em https://www.pythonanywhere.com.
2. Crie um novo Web App com Python e Flask.
3. Carregue os arquivos no diretório do site.
4. Configure o WSGI para apontar para `app.app`.

## Observação

- `app.py` já está pronto para aceitar conexões externas no host `0.0.0.0`.
- Se quiser um link temporário sem hospedar, use `ngrok http 5000` enquanto o app estiver rodando.
