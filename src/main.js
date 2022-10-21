import "./css/index.css"
import IMask from "imask";

const ccBgColor1 = document.querySelector("#app > .cc > .cc-bg > svg > g g:nth-child(1) path")
const ccBgColor2 = document.querySelector("#app > .cc > .cc-bg > svg > g g:nth-child(2) path")
const ccLogo = document.querySelector("#app > .cc > .cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    amex: ["#3B4095", "#00ACEC"],
    elo: ["#FFCB05", "#EF4123"],
    default: ["gray", "black"]
  }

  ccBgColor1.setAttribute("fill", colors[type][1])
  ccBgColor2.setAttribute("fill", colors[type][0])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.getElementById("security-code")
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.getElementById("expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.getElementById("card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4011(78|79)\d{0,10}|^43(1274|8935)|^45(1416|7393|763(1|2))|^4984(05|1([0-2]|[8-9])|2([0-2]|[7-9])|(3|7)[2-3]|87|9([3-4]|[7-8]))\d{0,10}|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-9]{3})\d{0,10}|^627780\d{0,10}|^63(6297|6368|6369)\d{0,12}|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
      cardType: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4[0,9]{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(34|37)\d{0,13}/,
      cardType: "amex",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1,5]\d{0,2}|^22[2,9]\d|^2[3,7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default"
    }
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex))

    return foundMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault()
})

const cardHolder = document.getElementById("card-holder")
cardHolder.addEventListener("input", (e) => {
  const ccHolder = document.querySelector(".cc-holder .value")
  console.log(ccHolder)
  ccHolder.innerText = cardHolder.value.length ? cardHolder.value : "fulano da silva"
})

const addButton = document.querySelector("button") // Por termos apenas uma tag button
addButton.addEventListener("click", (e) => {
  alert("Adicionando nosso cartão")
})

let defaultSecurityCode = "123"
let defaultCardNumber = "1234 5678 9012 3456"

securityCodeMasked.on("accept", ({ target }) => {
  const valueSecurityCode = target.value.length ? target.value : defaultSecurityCode
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = valueSecurityCode
})

cardNumberMasked.on("accept", (e) => {
  const cardType = cardNumberMasked.masked.currentMask.cardType

  updateCardNumber(e.target.value)
  if (cardNumberMasked.value.length >= 4) {
    setCardType(cardType)
  } else {
    setCardType("default")
  }
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length ? number : defaultCardNumber
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerHTML = date.length ? date : "02/23"
}
