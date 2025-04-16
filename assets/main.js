document.addEventListener('DOMContentLoaded', function () {
  const cardNumber = document.getElementById('spans')
  const spansNumber = document.querySelectorAll('.spans span')
  const cardLogo = document.getElementById('cardLogo')
  const nomeCard = document.getElementById('nameCard')
  const dataCard = document.getElementById('dataCard')
  const cardCVC = document.getElementById('CardCVC')
  const name = document.getElementById('name')
  const number = document.getElementById('cardNumber')
  const mes = document.getElementById('mes')
  const ano = document.getElementById('ano')
  const cvc = document.getElementById('CVC')
  const button = document.querySelector('#Confirm')
  const error = document.querySelectorAll('p')

  error.forEach((elem) => {
    elem.style.display = 'none'
  })
  spansNumber.forEach((elem) => {
    elem.innerText = '0000'
  })

  nomeCard.innerText = 'Your name'
  dataCard.innerText = `00/00`
  cardCVC.innerText = '000'

  button.addEventListener('click', (event) => {
    event.preventDefault()

    if (
      number.value === '' ||
      mes.value === '' ||
      ano.value === '' ||
      cvc.value === ''
    ) {
      error.forEach((elem) => {
        elem.style.display = 'block'
      })
    } else {
      error.forEach((elem) => {
        elem.style.display = 'none'
      })
      nomeCard.innerText = name.value
      dataCard.innerText = `${mes.value}/${ano.value}`
      cardCVC.innerText = cvc.value
    }
  })
})
