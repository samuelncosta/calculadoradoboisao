"""
=============================================================
  CALCULADORA DO PREÇO DA ARROBA DO BOI GORDO
  Backend Flask — app.py
=============================================================
"""

from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os

FATOR_ARROBA = 15.0

app = Flask(__name__)


def kg_para_arrobas(peso_kg: float) -> float:
    return peso_kg / FATOR_ARROBA


def calcular_valor_total(arrobas: float, preco_arroba: float) -> float:
    return arrobas * preco_arroba


def calcular_peso_rendimento(peso_kg: float, rendimento_pct: float) -> float:
    return peso_kg * (rendimento_pct / 100.0)


def validar_entradas(peso_kg, preco_arroba, rendimento):
    erros = []

    try:
        peso = float(peso_kg)
        if peso <= 0:
            erros.append("O peso do animal deve ser maior que zero.")
        elif peso > 2000:
            erros.append("Peso incomum: valor acima de 2.000 kg. Verifique o campo.")
    except (TypeError, ValueError):
        erros.append("Peso inválido: informe apenas números no campo de peso.")

    try:
        preco = float(preco_arroba)
        if preco <= 0:
            erros.append("O preço da arroba deve ser maior que zero.")
        elif preco > 50000:
            erros.append("Preço da arroba incomum. Verifique o valor informado.")
    except (TypeError, ValueError):
        erros.append("Preço inválido: informe apenas números no campo de preço.")

    try:
        rend = float(rendimento) if rendimento not in (None, "", "0") else 52.0
        if not (20.0 <= rend <= 75.0):
            erros.append("Rendimento deve estar entre 20% e 75%.")
    except (TypeError, ValueError):
        erros.append("Rendimento inválido: informe um percentual válido.")

    if erros:
        return False, " | ".join(erros)

    return True, None


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/calcular", methods=["POST"])
def calcular():
    dados = request.get_json(silent=True) or {}

    peso_kg      = dados.get("peso_kg")
    preco_arroba = dados.get("preco_arroba")
    rendimento   = dados.get("rendimento", 52.0)

    valido, mensagem_erro = validar_entradas(peso_kg, preco_arroba, rendimento)
    if not valido:
        return jsonify({"sucesso": False, "erro": mensagem_erro}), 400

    peso_kg      = float(peso_kg)
    preco_arroba = float(preco_arroba)
    rendimento   = float(rendimento) if rendimento not in (None, "", "0") else 52.0

    arrobas_vivo  = kg_para_arrobas(peso_kg)
    valor_vivo    = calcular_valor_total(arrobas_vivo, preco_arroba)

    peso_carcaca  = calcular_peso_rendimento(peso_kg, rendimento)
    arrobas_carc  = kg_para_arrobas(peso_carcaca)
    valor_carcaca = calcular_valor_total(arrobas_carc, preco_arroba)

    preco_por_kg  = preco_arroba / FATOR_ARROBA
    agora = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    return jsonify({
        "sucesso": True,
        "timestamp": agora,
        "entrada": {
            "peso_kg": peso_kg,
            "preco_arroba": preco_arroba,
            "rendimento": rendimento
        },
        "resultado": {
            "arrobas_vivo":    round(arrobas_vivo,  4),
            "valor_vivo":      round(valor_vivo,     2),
            "peso_carcaca":    round(peso_carcaca,   2),
            "arrobas_carcaca": round(arrobas_carc,   4),
            "valor_carcaca":   round(valor_carcaca,  2),
            "preco_por_kg":    round(preco_por_kg,   4),
            "fator_arroba":    FATOR_ARROBA
        }
    })


@app.route("/cotacao-referencia", methods=["GET"])
def cotacao_referencia():
    referencias = [
        {"regiao": "São Paulo (Média histórica)",    "preco": 285.00},
        {"regiao": "Mato Grosso (Média histórica)",  "preco": 278.00},
        {"regiao": "Goiás (Média histórica)",        "preco": 280.00},
        {"regiao": "Minas Gerais (Média histórica)", "preco": 282.00},
        {"regiao": "Paraná (Média histórica)",       "preco": 279.00},
    ]
    return jsonify({"sucesso": True, "referencias": referencias})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
