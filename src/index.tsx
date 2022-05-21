import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  ViewStyle,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  LayoutAnimation,
} from 'react-native';
import valid from 'card-validator';
import Icons from './Icons';
import {
  isValidCardholderName,
  formatCardNumber,
  formatCardExpiry,
  formatCardCVC,
} from './Utils';

type CardType =
  | 'american-express'
  | 'diners-club'
  | 'mastercard'
  | 'cirrus'
  | 'maestro'
  | 'discover'
  | 'jcb'
  | 'visa'
  | 'unionpay'
  | 'generic';

interface CardTitles {
  name: string;
  number: string;
}

interface CardFields extends CardTitles {
  expiry: string;
  cvc: string;
}

export interface CardForm extends CardFields {
  type: CardType;
  isValidForm: boolean;
}

type CompactCcProps = {
  form?: CardForm;
  placeholders?: CardFields;
  showTitles?: boolean;
  titles?: CardTitles;
  invalidColor?: string;
  validColor?: string;
  placeholderColor?: string;
  acceptedCards?: Array<CardType>;
  invalidAcceptedCardText?: string;
  inputStyle?: ViewStyle;
  onChange: (form: CardForm) => void;
};

const defaultForm: CardForm = {
  name: '',
  number: '',
  expiry: '',
  cvc: '',
  type: 'generic',
  isValidForm: false,
};

const defaultPlaceHolders: CardFields = {
  name: 'Name on card',
  number: '•••• •••• •••• ••••',
  expiry: 'MM/YY',
  cvc: 'CVC',
};

const defaultTitles: CardTitles = {
  name: "Cardholder's Name",
  number: 'Card Number',
};

const defaultValidColor: string = '#484848';
const defaultInvalidColor: string = 'red';
const defaultInvalidAcceptedCardText: string =
  'You can only enter one of the accepted card types.';

