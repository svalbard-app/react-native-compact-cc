# React Native Compact Credit Card

React Native Compact Credit Card provides a form and utilities for credit card data inputs. It's designed as a React Native component ready to use in a iOS or Android project. Its features include:

* Credit-Card identification, formatting and validation while typing
* Setup for accepted credit cards
* Credit-Card date validation
* Credit-Card holder name validation
* Credit-Card CVC validation
* Fully keyboard-navigable form
* Configured to accept customizable styles to suit your App

<p align="center">
<img src="https://github.com/svalbard-app/react-native-compact-cc/blob/main/screenshots/cc-form-animation2.gif?raw=true" width=200/>
</p>

## Installation

```sh
npm install react-native-compact-cc
```

or

```sh
yarn add react-native-compact-cc
```

## Usage

```js
import { CompactCcView } from 'react-native-compact-cc';

// ...

<CompactCcView
   onChange={handleCardChange}
   acceptedCards={['visa', 'mastercard', 'discover', 'american-express']} />
```

```js
const handleCardChange = (form) => {
    console.log(form);
};

/* Console output:
{
  name: "Jon Snow",
  number: "4242 4242 4242 4242",
  type: "visa",
  expiry: "05/29",
  cvc: "123",
  isValidForm: true,
}
*/
```

## Props

| Property | Type | Description |
| --- | --- | --- |
|onChange | PropTypes.func | Receives a `CardForm` object every time the form changes |
|form | PropTypes.objectOf(CardForm) | You can set the default values of the Credit-Card form, such as the cardholder's name or any other field |
|acceptedCards | PropTypes.arrayOf(CardType) | Credit card list that will be accepted only |
|invalidAcceptedCardText | PropTypes.string | Text to be displayed when typing a credit card that is not accepted. Defaults to: `"You can only enter one of the accepted card types."` |
|placeholders | PropTypes.objectOf(CardFields) | Defaults to: <br/>`{ name: 'Name on card', number: '•••• •••• •••• ••••', expiry: 'MM/YY', cvc: 'CVC' }` |
|placeholderColor | PropTypes.string | Color that will be applied for text input placeholder |
|validColor | PropTypes.string | Color that will be applied for valid text input |
|invalidColor | PropTypes.string | Color that will be applied for invalid text input. Defaults to: `"red"` |
|inputStyle | Text.propTypes.style | Style for Credit-Card form's textInput |
|showTitles | PropTypes.boolean | Indicates whether or not to display the titles over the input text fields |
|titles | PropTypes.objectOf(CardTitles) | Titles for the input text fields. Defaults to: <br/>`{ name: "Cardholder's Name", number: 'Card Number' }`

# Example

You can see this component in action from this <ins>Test App</ins> available on [App Store](https://apps.apple.com/us/app/adventure-travel-project/id1521392632) or [Google Play](https://play.google.com/store/apps/details?id=com.adventuretravelapp). You can do a fake test checkout from there.

Or, in the `example` directory, run:

```bash
npm install

react-native run-ios
# or
react-native run-android
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
