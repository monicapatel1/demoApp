import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  basicContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  flag: {
    height: 20,
    width: 30,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#cecece',
    backgroundColor: '#cecece',
  },
  flagInactive: {
    height: 1,
    width: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  text: {
    height: 20,
    padding: 0,
    justifyContent: 'center',
  },
});
