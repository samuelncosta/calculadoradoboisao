# Calculadora de Arroba · Boi Gordo

Projeto acadêmico Flask para cálculo de arrobas, valor total e análise de rendimento de carcaça do boi gordo.

**Fórmulas principais:**
- 1 Arroba = 15 kg
- Arrobas = Peso ÷ 15
- Valor Total = Arrobas × Preço/@

---

## 🌐 Acesso Online (Sem instalar nada)

Clique no link para acessar a calculadora diretamente:

👉 **https://calculadoradoboisao.onrender.com**

Funciona em qualquer navegador (PC, tablet, celular).

---

## 💻 Executar Localmente

Se você quer rodar no seu computador:

### Pré-requisitos
- **Python 3.7+** instalado
- **pip** (gerenciador de pacotes Python)

### Passos

1. **Crie uma pasta para o projeto** (ou use uma já existente)

2. **Abra o terminal/PowerShell** na pasta do projeto

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute o servidor:**
   ```bash
   python app.py
   ```

5. **Abra no navegador:**
   - Digite na barra de endereço:
   ```
   http://127.0.0.1:5000
   ```
   ou
   ```
   http://localhost:5000
   ```

6. **Use a calculadora** normalmente

---

## 📂 Estrutura de Arquivos

```
calculadoradoarroba/
├── app.py                    # Servidor Flask (backend)
├── requirements.txt          # Dependências Python
├── Procfile                  # Para deployment no Render
├── README.md                 # Este arquivo
├── static/
│   ├── css/
│   │   └── style.css        # Estilos da página
│   └── js/
│       └── main.js          # Lógica JavaScript (frontend)
└── templates/
    └── index.html           # Página HTML principal
```

---

## 🚀 Funcionalidades

✅ Cálculo de arrobas do animal vivo  
✅ Cálculo de arrobas da carcaça (com rendimento configurável)  
✅ Cálculo de valor total do animal  
✅ Cálculo de preço por kg  
✅ Cotações de referência por região  
✅ Histórico de cálculos  
✅ Interface responsiva (mobile, tablet, desktop)  
✅ Tema claro/escuro  

---

## 📋 Como usar a calculadora

1. **Informe o peso do animal** (em kg)
2. **Informe o preço da arroba** (em R$)
3. **Rendimento de carcaça** (opcional, padrão: 52%)
4. Clique em **Calcular Valor**
5. Veja os resultados:
   - Arrobas do peso vivo
   - Peso e arrobas da carcaça
   - Valor total estimado
   - Preço por kg

---

## 🛠 Tecnologias utilizadas

- **Backend:** Python + Flask
- **Frontend:** HTML5 + CSS3 + JavaScript (vanilla)
- **Hospedagem:** Render.com
- **Ícones:** Tabler Icons
- **Fonts:** Google Fonts (Playfair Display + DM Sans)

---

## 📝 Notas

- A calculadora usa **1 arroba = 15 kg** (padrão brasileiro)
- O rendimento padrão é **52%** para boi gordo (configurável entre 20% e 75%)
- As cotações são apenas **referências históricas**
- Os cálculos são feitos localmente no navegador (sem dados armazenados)

---

## 👨‍💻 Autor

Projeto acadêmico para atividade de programação.

---

## 📞 Suporte

- **Acesso online:** https://calculadoradoboisao.onrender.com
- **Repositório:** https://github.com/samuelncosta/calculadoradoboisao
- Para rodar localmente, certifique-se de ter Python e pip instalados