export const CompactCcView = (props: CompactCcProps) => {
  const [form, setForm] = useState<CardForm>(props.form || defaultForm);
  const [showFullCCNumber, setShowFullCCNumber] = useState<boolean>(true);
  const [isInvalidName, setIsInvalidName] = useState<boolean>(false);
  const [isInvalidNumber, setIsInvalidNumber] = useState<boolean>(false);
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false);
  const [isInvalidExpiry, setIsInvalidExpiry] = useState<boolean>(false);
  const [isInvalidCVC, setIsInvalidCVC] = useState<boolean>(false);
  const [isAcceptedCard, setIsAcceptedCard] = useState<boolean>(true);

  const isAcceptedCardRef = useRef(isAcceptedCard);
  isAcceptedCardRef.current = isAcceptedCard;
  const refInputFullNumber = useRef<TextInput>(null);
  const refInputDate = useRef<TextInput>(null);
  const refInputCVC = useRef<TextInput>(null);

  const toggleCCNumber = () => {
    setShowFullCCNumber(!showFullCCNumber);
    LayoutAnimation.easeInEaseOut();
    if (!showFullCCNumber) {
      refInputFullNumber.current?.focus();
    }
  };

  const inputProps = (field: string) => {
    const {
      inputStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      titles,
      onChange,
    } = props;

    return {
      inputStyle: [styles.input, inputStyle],
      validColor: validColor || defaultValidColor,
      invalidColor: invalidColor || defaultInvalidColor,
      placeholderColor,
      field,
      value: form[field as keyof CardFields],
      placeholder: placeholders
        ? placeholders[field as keyof CardFields]
        : defaultPlaceHolders[field as keyof CardFields],
      title: titles
        ? titles[field as keyof CardTitles]
        : defaultTitles[field as keyof CardTitles],
      onChangeText: (value: string) => {
        let updatedForm = form;
        if (field === 'name') {
          if (isValidCardholderName(value)) setIsInvalidName(false);
        }
        if (field === 'number') {
          const ccValidation = valid.number(value);
          // Check for invalid CC number
          if (!ccValidation.isPotentiallyValid) setIsInvalidNumber(true);
          else if (isInvalidNumber) setIsInvalidNumber(false);
          // Check for potentially valid CC number
          if (ccValidation.card && ccValidation.isPotentiallyValid) {
            value = formatCardNumber(value, ccValidation.card);
            // If there is a card type restriction
            if (
              props.acceptedCards &&
              !props.acceptedCards.includes(ccValidation.card.type as CardType)
            ) {
              setIsAcceptedCard(false);
              updatedForm = { ...form, type: 'generic' };
            } else {
              updatedForm = {
                ...form,
                type: ccValidation.card.type as CardType,
              };
              if (!isAcceptedCard) setIsAcceptedCard(true);
            }
          } else {
            updatedForm = { ...form, type: 'generic' };
          }
          // Check for fully valid CC number
          if (ccValidation.isValid) {
            setIsValidNumber(true);
            toggleCCNumber();
            refInputDate.current?.focus();
          } else if (isValidNumber) {
            setIsValidNumber(false);
          }
        }
        if (field === 'expiry') {
          value = formatCardExpiry(value);
          const dateValidation = valid.expirationDate(value);
          // Check for invalid date
          if (!dateValidation.isPotentiallyValid) setIsInvalidExpiry(true);
          else if (isInvalidExpiry) setIsInvalidExpiry(false);
          // Check for fully valid date
          if (dateValidation.isValid) {
            refInputCVC.current?.focus();
          }
        }
        if (field === 'cvc') {
          const ccValidation = valid.number(inputProps('number').value);
          if (ccValidation.card) {
            value = formatCardCVC(value, ccValidation.card);
          }
          if (isInvalidCVC) {
            setIsInvalidCVC(false);
          }
        }
        // Update form value
        updatedForm = { ...updatedForm, [field]: value };
        // Form validation
        let isValidForm = false;
        if (
          isAcceptedCardRef.current &&
          isValidCardholderName(updatedForm.name)
        ) {
          const ccValidation = valid.number(updatedForm.number);
          if (
            ccValidation.isValid &&
            valid.expirationDate(updatedForm.expiry).isValid
          ) {
            if (updatedForm.cvc.length === ccValidation.card?.code.size) {
              isValidForm = true;
            }
          }
        }
        // Update form value for validation
        updatedForm = { ...updatedForm, isValidForm };
        // Update status and refresh onChange
        setForm(updatedForm);
        onChange(updatedForm);
      },
    };
  };

  return (
    <View style={styles.container}>
      {props.acceptedCards && (
        <View style={styles.cardsContainer}>
          {[...new Set(props.acceptedCards)].map((acceptedCard) => (
            <Image
              key={acceptedCard}
              style={styles.cardIcon}
              source={Icons[acceptedCard]}
            />
          ))}
        </View>
      )}
      {props.showTitles && (
        <Text style={styles.title}>{inputProps('name').title}</Text>
      )}
      {/* Name Textbox */}
      <TextInput
        style={[
          inputProps('name').inputStyle,
          {
            color: isInvalidName
              ? inputProps('name').invalidColor
              : inputProps('name').validColor,
          },
        ]}
        {...inputProps('name')}
        returnKeyType={'next'}
        placeholderTextColor={inputProps('name').placeholderColor}
        onSubmitEditing={() => refInputFullNumber.current?.focus()}
        maxLength={250}
        onBlur={() => {
          if (!isValidCardholderName(inputProps('name').value)) {
            setIsInvalidName(true);
          }
        }}
      />
      {props.showTitles && (
        <Text style={styles.title}>{inputProps('number').title}</Text>
      )}
      <View style={styles.cardContainer}>
        {/* Full Credit Card Number */}
        <View
          style={[
            styles.leftPart,
            showFullCCNumber ? styles.expanded : styles.hidden,
          ]}
        >
          <TextInput
            style={[
              inputProps('number').inputStyle,
              {
                color: isInvalidNumber
                  ? inputProps('number').invalidColor
                  : inputProps('number').validColor,
              },
              { marginRight: 10 },
            ]}
            {...inputProps('number')}
            keyboardType="numeric"
            ref={refInputFullNumber}
            placeholderTextColor={inputProps('number').placeholderColor}
            maxLength={50}
            onBlur={() => {
              if (!valid.number(inputProps('number').value).isValid) {
                setIsInvalidNumber(true);
              }
            }}
          />
        </View>
        {/* Credit Card last 4 digits */}
        <View
          style={[
            styles.rightPart,
            showFullCCNumber ? styles.hidden : styles.shortExpanded,
          ]}
        >
          <TouchableOpacity onPress={toggleCCNumber} style={styles.last4}>
            <View pointerEvents={'none'}>
              <TextInput
                style={[
                  inputProps('number').inputStyle,
                  { color: inputProps('number').validColor },
                ]}
                value={
                  isValidNumber ? inputProps('number').value.slice(-4) : ''
                }
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* Credit Card Type Icon */}
        <TouchableOpacity onPress={toggleCCNumber} style={styles.iconContainer}>
          <Image style={styles.icon} source={Icons[form.type]} />
        </TouchableOpacity>
        {/* Expiry and cvc */}
        <View
          style={[
            styles.otherFieldsContainer,
            showFullCCNumber ? styles.hidden : styles.expanded,
          ]}
        >
          <TextInput
            style={[
              inputProps('expiry').inputStyle,
              styles.otherFieldsInput,
              {
                color: isInvalidExpiry
                  ? inputProps('expiry').invalidColor
                  : inputProps('expiry').validColor,
              },
            ]}
            {...inputProps('expiry')}
            keyboardType="numeric"
            ref={refInputDate}
            placeholderTextColor={inputProps('expiry').placeholderColor}
            maxLength={5}
            onBlur={() => {
              if (!valid.expirationDate(inputProps('expiry').value).isValid) {
                setIsInvalidExpiry(true);
              }
            }}
          />
          <TextInput
            style={[
              inputProps('cvc').inputStyle,
              styles.otherFieldsInput,
              {
                color: isInvalidCVC
                  ? inputProps('cvc').invalidColor
                  : inputProps('cvc').validColor,
              },
            ]}
            {...inputProps('cvc')}
            keyboardType="numeric"
            ref={refInputCVC}
            placeholderTextColor={inputProps('cvc').placeholderColor}
            maxLength={4}
            onBlur={() => {
              // Check CVC whatever some card was entered
              const ccValidation = valid.number(inputProps('number').value);
              if (ccValidation.card) {
                if (
                  inputProps('cvc').value.length !== ccValidation.card.code.size
                ) {
                  setIsInvalidCVC(true);
                }
              } else {
                // Check general CVC if no card was not entered
                if (valid.cvv(inputProps('cvc').value).isValid) {
                  setIsInvalidCVC(true);
                }
              }
            }}
          />
        </View>
      </View>
      {!isAcceptedCard && (
        <Text style={styles.warning}>
          {props.invalidAcceptedCardText || defaultInvalidAcceptedCardText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  cardIcon: {
    width: 40,
    height: 28,
    resizeMode: 'contain',
    marginRight: 5,
  },
  title: {
    color: '#9b9b9b',
    marginBottom: 3,
  },
  warning: {
    color: '#ff4041',
  },
  cardContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    height: 40,
    justifyContent: 'center',
  },
  icon: {
    width: 60,
    height: 38,
    resizeMode: 'contain',
  },
  expanded: {
    flex: 1,
  },
  shortExpanded: {
    flex: 0.4,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: 'hidden',
  },
  rightPart: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  last4: {
    flex: 1,
    marginRight: 10,
  },
  otherFieldsContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otherFieldsInput: {
    flex: 1,
    marginLeft: 8,
  },
  input: {
    borderColor: '#9B9B9B',
    fontSize: 18,
    borderRadius: 5,
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
  },
});
