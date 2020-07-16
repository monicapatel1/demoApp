import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import PhoneInput from '../../screen';
import styles from './style';
const EmailPhoneNumberComponent = () => {
  const [text, setText] = useState('');
  var phone = useRef(null);

  return (
    <View style={styles.container}>
      <PhoneInput
        style={styles.textInput}
        textProps={{placeholder: "Parent's Email ID/Phone number"}}
        ref={(ref) => {
          phone = ref;
        }}
        value={text}
      />
    </View>
  );
};
export default EmailPhoneNumberComponent;
