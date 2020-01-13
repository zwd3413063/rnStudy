/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import root from './LHChat/config/LHRouteManger';
import DGGlobal from './LHChat/config/DGGlobal';

AppRegistry.registerComponent(appName, () => root);
