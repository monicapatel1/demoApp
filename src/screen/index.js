import React, {Component} from 'react';
import {Image, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import PropTypes from 'prop-types';

import Country from './country';
import Flags from './resources/flags';
import PhoneNumber from './phoneNumber';
import styles from './styles';

export default class PhoneInput extends Component {
  static setCustomCountriesData(json) {
    Country.setCustomCountriesData(json);
  }

  constructor(props, context) {
    super(props, context);

    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.getFlag = this.getFlag.bind(this);
    this.getISOCode = this.getISOCode.bind(this);

    const {disabled, initialCountry} = this.props;

    const countryData = PhoneNumber.getCountryDataByCode(initialCountry);

    this.state = {
      iso2: initialCountry,
      disabled,
      formattedNumber: countryData ? `+${countryData.dialCode}` : '',
      value: null,
      inputValue: '',
      isNumericType: false,
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.updateFlagAndFormatNumber(this.props.value);
    }
  }

  componentDidUpdate(nextProps) {
    const {value, disabled} = nextProps;

    if (value && value !== this.state.value) {
      this.setState({value});
      this.updateFlagAndFormatNumber(value);
    }
  }

  onChangePhoneNumber(number) {
    const actionAfterSetState = this.props.onChangePhoneNumber
      ? () => {
          this.props.onChangePhoneNumber(number);
        }
      : null;
    console.log('actionAfterSetState', actionAfterSetState);
    this.updateFlagAndFormatNumber(number, actionAfterSetState);
  }

  getCountryCode() {
    const countryData = PhoneNumber.getCountryDataByCode(this.state.iso2);
    return countryData ? countryData.dialCode : null;
  }

  getFlag(iso2) {
    return Flags.get(iso2);
  }

  getDialCode() {
    return PhoneNumber.getDialCode(this.state.formattedNumber);
  }

  getValue() {
    return this.state.formattedNumber.replace(/\s/g, '');
  }

  getISOCode() {
    return this.state.iso2;
  }

  format(text) {
    return this.props.autoFormat
      ? PhoneNumber.format(text, this.state.iso2)
      : text;
  }
  isNumeric(n) {
    return /^\d+$/.test(n);
  }
  updateFlagAndFormatNumber(number, actionAfterSetState = null) {
    const {allowZeroAfterCountryCode, initialCountry} = this.props;
    let iso2 = this.getISOCode() || initialCountry;
    let formattedPhoneNumber = number;
    // check entered Text is Number or not

    if (this.isNumeric(number)) {
      // 'number' is Numeric
      if (number) {
        const countryCode = this.getCountryCode();

        if (formattedPhoneNumber[0] !== '+' && countryCode !== null) {
          formattedPhoneNumber =
            '+' + countryCode.toString() + formattedPhoneNumber.toString();
        }
        formattedPhoneNumber = allowZeroAfterCountryCode
          ? formattedPhoneNumber
          : this.possiblyEliminateZeroAfterCountryCode(formattedPhoneNumber);
        iso2 = PhoneNumber.getCountryCodeOfNumber(formattedPhoneNumber);
      }
      // set state value to  'isNumericType = false'
      this.setState(
        {
          iso2,
          formattedNumber: formattedPhoneNumber,
          inputValue: number,
          isNumericType: true,
        },
        actionAfterSetState,
      );
    } else {
      // 'number' is alphabets
      // set state value to 'iso2 = '' ' and 'isNumericType = false'
      this.setState(
        {
          iso2: ' ',
          formattedNumber: formattedPhoneNumber,
          inputValue: number,
          isNumericType: false,
        },
        actionAfterSetState,
      );
    }
  }

  possiblyEliminateZeroAfterCountryCode(number) {
    const dialCode = PhoneNumber.getDialCode(number);
    return number.startsWith(`${dialCode}0`)
      ? dialCode + number.substr(dialCode.length + 1)
      : number;
  }

  focus() {
    this.inputPhone.focus();
  }

  blur() {
    this.inputPhone.blur();
  }

  render() {
    const {iso2, inputValue, disabled, isNumericType} = this.state;
    const TextComponent = this.props.textComponent || TextInput;
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableWithoutFeedback
          onPress={this.onPressFlag}
          disabled={disabled}>
          <Image
            source={Flags.get(iso2)}
            style={
              iso2 !== ' '
                ? [styles.flag, this.props.flagStyle]
                : styles.flagInactive
            }
            onPress={this.onPressFlag}
          />
        </TouchableWithoutFeedback>
        <View style={{flex: 1, marginLeft: this.props.offset || 10}}>
          <TextComponent
            ref={(ref) => {
              this.inputPhone = ref;
            }}
            editable={!disabled}
            autoCorrect={false}
            style={[styles.text, this.props.textStyle]}
            onChangeText={(text) => {
              this.onChangePhoneNumber(text);
            }}
            keyboardType={isNumericType === true ? 'numeric' : 'email-address'}
            underlineColorAndroid="rgba(0,0,0,0)"
            value={inputValue}
            {...this.props.textProps}
          />
        </View>
      </View>
    );
  }
}

const styleType = PropTypes.oneOfType([PropTypes.object, PropTypes.number]);

PhoneInput.propTypes = {
  textComponent: PropTypes.func,
  initialCountry: PropTypes.string,
  onChangePhoneNumber: PropTypes.func,
  value: PropTypes.string,
  style: styleType,
  flagStyle: styleType,
  textStyle: styleType,
  offset: PropTypes.number,
  textProps: PropTypes.object,
  allowZeroAfterCountryCode: PropTypes.bool,
};

PhoneInput.defaultProps = {
  initialCountry: ' ',
  disabled: false,
  allowZeroAfterCountryCode: true,
};
