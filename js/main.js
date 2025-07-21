document.addEventListener('DOMContentLoaded', function () {
  // Elementos do DOM
  const elementos = {
    inputNumeroCartao: document.getElementById('cardNumber'),
    logoBandeira: document.getElementById('card-logo'),
    inputNomeTitular: document.getElementById('cardholderName'),
    inputMesExpiracao: document.getElementById('expDateMM'),
    inputAnoExpiracao: document.getElementById('expDateYY'),
    inputCvc: document.getElementById('cvc'),
    displayNumeroCartao: document.querySelectorAll('.card-number span'),
    displayNomeTitular: document.querySelector('.card-info span:first-child'),
    displayDataExpiracao: document.querySelector('.card-info span:last-child'),
    displayCvc: document.querySelector('.card-back span'),
  }

  // Configurações das bandeiras de cartão
  const bandeirasCartao = {
    visa: {
      padrao: /^4/,
      logo: '../images/visa.svg',
    },
    mastercard: {
      padrao: /^5[1-5]/,
      logo: '../images/mastercard.svg',
    },
    amex: {
      padrao: /^3[47]/,
      logo: '../images/amex-logo.svg',
    },
    elo: {
      padrao:
        /^4011|^431274|^438935|^451416|^457393|^504175|^506699|^5067|^509|^627780|^636297|^636368/,
      logo: '../images/elo-logo.svg',
    },
    hipercard: {
      padrao: /^606282|^3841/,
      logo: '../images/hipercard-logo.svg',
    },
  }

  /**
   * Formata o número do cartão com espaços a cada 4 dígitos
   * @param {string} numero - Número do cartão a ser formatado
   * @returns {string} Número formatado
   */
  function formatarNumeroCartao(numero) {
    const apenasDigitos = numero.replace(/\s+/g, '').replace(/[^0-9]/g, '')

    // Limita a 16 dígitos
    const numeroLimitado = apenasDigitos.substring(0, 16)
    const grupos = numeroLimitado.match(/\d{1,4}/g)

    return grupos ? grupos.join(' ') : ''
  }

  /**
   * Valida se o mês está entre 01 e 12
   * @param {string} mes - Mês a ser validado
   * @returns {boolean} Verdadeiro se válido
   */
  function validarMes(mes) {
    const mesNum = parseInt(mes, 10)
    return mesNum >= 1 && mesNum <= 12
  }

  /**
   * Formata e valida entrada de mês
   * @param {string} valor - Valor do input
   * @returns {string} Valor formatado
   */
  function formatarMes(valor) {
    const apenasDigitos = valor.replace(/[^0-9]/g, '').substring(0, 2)

    if (apenasDigitos.length === 2) {
      const mes = parseInt(apenasDigitos, 10)
      if (mes > 12) return '12'
      if (mes < 1 && apenasDigitos !== '0') return '01'
    }

    return apenasDigitos
  }

  /**
   * Formata ano (apenas 2 dígitos)
   * @param {string} valor - Valor do input
   * @returns {string} Valor formatado
   */
  function formatarAno(valor) {
    return valor.replace(/[^0-9]/g, '').substring(0, 2)
  }

  /**
   * Formata CVC (3 ou 4 dígitos dependendo da bandeira)
   * @param {string} valor - Valor do input
   * @param {string} bandeira - Bandeira do cartão
   * @returns {string} Valor formatado
   */
  function formatarCvc(valor, bandeira = null) {
    const maxDigitos = bandeira === 'amex' ? 4 : 3
    return valor.replace(/[^0-9]/g, '').substring(0, maxDigitos)
  }

  /**
   * Identifica a bandeira do cartão baseado no número
   * @param {string} numero - Número do cartão
   * @returns {string|null} Nome da bandeira ou null se não identificado
   */
  function identificarBandeira(numero) {
    const numeroLimpo = numero.replace(/\s+/g, '')

    for (const [bandeira, info] of Object.entries(bandeirasCartao)) {
      if (info.padrao.test(numeroLimpo)) {
        return bandeira
      }
    }

    return null
  }

  /**
   * Atualiza o logo da bandeira no cartão
   * @param {string|null} bandeira - Nome da bandeira ou null
   */
  function atualizarLogoBandeira(bandeira) {
    if (bandeira && bandeirasCartao[bandeira]) {
      elementos.logoBandeira.src = bandeirasCartao[bandeira].logo
      elementos.logoBandeira.style.display = 'block'
      elementos.logoBandeira.alt = `Logo ${bandeira}`
    }
  }

  /**
   * Atualiza a exibição do número do cartão no cartão frontal
   * @param {string} numero - Número do cartão
   */
  function atualizarExibicaoNumeroCartao(numero) {
    const numeroLimpo = numero.replace(/\s+/g, '')

    elementos.displayNumeroCartao.forEach((span, indice) => {
      const inicio = indice * 4
      const digitos = numeroLimpo.substring(inicio, inicio + 4)

      // Se há dígitos para este grupo, mostra eles + zeros para completar 4 caracteres
      if (digitos.length > 0) {
        const grupoCompleto = digitos.padEnd(4, '0')
        span.textContent = grupoCompleto
      } else {
        // Se não há dígitos, mantém 0000
        span.textContent = '0000'
      }
    })
  }

  // Configuração dos event listeners
  function configurarEventListeners() {
    // Atualiza número do cartão e bandeira
    elementos.inputNumeroCartao.addEventListener('input', function (e) {
      this.value = formatarNumeroCartao(this.value)
      const bandeira = identificarBandeira(this.value)
      atualizarLogoBandeira(bandeira)
      atualizarExibicaoNumeroCartao(this.value)
    })

    // Atualiza nome do titular (apenas letras e espaços)
    elementos.inputNomeTitular.addEventListener('input', function (e) {
      // Remove caracteres que não são letras ou espaços
      this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').substring(0, 30)
      elementos.displayNomeTitular.textContent = this.value || 'Cardholder Name'
    })

    // Atualiza mês de expiração
    elementos.inputMesExpiracao.addEventListener('input', function (e) {
      this.value = formatarMes(this.value)
      const ano = elementos.inputAnoExpiracao.value
      elementos.displayDataExpiracao.textContent =
        (this.value || '00') + '/' + (ano || '00')
    })

    // Atualiza ano de expiração
    elementos.inputAnoExpiracao.addEventListener('input', function (e) {
      this.value = formatarAno(this.value)
      const mes = elementos.inputMesExpiracao.value
      elementos.displayDataExpiracao.textContent =
        (mes || '00') + '/' + (this.value || '00')
    })

    // Atualiza CVC
    elementos.inputCvc.addEventListener('input', function (e) {
      const bandeira = identificarBandeira(elementos.inputNumeroCartao.value)
      this.value = formatarCvc(this.value, bandeira)
      elementos.displayCvc.textContent = this.value || '000'
    })

    // Adiciona validação no envio do formulário
    document.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault()
      validarFormulario()
    })
  }

  /**
   * Valida todo o formulário
   */
  function validarFormulario() {
    const numeroCartao = elementos.inputNumeroCartao.value.replace(/\s/g, '')
    const nome = elementos.inputNomeTitular.value.trim()
    const mes = elementos.inputMesExpiracao.value
    const ano = elementos.inputAnoExpiracao.value
    const cvc = elementos.inputCvc.value

    let valido = true

    // Validação do número do cartão (deve ter 16 dígitos)
    if (numeroCartao.length !== 16) {
      alert('Número do cartão deve ter 16 dígitos')
      valido = false
    }

    // Validação do nome
    if (nome.length < 2) {
      alert('Nome do titular deve ter pelo menos 2 caracteres')
      valido = false
    }

    // Validação do mês
    if (!mes || !validarMes(mes)) {
      alert('Mês de expiração inválido')
      valido = false
    }

    // Validação do ano
    if (!ano || ano.length !== 2) {
      alert('Ano de expiração deve ter 2 dígitos')
      valido = false
    }

    // Validação do CVC
    const bandeira = identificarBandeira(numeroCartao)
    const cvcTamanhoEsperado = bandeira === 'amex' ? 4 : 3
    if (cvc.length !== cvcTamanhoEsperado) {
      alert(`CVC deve ter ${cvcTamanhoEsperado} dígitos`)
      valido = false
    }

    if (valido) {
      alert('Cartão validado com sucesso!')
      limparFormulario()
    }
  }

  /**
   * Limpa todos os campos do formulário e restaura os valores padrão no cartão
   */
  function limparFormulario() {
    // Limpa os inputs
    elementos.inputNumeroCartao.value = ''
    elementos.inputNomeTitular.value = ''
    elementos.inputMesExpiracao.value = ''
    elementos.inputAnoExpiracao.value = ''
    elementos.inputCvc.value = ''

    // Restaura os valores padrão no cartão
    elementos.displayNumeroCartao.forEach((span) => {
      span.textContent = '0000'
    })

    elementos.displayNomeTitular.textContent = 'Cardholder Name'
    elementos.displayDataExpiracao.textContent = '00/00'
    elementos.displayCvc.textContent = '000'

    // Restaura o logo padrão do cartão
    elementos.logoBandeira.src = './images/card-logo.svg'
    elementos.logoBandeira.alt = 'Logo do cartão'
  }

  // Inicializa a aplicação
  function inicializar() {
    configurarEventListeners()
  }

  inicializar()
})
