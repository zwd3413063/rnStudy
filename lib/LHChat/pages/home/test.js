"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
// export default ({ name, count = 1, onInc, onDec }: Props) => (
//     <View style={styles.root}>
//       <Text>
//         Counter {name}: {count}
//       </Text>
//       <View>
//         <Button title="+" onPress={onInc || (() => {})} />
//         <Button title="-" onPress={onDec || (() => {})} />
//       </View>
//     </View>
//   );
class test extends Comment {
    constructor() {
        super();
        this.name = '';
        this.count = 0;
        this.onInc = () => {
        };
        this.onDec = () => {
        };
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.root },
            React.createElement(react_native_1.Text, null,
                "Counter ",
                this.name,
                ": ",
                this.count),
            React.createElement(react_native_1.View, null,
                React.createElement(react_native_1.Button, { title: "+", onPress: this.onInc || (() => { }) }),
                React.createElement(react_native_1.Button, { title: "-", onPress: this.onDec || (() => { }) }))));
    }
}
exports.default = test;
// styles
const styles = react_native_1.StyleSheet.create({
    root: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    buttons: {
        flexDirection: 'row',
        minHeight: 70,
        alignItems: 'stretch',
        alignSelf: 'center',
        borderWidth: 5,
    },
    button: {
        flex: 1,
        paddingVertical: 0,
    },
    greeting: {
        color: '#999',
        fontWeight: 'bold',
    },
});
//# sourceMappingURL=test.js.map