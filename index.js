/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import root from './LHChat/config/LHRouteManger';

AppRegistry.registerComponent(appName, () => root);
