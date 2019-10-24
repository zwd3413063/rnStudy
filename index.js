/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import root from './LHChat/config/LHRouteManger';
import ListView from './LHChat/pages/home/CustomFlatlist';

AppRegistry.registerComponent(appName, () => root);
